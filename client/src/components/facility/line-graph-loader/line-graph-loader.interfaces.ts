export type TDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface IWeek {
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
