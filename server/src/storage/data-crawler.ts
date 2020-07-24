import {existsSync} from "fs";
import ApiClient from "src/app.request.maker";
import {getConfigList} from "src/config/config";
import DataStorage from "src/storage/data-storage";
import {TConfigFacility} from "../config/config.interfaces";
import {sleep} from "./functions";

export default class DataCrawler {

    private static INSTANCE: DataCrawler = null;
    private static API_CLIENT = new ApiClient();

    public storage: Record<string, DataStorage> = {};

    public crawlingInterval: number = 2;

    /**
     * The data-loader service
     */
    constructor() {
        if (DataCrawler.INSTANCE) return DataCrawler.INSTANCE;

        this.createDataStoarges();
        DataCrawler.INSTANCE = this;
    }


    /**
     * Create the different storage classes
     */
    private createDataStoarges(): void {
        for (const facility of getConfigList()) {
            this.storage[facility.identifier] = new DataStorage(facility.maxPersonCount, facility.fileName, facility.openingHours);
        }
    }


    /**
     * Create the databases if they don't exist
     */
    async createDatabaseIfNotExist(): Promise<void> {
        for (const facility of getConfigList()) {
            if (!existsSync(facility.fileName)) {
                this.storage[facility.identifier].initDatabase();
                await this.storage[facility.identifier].writeToFile();
                console.log(`Created ${facility.name} database.`);
            }

        }

    }

    /**
     * Load the databases from the files
     */
    public async loadDataFromFile(): Promise<void> {
        for (const storage of this.dataStorageList) {
            await storage.loadFromFile().catch(e => console.log(`Could not load the ${storage.fileName} database.\n`, e));
        }
    }

    /**
     * Start the saving of the data in periodic time periods
     */
    public startSaveDaemon(): void {
        for (const storage of this.dataStorageList) {
            storage.saveData = true;
        }
    }

    /**
     * Save the data to the files
     */
    public async saveAllData(): Promise<void> {
        for (const storage of this.dataStorageList) {
            await storage.writeToFile();
        }
    }

    /**
     * End the continuous file saving
     */
    public endSaveDaemon(): void {
        for (const storage of this.dataStorageList) {
            storage.saveData = false;
        }
    }

    /**
     * Start the crawling of the data
     */
    public startCrawlingDaemon(): void {
        for (const storageConfig of getConfigList()) {

            const storageObject = this.storage[storageConfig.identifier];
            this.loadData(storageObject, storageConfig).then(() => console.log(`${storageConfig.fileName} stopped crawling`));
        }
    }


    /**
     * Load the data from the different facility websites
     * @param storageObject The storage object
     * @param storageConfig The storages config object
     */
    private async loadData(storageObject: DataStorage, storageConfig: TConfigFacility): Promise<void> {

        while (true) {
            const response: string | null = await DataCrawler.API_CLIENT.get(storageConfig.url);
            if (response) {
                try {
                    const extractedPercentage: number = storageConfig.extractionHandler(response);
                    this.storage[storageConfig.identifier].setInformation(extractedPercentage);
                } catch (e) {
                    console.log(`Could not extract the response from ${storageConfig.name}`);
                }
            }
            await sleep(this.crawlingInterval * 60 * 1000);
        }

    }


    /**
     * Get a list of the storage objects
     */
    private get dataStorageList(): DataStorage[] {

        const dataStorageKeys: string[] = Object.keys(this.storage);
        const returnList: DataStorage[] = [];

        for (const storageIdentifier of dataStorageKeys) {
            if (!this.storage.hasOwnProperty(storageIdentifier)) continue;

            returnList.push(this.storage[storageIdentifier]);
        }

        return returnList;
    }

}
