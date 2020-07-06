import {BadRequestException, Injectable} from "@nestjs/common";

import {ChartWeek, DataCrawler, ICurrent, TDataType, TDay, TFacility, TWeek, TYear} from "src/storage/";

interface State {
    data: { day: TDay; data: number[] }[];
    maxPersonCount: number;
}

@Injectable()
export class StorageService {
    constructor(private dataCrawler: DataCrawler) {
    }

    async onModuleInit(): Promise<void> {
        await this.dataCrawler.loadDataFromFile();
        this.dataCrawler.startSaveDaemon();
        this.dataCrawler.startCrawlingData();
    }

    getCurrent(facility: TFacility): ICurrent {
        return this.dataCrawler[facility].extractCurrent();
    }

    getDay(facility: TFacility): ChartWeek {
        return this.dataCrawler[facility].extractDay();
    }

    getEstimation(facility: TFacility): ChartWeek {
        return this.dataCrawler[facility].extractEstimation();
    }

    getWeek(facility: TFacility): { data: { day: TDay; value: number }[]; maxPersonCount: number } {
        return this.dataCrawler[facility].extractWeek();
    }

    getMonth(facility: TFacility): TWeek[] {
        return this.dataCrawler[facility].extractMonth();
    }

    getYear(facility: TFacility): TYear {
        return this.dataCrawler[facility].extractYear();
    }

    getAll(facility: TFacility): TDataType {
        return this.dataCrawler[facility].data;
    }

    mergeDatabase(id: TFacility, buffer: Buffer): void {
        let fileContent: TDataType;
        try {
            const bufferString = buffer.toString("utf8");
            fileContent = JSON.parse(bufferString);
        } catch (e) {
            throw new BadRequestException("The file could not be parsed to json");
        }

        try {
            this.dataCrawler[id].mergeDataBases(fileContent);
        } catch {
            throw new BadRequestException("The json schema of your file is wrong");
        }
    }

    async onModuleDestroy(): Promise<void> {
        this.dataCrawler.endSaveDaemon();
        await this.dataCrawler.saveAllData();
    }
}
