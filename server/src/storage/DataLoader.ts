import {Injectable} from "@nestjs/common";

import ApiClient from "./ApiClient";
import DataStorage from "./Storage";

@Injectable()
export default class DataLoader {
    private static bloeckleURL = "https://186.webclimber.de/de/trafficlight?callback=WebclimberTrafficlight.insertTrafficlight&key=mNth0wfz3rvAbgGEBpCcCnP5d9Z5CzGF&container=trafficlightContainer&type=undefined&area=undefined";
    public bloeckle = new DataStorage(50, "db/bloeckle.json");

    private static kletterboxURL = "https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IkRBVlJhdmVuc2J1cmcifQ.Zc5xwX5Oh7-60O5_6FF14IlLuoYRTJnnJcLuBd5APeM";
    public kletterbox = new DataStorage(30, "db/kletterbox.json");


    public async loadDataFromFile(): Promise<void> {
        await this.bloeckle.loadFromFile().catch((e) => console.log("Could not load the bloeckle database.\n", e));
        await this.kletterbox.loadFromFile().catch((e) => console.log("Could not load the kletterbox database.\n", e));
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
            if (!response) response = "";

            try {
                this.bloeckle.setInformation(DataLoader.extractBloeckleData(response));
            } catch (e) {
                console.error(e);
            }
            await sleep(5 * 60 * 1000);
        }
    }

    private static extractBloeckleData(data: string): number {
        const startRegex = new RegExp(`style='width: *`);
        const startMatch: RegExpExecArray = startRegex.exec(data);
        const startIndex: number = startMatch.index + startMatch[0].length;

        const endRegex = new RegExp("% *;");
        const endMatch: RegExpExecArray = endRegex.exec(data);
        const endIndex = endMatch.index;

        const percentage: string = data.slice(startIndex, endIndex);
        return parseFloat(percentage);
    }


    private async loadKletterboxData(): Promise<void> {

        const apiClient = new ApiClient();
        while (true) {
            let response: string | void = await apiClient.get(DataLoader.kletterboxURL).catch((error) => console.log(error));
            if (!response) response = "";

            try {
                this.kletterbox.setInformation(DataLoader.extractKletterboxData(response));
            } catch (e) {
                console.error(e);
            }
            await sleep(5 * 60 * 1000);
        }
    }


    private static extractKletterboxData(data: string): number {
        const startRegex = new RegExp(`<span data-value="`, "g");

        const startMatchOne: RegExpExecArray = startRegex.exec(data);
        const startIndexOne: number = startMatchOne.index + startMatchOne[0].length;

        const startMatchTwo: RegExpExecArray = startRegex.exec(data);
        const startIndexTwo: number = startMatchTwo.index + startMatchTwo[0].length;

        const endRegex = new RegExp("\">[0-9]*</span>", "g");
        const endIndexOne: number = endRegex.exec(data).index;
        const endIndexTwo: number = endRegex.exec(data).index;

        const blocked: number = parseFloat(data.slice(startIndexOne, endIndexOne));
        const free: number = parseFloat(data.slice(startIndexTwo, endIndexTwo));
        return (blocked / (blocked + free)) * 100;
    }
}

function getFormattedDate(): string {
    const currentDate = new Date();
    let formatted_date = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear() + " ";
    formatted_date += currentDate.getHours() + ":" + currentDate.getMinutes();
    return formatted_date;
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve => setTimeout(() => resolve(), ms)));
}
