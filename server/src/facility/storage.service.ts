import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import DataLoader from "src/storage/DataLoader";

@Injectable()
export class StorageService {
    constructor(private dataLoader: DataLoader) {
    }


    async onModuleInit(): Promise<void> {
        await this.dataLoader.loadDataFromFile();
        this.dataLoader.startSaveDaemon();
        this.dataLoader.startCrawlingData();
    }

    getBloeckle(): any {
        return this.dataLoader.bloeckle.data;
    }

    getKletterbox(): any {
        return this.dataLoader.kletterbox.data;
    }

    async onModuleDestroy(): Promise<void> {
        this.dataLoader.endSaveDaemon();
        await this.dataLoader.saveAllData();
    }

    mergeDatabase(id: string, buffer: Buffer): void {
        if (id !== "bloeckle" && id !== "kletterbox") {
            throw new NotFoundException();
        }

        let fileContent;
        try {
            const bufferString = buffer.toString("utf8");
            fileContent = JSON.parse(bufferString);
        } catch (e) {
            throw new BadRequestException("The file could not be parsed to json");
        }

        try {
            this.dataLoader[id].mergeDataBases(fileContent);
        } catch {
            throw new BadRequestException("The json schema of your file is wrong");
        }
    }
}
