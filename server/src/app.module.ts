import { Module } from '@nestjs/common';

import { StorageService } from 'src/facility/storage.service';
import { DataCrawler } from 'src/storage/';
import { AppService } from './app.service';

import { AppController } from './app.controller';
import { FacilityController } from './facility/facility.controller';

@Module({
    imports: [],
    controllers: [AppController, FacilityController],
    providers: [AppService, DataCrawler, StorageService],
})
export class AppModule {}
