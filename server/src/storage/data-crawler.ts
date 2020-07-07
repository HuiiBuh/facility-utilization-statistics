import ApiClient from "src/app.request.maker";
import Config from "src/config";
import DataStorage from "src/storage/data-storage";
import {sleep} from "./functions";

export default class DataCrawler {
    public bloeckle = new DataStorage(
        Config.bloeckle.maxPersonCount,
        Config.bloeckle.fileName,
        Config.bloeckle.openingHours,
    );
    public kletterbox = new DataStorage(
        Config.kletterbox.maxPersonCount,
        Config.kletterbox.fileName,
        Config.kletterbox.openingHours,
    );

    private static INSTANCE: DataCrawler = null;

    public crawlingInterval: number = 2;

    /**
     * The data-loader service
     */
    constructor() {
        if (DataCrawler.INSTANCE) return DataCrawler.INSTANCE;

        DataCrawler.INSTANCE = this;
    }

    /**
     * Load the databases from the files
     */
    public async loadDataFromFile(): Promise<void> {
        await this.bloeckle.loadFromFile().catch(e => console.log("Could not load the bloeckle database.\n", e));
        await this.kletterbox.loadFromFile().catch(e => console.log("Could not load the kletterbox database.\n", e));
    }

    /**
     * Start the saving of the data in periodic time periods
     */
    public startSaveDaemon(): void {
        this.bloeckle.saveData = true;
        this.kletterbox.saveData = true;
    }

    /**
     * Save the data to the files
     */
    public async saveAllData(): Promise<void> {
        await this.bloeckle.writeToFile();
        await this.kletterbox.writeToFile();
    }

    /**
     * End the continuous file saving
     */
    public endSaveDaemon(): void {
        this.bloeckle.saveData = false;
        this.kletterbox.saveData = false;
    }

    /**
     * Start the crawling of the data
     */
    public startCrawlingData(): void {
        this.loadBloeckleData().then(() => {
            console.log("Bloeckle crawling stopped");
        });
        this.loadKletterboxData().then(() => {
            console.log("Kletterbox crawling stopped");
        });
    }

    /**
     * Load the data from the bloeckle website
     */
    private async loadBloeckleData(): Promise<void> {
        const apiClient = new ApiClient();
        while (true) {
            let response: string | void = await apiClient.get(Config.bloeckle.url).catch(error => console.log(error));
            if (!response) response = "";

            try {
                this.bloeckle.setInformation(DataCrawler.extractBloeckleData(response));
            } catch (e) {
                console.error(e);
            }
            await sleep(5 * 60 * 1000);
        }
    }

    /**
     * Extract the data from the bloeckle website
     * @param data The crawled data
     * @returns The blocked percentage
     */
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

    /**
     * Load the data from the kletterbox website
     */
    private async loadKletterboxData(): Promise<void> {
        const apiClient = new ApiClient();
        while (true) {
            let response: string | void = await apiClient.get(Config.kletterbox.url).catch(error => console.log(error));
            if (!response) response = "";

            try {
                this.kletterbox.setInformation(DataCrawler.extractKletterboxData(response));
            } catch (e) {
                console.error(e);
            }
            await sleep(this.crawlingInterval * 60 * 1000);
        }
    }

    /**
     * Extract the data from the kletterbox website
     * @param data The crawled data
     * @returns The blocked percentage
     */
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
