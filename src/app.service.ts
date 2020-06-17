import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import DataLoader from './storage/DataLoader';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

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
        await this.dataLoader.saveAllData();
        this.dataLoader.endSaveDaemon();
    }

}
