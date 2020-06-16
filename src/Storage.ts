import * as fs from 'fs';
import ApiClient from './ApiClient';

class DataStorage {
    private data = {};
    private _saveData = false;

    private readonly startHour = 1;
    private readonly endHour = 24;

    public saveInterval = 10 * 60 * 1000;
    private readonly fileName: string;

    constructor(startHour, endHour, fileName = 'data.json') {
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

    set saveData(value: boolean) {
        this._saveData = value;
        if (this._saveData) {
            this.startAutoSaver();
        }
    }

    get saveData(): boolean {
        return this._saveData;
    }

    public async loadFromFile(fileName = this.fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.data = JSON.parse(data.toString('utf8'));
                resolve();
            });
        });
    }

    public writeToFile(fileName = this.fileName) {
        return new Promise(((resolve) => {
            const dataString = JSON.stringify(this.data);
            fs.writeFile(fileName, dataString, resolve);
        }));
    }

    public setInformation(data, keys = DataStorage.getJSONKeys()) {
        if (!this.data[keys.year]) {
            this.data[keys.year] = {};
        }

        if (!this.data[keys.year][keys.week]) {
            this.data[keys.year][keys.week] = {};
        }

        if (!this.data[keys.year][keys.week][keys.day]) {
            this.data[keys.year][keys.week][keys.day] = {};

            for (let i = this.startHour; i <= this.endHour; ++i) {
                this.data[keys.year][keys.week][keys.day][i] = {
                    value: 0,
                    valueCount: 0
                };
            }
        }

        let valueCount: number = this.data[keys.year][keys.week][keys.day][keys.hour].valueCount;
        this.data[keys.year][keys.week][keys.day][keys.hour].valueCount = ++valueCount;

        let value = this.data[keys.year][keys.week][keys.day][keys.hour].value;
        value = value * (valueCount - 1) / valueCount;
        value += data / valueCount;
        this.data[keys.year][keys.week][keys.day][keys.hour].value = value;
    }

    public static getJSONKeys() {
        const currentDate = new Date();

        return {
            day: currentDate.toLocaleString('en-us', {weekday: 'long'}),
            year: currentDate.getFullYear(),
            week: DataStorage.getWeek(),
            hour: currentDate.getHours()
        };
    }

}


class DataLoader {
    private static bloeckleURL = 'https://186.webclimber.de/de/trafficlight?callback=WebclimberTrafficlight.insertTrafficlight&key=mNth0wfz3rvAbgGEBpCcCnP5d9Z5CzGF&container=trafficlightContainer&type=undefined&area=undefined';
    private bloeckle = new DataStorage(1, 24, 'db/bloeckle.json');

    private static kletterboxURL = 'https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IkRBVlJhdmVuc2J1cmcifQ.Zc5xwX5Oh7-60O5_6FF14IlLuoYRTJnnJcLuBd5APeM';
    private kletterbox = new DataStorage(1, 24, 'db/kletterbox.json');


    public async loadDataFromFile(): Promise<void> {
        await this.bloeckle.loadFromFile().catch(() => console.log('Could not load the bloeckle'));
        await this.kletterbox.loadFromFile().catch(() => console.log('Could not load the kletterbox'));
    }

    public startSaveDaemon(): void {
        this.bloeckle.saveData = true;
        this.kletterbox.saveData = true;
    }

    public endSaveDaemon(): void {
        this.bloeckle.saveData = false;
        this.kletterbox.saveData = false;
    }

    public startLoadingData(): void {
        this.loadBloeckleData();
        this.loadKletterboxData();
    }


    private async loadBloeckleData(): Promise<void> {
        const apiClient = new ApiClient();
        while (true) {
            let response: string | void = await apiClient.get(DataLoader.bloeckleURL).catch((error) => console.log(error));
            if (!response) response = '';

            try {
                this.bloeckle.setInformation(DataLoader.extractBloeckleData(response));
            } catch (e) {
                console.log('Could not extract the data');
            }
            await sleep(5 * 60 * 1000);
        }
    }

    private static extractBloeckleData(data: string): number {
        const startRegex = new RegExp(`style='width: *`);
        const startMatch: RegExpExecArray = startRegex.exec(data);
        const startIndex: number = startMatch.index + startMatch[0].length;

        const endRegex = new RegExp('% *;');
        const endMatch: RegExpExecArray = endRegex.exec(data);
        const endIndex = endMatch.index;

        const percentage: string = data.slice(startIndex, endIndex);
        console.log('Bloeckle: ', getFormattedDate() + ' - ', percentage);
        return parseFloat(percentage);
    }


    private async loadKletterboxData(): Promise<void> {

        const apiClient = new ApiClient();
        while (true) {
            let response: string | void = await apiClient.get(DataLoader.kletterboxURL).catch((error) => console.log(error));
            if (!response) response = '';

            try {
                this.kletterbox.setInformation(DataLoader.extractKletterboxData(response));
            } catch (e) {
                console.log('Could not extract the data');
            }
            await sleep(5 * 60 * 1000);
        }
    }


    private static extractKletterboxData(data: string): number {
        const startRegex = new RegExp(`<span data-value="`, 'g');

        const startMatchOne: RegExpExecArray = startRegex.exec(data);
        const startIndexOne: number = startMatchOne.index + startMatchOne[0].length;

        const startMatchTwo: RegExpExecArray = startRegex.exec(data);
        const startIndexTwo: number = startMatchTwo.index + startMatchTwo[0].length;

        const endRegex = new RegExp('">[0-9]*</span>', 'g');
        const endIndexOne: number = endRegex.exec(data).index;
        const endIndexTwo: number = endRegex.exec(data).index;

        const blocked: number = parseFloat(data.slice(startIndexOne, endIndexOne));
        const free: number = parseFloat(data.slice(startIndexTwo, endIndexTwo));
        const percentage: number = (blocked / (blocked + free)) * 100;
        console.log('Kletterbox: ', getFormattedDate() + ' - ' + percentage);
        return percentage;
    }
}


export async function main(): Promise<void> {
    const loader = new DataLoader();
    await loader.loadDataFromFile();
    loader.startSaveDaemon();
    loader.startLoadingData();
}


function getFormattedDate() {
    const currentDate = new Date();
    let formatted_date = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear() + ' ';
    formatted_date += currentDate.getHours() + ':' + currentDate.getMinutes();
    return formatted_date;
}

async function sleep(ms) {
    return new Promise((resolve => setTimeout(() => resolve(), ms)));
}
