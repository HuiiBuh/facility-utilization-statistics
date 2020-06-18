import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import DataLoader, {sleep} from './storage/DataLoader';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

    constructor(private dataLoader: DataLoader) {
    }

    async onModuleInit(): Promise<void> {
        await this.dataLoader.loadDataFromFile();
        this.dataLoader.startSaveDaemon();
        this.dataLoader.startCrawlingData();

        await sleep(5000);
        await this.dataLoader.saveAllData();
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

}
