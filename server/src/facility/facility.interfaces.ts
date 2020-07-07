import {TDay} from "../storage";

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export interface IChartWeek {
    data: {
        day: TDay;
        data: number[];
        open: number;
        close: number;
    }[];
    maxPersonCount: number;
}

export interface IWeekOverview {
    data: {
        day: TDay;
        value: number
    }[];
    maxPersonCount: number
}
