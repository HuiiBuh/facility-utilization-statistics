import {Controller, ForbiddenException, Get, Param, Post, Req, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";

import {ICurrent, TFacility, TStorageData, TWeek, TYear} from "src/storage";

import {CheckFacility} from "./facility.decorators";
import {IChartWeek, IFile, IWeekOverview} from "./facility.interfaces";
import {StorageService} from "./storage.service";

@Controller("api/facility")
export class FacilityController {
    private readonly uploadKey: string;

    constructor(private readonly storageService: StorageService) {
        let uploadKey: string = process.env.UPLOAD_KEY;
        const environment: string = process.env.ENVIRONMENT;

        if (!uploadKey && environment === "production") throw new Error("Upload key not found in environment variables. " +
            "Set UPLOAD_KEY to a value");
        else if (!uploadKey && environment !== "production") uploadKey = "HuiBuh";

        this.uploadKey = uploadKey;
    }

    /**
     * Get the bloeckle or kletterbox json
     * @param facility
     */
    @Get(":facility")
    @CheckFacility
    getAll(@Param("facility") facility: TFacility): TStorageData {
        return this.storageService.getAll(facility);
    }

    /**
     * Get the current capacity of a facility
     * @param facility
     */
    @Get(":facility/current")
    @CheckFacility
    getCurrent(@Param("facility") facility: TFacility): ICurrent {
        return this.storageService.getCurrent(facility);
    }

    /**
     * Get the capacity for every hour of the day
     * @param facility
     */
    @Get(":facility/today")
    @CheckFacility
    getDay(@Param("facility") facility: TFacility): IChartWeek {
        return this.storageService.getDay(facility);
    }

    /**
     * Get the capacities for every day of a week in a facility
     * @param facility
     */
    @Get(":facility/week")
    @CheckFacility
    getWeek(@Param("facility") facility: TFacility): IWeekOverview {
        return this.storageService.getWeek(facility);
    }

    /**
     * Get the hourly capacity estimation for every day of one week
     * @param facility
     */
    @Get(":facility/estimation")
    @CheckFacility
    getEstimation(@Param("facility") facility: TFacility): IChartWeek {
        return this.storageService.getEstimation(facility);
    }

    @Get(":facility/month")
    @CheckFacility
    getMonth(@Param("facility") facility: TFacility): TWeek[] {
        return this.storageService.getMonth(facility);
    }

    @Get(":facility/year")
    @CheckFacility
    getYear(@Param("facility") facility: TFacility): TYear {
        return this.storageService.getYear(facility);
    }

    /**
     * Upload a database to the server
     * @param facility The bloeckle or kletterbox
     * @param file The database file
     * @param request The upload request
     */
    @Post(":facility/upload")
    @UseInterceptors(FileInterceptor("file"))
    @CheckFacility
    uploadFile(@Param("facility") facility: TFacility, @UploadedFile() file: IFile, @Req() request: Request): void {

        const accessKey = request.body["accessKey"];
        if (accessKey !== this.uploadKey) {
            throw new ForbiddenException("Wrong password");
        }

        this.storageService.mergeDatabase(facility, file.buffer);
    }
}
