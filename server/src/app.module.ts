import {Module} from "@nestjs/common";

import {StorageService} from "src/facility/storage.service";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {FacilityController} from "./facility/facility.controller";
import {DataCrawler} from "./storage";

@Module({
    imports: [DataCrawler],
    controllers: [AppController, FacilityController],
    providers: [AppService, DataCrawler, StorageService],
})
export class AppModule {
}
