import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import DataLoader, {sleep} from './storage/DataLoader';
import {DataType} from './storage/Storage';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

    constructor(private dataLoader: DataLoader) {
    }

    async onModuleInit(): Promise<void> {
        await this.dataLoader.loadDataFromFile();
        this.dataLoader.startSaveDaemon();
        this.dataLoader.startCrawlingData();

        await sleep(5000);
        await this.dataLoader.bloeckle.writeToFile();

        const newDatabase: DataType = JSON.parse(JSON.stringify(this.dataLoader.bloeckle.data));
        newDatabase[2020][24].data.Thursday[15].firstHalf.value = 100;

        this.dataLoader.bloeckle.mergeDataBases(newDatabase);
        await this.dataLoader.bloeckle.writeToFile();
        console.log('finished');
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
