import * as fs from "fs";
import {TOpeningHours} from "src/config";
import jsonSchema from "src/storage/json.schema";
import * as tv4 from "tv4";
import {IChartWeek, IWeekOverview} from "../facility/facility.interfaces";
import {sleep} from "./functions";

import {
    ICurrent,
    IDataObject,
    IHour,
    IStorageAccessKeys,
    TDay,
    THour,
    TStorageData,
    TWeek,
    TYear,
} from "./stoarge.interfaces";

/**
 * An object which handles the updating and storing of the collected data
 */
export default class DataStorage {
    private fileName: string;
    private readonly openingHours: TOpeningHours;

    private _data: TStorageData = {current: {maxPersonCount: 0, value: 0}, year: {}};
    private _saveData: boolean = false;

    public JSONSchema = jsonSchema;
    public saveInterval = 5 * 60 * 1000;
    public maxPersonCount: number;

    /**
     * Create a new DataStorage. To use the autosave feature set saveData to true
     * @param maxPersonCount The maximal person count the percentage refers to. Will be updated weekly
     * @param fileName The filename the data will be saved
     * @param openingHours The opening hours of the facility
     */
    constructor(maxPersonCount: number, fileName: string, openingHours: TOpeningHours) {
        this.fileName = fileName;
        this.maxPersonCount = maxPersonCount;
        this.openingHours = openingHours;
    }

    /**
     * Validate the json scheme
     * @param json The json
     */
    public validateJSON(json: TStorageData): void {
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

    /**
     * Get the data
     */
    get data(): TStorageData {
        return this._data;
    }

    /**
     * Set new data in the database
     * @param value The new value
     * @throws Error if data structure is not valid
     */
    set data(value: TStorageData) {
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
    public mergeDataBases(database: TStorageData): void {
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

        dataObject.value = (dataObject.value * dataObject.valueCount + data * dataWeight) /
            (dataObject.valueCount + dataWeight);
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

            for (let hour = 0; hour < 24; ++hour) {
                weekList[day][hour] = {
                    firstHalf: {value: 0, valueCount: 0,},
                    secondHalf: {value: 0, valueCount: 0,},
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
            week: DataStorage.getWeek(),
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

    /**
     * Extract the current utilization
     */
    extractCurrent(): ICurrent {
        return this._data.current;
    }

    /**
     * Extract the day hour by hour
     * @param keys
     */
    extractDay(keys: IStorageAccessKeys = DataStorage.getJSONKeys()): IChartWeek {
        const dayChart = this.makeDayChartCompatible({
            day: keys.day,
            data: this._data.year[keys.year][keys.week].data[keys.day]
        });

        return {
            data: [dayChart],
            maxPersonCount: this._data.year[keys.year][keys.week].maxPersonCount
        };
    }

    /**
     * Extract a week from the data
     * @param keys The access keys to the week
     */
    extractWeek(keys: IStorageAccessKeys = DataStorage.getJSONKeys()): IWeekOverview {
        const week: TWeek = this._data.year[keys.year][keys.week];

        const returnObject: { data: { day: TDay; value: number }[]; maxPersonCount: number } = {
            maxPersonCount: week.maxPersonCount,
            data: []
        };

        const temp: { day: TDay; data: THour }[] = DataStorage.sortDays(week.data);
        temp.forEach(dayObject => {
            returnObject.data.push(this.compressDay(dayObject));
        });

        return returnObject;
    }

    /**
     * Extract the estimated data for the next days
     */
    extractEstimation(): IChartWeek {
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

                    if (dataWeight === 0) return;

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
        return this.makeWeekChartCompatible(weekObject);
    }

    /**
     * Extract the month data
     */
    extractMonth(): TWeek[] {
        const {year, week} = DataStorage.getJSONKeys();

        const month: TWeek[] = [];
        for (let i = 0; i < 4; ++i) {
            month.push(this._data.year[year][week - i]);
        }
        //TODO Make the month only a list of weeks with days
        return month;
    }

    /**
     * Extract the year data
     */
    extractYear(): TYear {
        const {year} = DataStorage.getJSONKeys();
        //TODO Make the year only a list of months with weeks
        return this._data.year[year];
    }

    /******************************************************************************************************************/

    /**
     * Convert the week data to a more chart compatible format
     * @param data The week data
     */
    private makeWeekChartCompatible(data: TWeek): IChartWeek {
        const convertedResponse: { day: TDay; data: IHour[] }[] = DataStorage.sortDays(data.data) as {
            day: TDay;
            data: IHour[];
        }[];

        const dataList: { day: TDay; data: number[], open: number, close: number }[] = [];

        convertedResponse.forEach((day: { day: TDay; data: IHour[] }) => {
            const dayObject = this.makeDayChartCompatible(day);
            dataList.push(dayObject);
        });

        return {
            data: dataList,
            maxPersonCount: data.maxPersonCount,
        };
    }

    /**
     * Compress the hours in a day to a average of a day
     * @param day The day which should be compressed
     */
    compressDay(day: { day: TDay; data: IHour[] }): { day: TDay; value: number } | null {

        const {open, close} = this.openingHours[day.day];

        let valueCount = 0;
        let dayAverage = 0;
        for (let i = open; i < close; ++i) {
            const hourObject: IHour = day.data[i];

            if (hourObject.firstHalf.valueCount !== 0) {
                valueCount += hourObject.firstHalf.valueCount;
                dayAverage += hourObject.firstHalf.value;
            }

            if (hourObject.secondHalf.valueCount !== 0) {
                valueCount += hourObject.secondHalf.valueCount;
                dayAverage += hourObject.secondHalf.value;
            }
        }

        if (valueCount === 0) return {
            day: day.day,
            value: 0
        };

        return {
            day: day.day,
            value: dayAverage / valueCount
        };
    }

    /**
     * Bring a day in a more chart compatible object
     * @param day The day object
     */
    private makeDayChartCompatible(day: { day: TDay; data: IHour[] }): { data: any[]; day: TDay; close: number; open: number } {
        const {open, close} = this.openingHours[day.day];
        const dayObject: { data: any[]; day: TDay; close: number; open: number } = {
            day: day.day,
            data: [],
            open: open,
            close: close
        };

        for (let i = open; i < close; ++i) {
            const hourObject: IHour = day.data[i];
            dayObject.data.push(hourObject.firstHalf.value);
            dayObject.data.push(hourObject.secondHalf.value);
        }

        return dayObject;
    }

    /**
     * Sort a object with the days as key into a list
     * @param dayList An object with the days of a week as keys
     */
    private static sortDays(dayList: Record<TDay, any>): { day: TDay; data: any }[] {
        const sorter: Record<TDay, number> = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 7,
        };

        const orderedData: { day: TDay; data: any }[] = new Array(7);
        let day: TDay;
        for (day in dayList) {
            if (!dayList.hasOwnProperty(day)) continue;

            const index = sorter[day];

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            orderedData[index] = {};
            orderedData[index].day = day;
            orderedData[index].data = dayList[day];
        }

        return orderedData;
    }
}
