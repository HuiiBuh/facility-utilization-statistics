import {Controller, ForbiddenException, Get, Param, Post, Req, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";
import {StorageService} from "src/facility/storage.service";

import {Current, File} from "./facility.interfaces";
import {DataType} from "../storage/Storage";

@Controller("facility")
export class FacilityController {
    private readonly uploadKey: string;

    constructor(private readonly storageService: StorageService) {
        let uploadKey: string = process.env.UPLOAD_KEY;
        const environment: string = process.env.ENVIRONMENT;

        if (!uploadKey && environment === "production") throw new Error("Upload key not found in environment");
        else uploadKey = "test";

        this.uploadKey = uploadKey;
    }


    /**
     * Get the bloeckle json
     */
    @Get("bloeckle")
    getBloeckle(): DataType {
        return this.storageService.getBloeckle();
    }

    /**
     * Get the kletterbox json
     */
    @Get("kletterbox")
    getKletterbox(): DataType {
        return this.storageService.getKletterbox();
    }

    @Get(":facility/current")
    getCurrent(): Current {

    }

    @Get(":facility/estimation")
    getEstimation() {

    }

    @Get(":facility/week")
    getWeek() {

    }

    @Get(":facility/month")
    getMonth() {

    }

    @Get(":facility/year")
    getYear() {

    }


    /**
     * Upload a database to the server
     * @param file The database file
     * @param facility The blöckle or kletterbox
     * @param request The upload request
     */
    @Post(":facility/upload")
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: File, @Param("id") facility: string, @Req() request: Request): void {
        const accessKey = request.headers["x-access-key"];
        if (accessKey !== this.uploadKey) {
            throw new ForbiddenException("Wrong password");
        }

        this.storageService.mergeDatabase(facility, file.buffer);
    }


}
