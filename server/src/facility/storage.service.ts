import {BadRequestException, Injectable} from "@nestjs/common";

import {DataCrawler, ICurrent, TFacility, TStorageData, TWeek, TYear} from "src/storage/";
import {IChartWeek, IWeekOverview} from "./facility.interfaces";


@Injectable()
export class StorageService {
    constructor(private dataCrawler: DataCrawler) {
    }

    async onModuleInit(): Promise<void> {
        await this.dataCrawler.createDatabaseIfNotExist();
        await this.dataCrawler.loadDataFromFile();
        this.dataCrawler.startSaveDaemon();
        this.dataCrawler.startCrawlingDaemon();
    }

    getCurrent(facility: TFacility): ICurrent {
        return this.dataCrawler.storage[facility].extractCurrent();
    }

    getDay(facility: TFacility): IChartWeek {
        return this.dataCrawler.storage[facility].extractDay();
    }

    getEstimation(facility: TFacility): IChartWeek {
        return this.dataCrawler.storage[facility].extractEstimation();
    }

    getWeek(facility: TFacility): IWeekOverview {
        return this.dataCrawler.storage[facility].extractWeek();
    }

    getMonth(facility: TFacility): TWeek[] {
        return this.dataCrawler.storage[facility].extractMonth();
    }

    getYear(facility: TFacility): TYear {
        return this.dataCrawler.storage[facility].extractYear();
    }

    getAll(facility: TFacility): TStorageData {
        return this.dataCrawler.storage[facility].data;
    }

    mergeDatabase(id: TFacility, buffer: Buffer): void {
        let fileContent: TStorageData;
        try {
            const bufferString = buffer.toString("utf8");
            fileContent = JSON.parse(bufferString);
        } catch (e) {
            throw new BadRequestException("The file could not be parsed to json");
        }

        try {
            this.dataCrawler.storage[id].mergeDataBases(fileContent);
        } catch {
            throw new BadRequestException("The json schema of your file is wrong");
        }
    }

    async onModuleDestroy(): Promise<void> {
        this.dataCrawler.endSaveDaemon();
        await this.dataCrawler.saveAllData();
    }
}
