import {Controller, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {DataType} from './storage/Storage';

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
    getBloeckle(): DataType {
        return this.appService.getBloeckle();
    }

    @Get('kletterbox')
    getKletterbox(): DataType {
        return this.appService.getKletterbox();
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: File, @Param('id') id: string): void {
        this.appService.mergeDatabase(id, file.buffer);
    }
}

interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}