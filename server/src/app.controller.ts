import {Controller, ForbiddenException, Get, Param, Post, Req, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";

import {AppService} from "./app.service";
import {DataType} from "./storage/Storage";

const globalAccess = "";

interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    home(): string {
        return `<a href="/bloeckle">Blöckle</a>
                <a href="/kletterbox">Kletterbox</a>`;
    }

    @Get("bloeckle")
    getBloeckle(): DataType {
        return this.appService.getBloeckle();
    }

    @Get("kletterbox")
    getKletterbox(): DataType {
        return this.appService.getKletterbox();
    }

    @Post("upload/:id")
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: File, @Param("id") id: string, @Req() request: Request): void {

        const accessKey = request.headers["x-access-key"];
        if (accessKey !== globalAccess) {
            throw new ForbiddenException("Wrong password");
        }

        this.appService.mergeDatabase(id, file.buffer);
    }
}
