import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    home(): string {
        return `<a href="/bloeckle">Blöckle</a>
                <a href="/kletterbox">Kletterbox</a>`;
    }

    @Get('bloeckle')
    getBloeckle(): any {
        return this.appService.getBloeckle();
    }

    @Get('kletterbox')
    getKletterbox(): any {
        return this.appService.getKletterbox();
    }
}
