import * as fs from 'fs';
import {sleep} from './DataLoader';

type day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

interface IStorageAccessKeys {
    day: day;
    year: number;
    week: number;
    hour: number;
    firstHalf: boolean
}

export interface IHour {
    firstHalf: IDataObject
    secondHalf: IDataObject
}

export interface IDataObject {
    value: number
    valueCount: number
}

const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type Hour = Array<IHour>;
type Week = {
    data: Record<typeof dayList[number], Hour>
    maxPersonCount: number
}
type Year = Array<Week>;
export type DataType = Record<number, Year>;

/**
 * An object which handles the updating and storing of the collected data
 */
export default class DataStorage {

    private readonly fileName: string;

    private _data: DataType = {};
    private _saveData = false;

    public saveInterval = 5 * 60 * 1000;
    public maxPersonCount: number;

    /**
     * Create a new DataStorage. To use the autosave feature set saveData to true
     * @param maxPersonCount The maximal person count the percentage refers to. Will be updated weekly
     * @param fileName The filename the data will be saved
     */
    constructor(maxPersonCount: number, fileName = 'data.json') {
        this.fileName = fileName;
        this.maxPersonCount = maxPersonCount;
    }

    /**
     * Start the autosave feature (Writes the file if called and then waits for the saveInterval)
     */
    private startAutoSaver(): void {
        setTimeout(async () => {
            while (this._saveData) {
                await this.writeToFile();
                await sleep(this.saveInterval);
            }
            await this.writeToFile();
        }, 0);
    }

    /**
     * Get weather the current data gets saved continuously
     */
    get saveData(): boolean {
        return this._saveData;
    }

    /**
     * Set the value to true to start the saveData service and to false to stop it
     * @param value True > start saving False > stop saving
     */
    set saveData(value: boolean) {
        this._saveData = value;
        if (this._saveData) {
            this.startAutoSaver();
        }
    }

    get data(): DataType {
        return this._data;

    }

    set data(value: DataType) {
        this._data = value;
    }


    /**
     * Load the data from a file
     * @param fileName Optional the filename the data should be loaded from
     */
    public async loadFromFile(fileName = this.fileName): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._data = JSON.parse(data.toString('utf8'));
                resolve();
            });
        });
    }

    /**
     * Write the internal data to a file
     * @param fileName Optional the filename the data should be saved to
     */
    public writeToFile(fileName = this.fileName): Promise<any> {
        return new Promise(((resolve) => {
            const dataString = JSON.stringify(this._data);
            fs.writeFile(fileName, dataString, resolve);
        }));
    }

    /**
     * Merge existing data in the current database
     * @param database The database which should be merged
     */
    public mergeDataBases(database: DataType): void {

        // For each year
        for (const year in database) {
            if (!database.hasOwnProperty(year)) continue;
            const yearObject: Week[] = database[year];

            // For each week
            for (const week in yearObject) {
                if (!yearObject[week]) continue;

                const weekObject = yearObject[week].data;

                // For each day
                for (const day in weekObject) {
                    if (!weekObject.hasOwnProperty(day)) continue;
                    const dayObject: IHour[] = weekObject[day];

                    // For each hour
                    for (const hour in dayObject) {
                        const hourObject: IHour = dayObject[hour];

                        const keys: IStorageAccessKeys = {
                            year: parseInt(year),
                            week: parseInt(week),
                            day: day as day,
                            hour: parseInt(hour),
                            firstHalf: true,
                        };

                        // Insert the data in the database
                        if (hourObject.firstHalf.valueCount !== 0) {
                            this.setInformation(hourObject.firstHalf.value, hourObject.firstHalf.valueCount, keys);
                        }
                        if (hourObject.secondHalf.valueCount !== 0) {
                            keys.firstHalf = false;
                            this.setInformation(hourObject.secondHalf.value, hourObject.secondHalf.valueCount, keys);
                        }
                    }
                }
            }
        }
    }


    /**
     * Set the information for a specific time
     * @param data The utilization
     * @param dataWeight The weight the data has (if it is one data point it is 1 if two combined in one 2, ...)
     * @param keys The keys which lead to the time
     */
    public setInformation(data: number, dataWeight: number = 1, keys: IStorageAccessKeys = DataStorage.getJSONKeys()): void {

        // Extract the variables out of the object
        const {year, week, day, hour, firstHalf} = keys;

        if (!this._data[year]) {
            this.initYear(keys);
        }

        if (!this._data[year][week]) {
            this.initWeeks(keys);
        }

        if (!this._data[year][week].data[day]) {
            this.initDays(keys);
        }

        let dataObject: IDataObject;
        if (firstHalf) dataObject = this._data[year][week].data[day][hour].firstHalf;
        else dataObject = this._data[year][week].data[day][hour].secondHalf;

        dataObject.value = (dataObject.value * dataObject.valueCount + data * dataWeight) / (dataObject.valueCount + dataWeight);
        dataObject.valueCount += dataWeight;
    }

    /**
     * Init the year
     * @param keys Keys which specify what year, week, ...
     */
    private initYear(keys: IStorageAccessKeys): void {
        this._data[keys.year] = new Array<Week>(52);

        this.initWeeks(keys);
    }

    /**
     * Init the week
     * @param keys Keys which specify what year, week, ...
     * */
    private initWeeks(keys: IStorageAccessKeys): void {
        const {year, week} = keys;

        // Initialize the week which should be used
        this._data[year][week] = {
            data: {
                Monday: new Array<IHour>(24),
                Saturday: new Array<IHour>(24),
                Sunday: new Array<IHour>(24),
                Thursday: new Array<IHour>(24),
                Tuesday: new Array<IHour>(24),
                Wednesday: new Array<IHour>(24),
                Friday: new Array<IHour>(24)
            },
            maxPersonCount: this.maxPersonCount
        };

        this.initDays(keys);
    }

    /**
     * Init the days of a week
     * @param keys Keys which specify what year, week, ...
     */
    private initDays(keys: IStorageAccessKeys): void {
        const {year, week} = keys;

        const weekObject: Record<typeof dayList[number], Hour> = this._data[year][week].data;
        for (const day in weekObject) {
            if (!weekObject.hasOwnProperty(day)) continue;

            weekObject[day] = new Array<IHour>(24);
            for (let hour = 0; hour < 24; ++hour) {
                weekObject[day][hour] = {
                    firstHalf: {
                        value: 0,
                        valueCount: 0
                    },
                    secondHalf: {
                        value: 0,
                        valueCount: 0
                    }
                };
            }
        }
    }

    /**
     * Get the json access keys to data for the current time
     */
    public static getJSONKeys(currentDate = new Date()): IStorageAccessKeys {
        return {
            day: currentDate.toLocaleString('en-us', {weekday: 'long'}) as day,
            year: currentDate.getFullYear(),
            week: DataStorage.getWeek() - 1,
            hour: currentDate.getHours(),
            firstHalf: currentDate.getMinutes() < 30
        };
    }


    /**
     * Get current week number
     */
    private static getWeek(date = new Date()): number {

        // Copy the date object so you don't change the original
        date = new Date(date);

        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }
}