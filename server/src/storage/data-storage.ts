import * as fs from "fs";
import jsonSchema from "src/storage/json.schema";
import * as tv4 from "tv4";
import {sleep} from "./functions";

import {
    ICurrent,
    IDataObject,
    IHour,
    IStorageAccessKeys,
    TDataType,
    TDay,
    THour,
    TWeek,
    TYear,
} from "./stoarge.interfaces";

/**
 * An object which handles the updating and storing of the collected data
 */
export default class DataStorage {
    private fileName: string;

    private _data: TDataType = {
        current: {
            maxPersonCount: 0,
            value: 0,
        },
        year: {},
    };
    private _saveData: boolean = false;

    public JSONSchema = jsonSchema;
    public saveInterval = 5 * 60 * 1000;
    public maxPersonCount: number;

    /**
     * Create a new DataStorage. To use the autosave feature set saveData to true
     * @param maxPersonCount The maximal person count the percentage refers to. Will be updated weekly
     * @param fileName The filename the data will be saved
     */
    constructor(maxPersonCount: number, fileName = "data.json") {
        this.fileName = fileName;
        this.maxPersonCount = maxPersonCount;
    }

    /**
     * Validate the json scheme
     * @param json The json
     */
    public validateJSON(json: TDataType): void {
        const value: boolean = tv4.validate(json, this.JSONSchema);
        if (value === false) throw Error(JSON.stringify(tv4.error));
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
     * Set the value to true to start the saveData service and to false to stop it
     * @param value True > start saving False > stop saving
     */
    set saveData(value: boolean) {
        this._saveData = value;
        if (this._saveData) {
            this.startAutoSaver();
        }
    }

    get data(): TDataType {
        return this._data;
    }

    /**
     * Set new data in the database
     * @param value The new value
     * @throws Error if data structure is not valid
     */
    set data(value: TDataType) {
        this.validateJSON(value);
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
                const fileData = JSON.parse(data.toString("utf8"));
                try {
                    this.validateJSON(fileData);
                } catch (e) {
                    reject(e);
                }

                this._data = fileData;
                resolve();
            });
        });
    }

    /**
     * Write the internal data to a file
     * @param fileName Optional the filename the data should be saved to
     */
    public writeToFile(fileName = this.fileName): Promise<any> {
        return new Promise(resolve => {
            const dataString = JSON.stringify(this._data);
            fs.writeFile(fileName, dataString, resolve);
        });
    }

    /**
     * Merge existing data in the current database
     * @param database The database which should be merged
     * @throws Error if data structure is not valid
     */
    public mergeDataBases(database: TDataType): void {
        // Validate the database schema
        this.validateJSON(database);

        // For each year
        for (const year in database.year) {
            if (!database.year.hasOwnProperty(year)) continue;
            const yearObject: TWeek[] = database.year[year];

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
                            day: day as TDay,
                            hour: parseInt(hour),
                            firstHalf: true,
                        };

                        // Insert the data in the database
                        if (hourObject.firstHalf.valueCount !== 0) {
                            this.setInformation(
                                hourObject.firstHalf.value,
                                false,
                                hourObject.firstHalf.valueCount,
                                keys,
                            );
                        }
                        if (hourObject.secondHalf.valueCount !== 0) {
                            keys.firstHalf = false;
                            this.setInformation(
                                hourObject.secondHalf.value,
                                false,
                                hourObject.secondHalf.valueCount,
                                keys,
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * Set the information for a specific time
     * @param data The utilization
     * @param isCurrent Is this a current data
     * @param dataWeight The weight the data has (if it is one data point it is 1 if two combined in one 2, ...)
     * @param keys The keys which lead to the time
     */
    public setInformation(
        data: number,
        isCurrent: boolean = true,
        dataWeight: number = 1,
        keys: IStorageAccessKeys = DataStorage.getJSONKeys(),
    ): void {
        // Set current data
        if (isCurrent) {
            this._data.current.value = data;
            this._data.current.maxPersonCount = this.maxPersonCount;
        }

        // Extract the variables out of the object
        const {year, week, day, hour, firstHalf} = keys;

        if (!this._data.year[year]) {
            this._data.year[year] = DataStorage.initYear();
        }

        if (!this._data.year[year][week]) {
            this._data.year[year][week] = DataStorage.initWeek(this._data.current.maxPersonCount);
        }

        if (!this._data.year[year][week].data[day]) {
            DataStorage.initDays(this._data.year[year][week]);
        }

        let dataObject: IDataObject;
        if (firstHalf) dataObject = this._data.year[year][week].data[day][hour].firstHalf;
        else dataObject = this._data.year[year][week].data[day][hour].secondHalf;

        dataObject.value =
            (dataObject.value * dataObject.valueCount + data * dataWeight) / (dataObject.valueCount + dataWeight);
        dataObject.valueCount += dataWeight;
    }

    /**
     * Init the year
     */
    private static initYear(): TWeek[] {
        // week 0 is left empty
        return new Array<TWeek>(53);
    }

    /**
     * Init a week object
     * */
    private static initWeek(maxPersonCount: number): TWeek {
        // Initialize the week which should be used
        const weekObject: TWeek = {
            data: {
                Monday: new Array<IHour>(24),
                Saturday: new Array<IHour>(24),
                Sunday: new Array<IHour>(24),
                Thursday: new Array<IHour>(24),
                Tuesday: new Array<IHour>(24),
                Wednesday: new Array<IHour>(24),
                Friday: new Array<IHour>(24),
            },
            maxPersonCount: maxPersonCount,
        };

        DataStorage.initDays(weekObject);
        return weekObject;
    }

    /**
     * Init the days of a week
     * @param weekObject An initialized week object
     */
    private static initDays(weekObject: TWeek): Record<TDay, THour> {
        const weekList: Record<TDay, THour> = weekObject.data;
        for (const day in weekList) {
            if (!weekList.hasOwnProperty(day)) continue;

            weekList[day] = new Array<IHour>(24);
            for (let hour = 0; hour < 24; ++hour) {
                weekList[day][hour] = {
                    firstHalf: {
                        value: 0,
                        valueCount: 0,
                    },
                    secondHalf: {
                        value: 0,
                        valueCount: 0,
                    },
                };
            }
        }
        return weekList;
    }

    /**
     * Get the json access keys to data for the current time
     */
    public static getJSONKeys(currentDate = new Date()): IStorageAccessKeys {
        return {
            day: currentDate.toLocaleString("en-us", {
                weekday: "long",
            }) as TDay,
            year: currentDate.getFullYear(),
            week: DataStorage.getWeek() - 1,
            hour: currentDate.getHours(),
            firstHalf: currentDate.getMinutes() < 30,
        };
    }

    /**
     * Get current week number
     */
    public static getWeek(date = new Date()): number {
        // Copy the date object so you don't change the original
        date = new Date(date);

        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    }

    /*Extract the data*************************************************************************************************/

    extractCurrent(): ICurrent {
        return this._data.current;
    }

    extractDay(): Array<IHour> {
        const keys: IStorageAccessKeys = DataStorage.getJSONKeys();
        return this._data.year[keys.year][keys.week].data[keys.day];
    }

    extractWeek(): TWeek {
        const keys: IStorageAccessKeys = DataStorage.getJSONKeys();
        return this._data.year[keys.year][keys.week];
    }

    extractEstimation(): TWeek {
        const {year, week} = DataStorage.getJSONKeys();

        const weekObject: TWeek = DataStorage.initWeek(this._data.year[year][week].maxPersonCount);

        for (let i = week - 4; i <= week; ++i) {
            if (!this._data.year[year][i]) continue;

            const weekData = this._data.year[year][i].data;

            for (const day in weekData) {
                if (!weekData.hasOwnProperty(day)) continue;
                const dayObject: IHour[] = weekData[day];

                dayObject.forEach((hourObject: IHour, hour: number) => {
                    let data = hourObject.firstHalf.value;
                    let dataWeight = hourObject.firstHalf.valueCount;
                    weekObject.data[day][hour].firstHalf.value =
                        (hourObject.firstHalf.value * hourObject.firstHalf.valueCount + data * dataWeight) /
                        (hourObject.firstHalf.valueCount + dataWeight);
                    weekObject.data[day][hour].firstHalf.valueCount += dataWeight;

                    data = hourObject.secondHalf.value;
                    dataWeight = hourObject.secondHalf.valueCount;
                    weekObject.data[day][hour].secondHalf.value =
                        (hourObject.secondHalf.value * hourObject.secondHalf.valueCount + data * dataWeight) /
                        (hourObject.secondHalf.valueCount + dataWeight);
                    weekObject.data[day][hour].secondHalf.valueCount += dataWeight;
                });
            }
        }

        return weekObject;
    }

    extractMonth(): TWeek[] {
        const {year, week} = DataStorage.getJSONKeys();

        const month: TWeek[] = [];
        for (let i = 0; i < 4; ++i) {
            month.push(this._data.year[year][week - i]);
        }
        //TODO Make the month only a list of weeks with days

        return month;
    }

    extractYear(): TYear {
        const {year} = DataStorage.getJSONKeys();
        //TODO Make the year only a list of months with weeks

        return this._data.year[year];
    }
}
