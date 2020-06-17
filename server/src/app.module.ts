import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import DataLoader from './storage/DataLoader';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, DataLoader],
})
export class AppModule {
}
