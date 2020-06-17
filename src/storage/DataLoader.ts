import {Injectable} from '@nestjs/common';
import ApiClient from './ApiClient';
import DataStorage from './Storage';

@Injectable()
export default class DataLoader {
    private static bloeckleURL = 'https://186.webclimber.de/de/trafficlight?callback=WebclimberTrafficlight.insertTrafficlight&key=mNth0wfz3rvAbgGEBpCcCnP5d9Z5CzGF&container=trafficlightContainer&type=undefined&area=undefined';
    public bloeckle = new DataStorage(1, 24, 'db/bloeckle.json');

    private static kletterboxURL = 'https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IkRBVlJhdmVuc2J1cmcifQ.Zc5xwX5Oh7-60O5_6FF14IlLuoYRTJnnJcLuBd5APeM';
    public kletterbox = new DataStorage(1, 24, 'db/kletterbox.json');


    public async loadDataFromFile(): Promise<void> {
        await this.bloeckle.loadFromFile().catch(() => console.log('Could not load the bloeckle'));
        await this.kletterbox.loadFromFile().catch(() => console.log('Could not load the kletterbox'));
    }

    public startSaveDaemon(): void {
        this.bloeckle.saveData = true;
        this.kletterbox.saveData = true;
    }

    public async saveAllData(): Promise<void> {
        await this.bloeckle.writeToFile();
        await this.kletterbox.writeToFile();
    }

    public endSaveDaemon(): void {
        this.bloeckle.saveData = false;
        this.kletterbox.saveData = false;
    }

    public startCrawlingData(): void {
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

function getFormattedDate() {
    const currentDate = new Date();
    let formatted_date = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear() + ' ';
    formatted_date += currentDate.getHours() + ':' + currentDate.getMinutes();
    return formatted_date;
}

async function sleep(ms): Promise<void> {
    return new Promise((resolve => setTimeout(() => resolve(), ms)));
}
