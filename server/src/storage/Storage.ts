import * as fs from 'fs';

interface StorageAccessKeys {
    day: string;
    year: number;
    week: number;
    hour: number;
}

export default class DataStorage {
    private _data = {};
    private _saveData = false;

    private readonly startHour: number;
    private readonly endHour: number;

    public saveInterval = 10 * 60 * 1000;
    private readonly fileName: string;

    constructor(startHour = 1, endHour = 24, fileName = 'data.json') {
        this.startHour = startHour;
        this.endHour = endHour;
        this.fileName = fileName;
    }

    private startAutoSaver() {
        setTimeout(async () => {
            while (this._saveData) {
                await this.writeToFile();
                await sleep(this.saveInterval);
            }
            await this.writeToFile();
        }, 0);
    }

    private static getWeek() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }


    get saveData(): boolean {
        return this._saveData;
    }

    set saveData(value: boolean) {
        this._saveData = value;
        if (this._saveData) {
            this.startAutoSaver();
        }
    }

    get data(): any {
        return this._data;

    }

    set data(value: any) {
        this._data = value;
    }


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

    public writeToFile(fileName = this.fileName): Promise<any> {
        return new Promise(((resolve) => {
            const dataString = JSON.stringify(this._data);
            fs.writeFile(fileName, dataString, resolve);
        }));
    }

    public setInformation(data: number, keys: StorageAccessKeys = DataStorage.getJSONKeys()): void {
        if (!this._data[keys.year]) {
            this._data[keys.year] = {};
        }

        if (!this._data[keys.year][keys.week]) {
            this._data[keys.year][keys.week] = {};
        }

        if (!this._data[keys.year][keys.week][keys.day]) {
            this._data[keys.year][keys.week][keys.day] = {};

            for (let i = this.startHour; i <= this.endHour; ++i) {
                this._data[keys.year][keys.week][keys.day][i] = {
                    value: 0,
                    valueCount: 0
                };
            }
        }

        let valueCount: number = this._data[keys.year][keys.week][keys.day][keys.hour].valueCount;
        this._data[keys.year][keys.week][keys.day][keys.hour].valueCount = ++valueCount;

        let value = this._data[keys.year][keys.week][keys.day][keys.hour].value;
        value = value * (valueCount - 1) / valueCount;
        value += data / valueCount;
        this._data[keys.year][keys.week][keys.day][keys.hour].value = value;
    }

    public static getJSONKeys(): StorageAccessKeys {
        const currentDate = new Date();

        return {
            day: currentDate.toLocaleString('en-us', {weekday: 'long'}),
            year: currentDate.getFullYear(),
            week: DataStorage.getWeek(),
            hour: currentDate.getHours()
        };
    }
}

async function sleep(ms): Promise<void> {
    return new Promise((resolve => setTimeout(() => resolve(), ms)));
}