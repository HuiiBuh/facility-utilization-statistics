import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {FacilityController} from "./facility/facility.controller";
import DataLoader from "./storage/DataLoader";

@Module({
    imports: [],
    controllers: [AppController, FacilityController],
    providers: [AppService, DataLoader],
})
export class AppModule {
}
