export type TDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface IHour {
    firstHalf: IDataObject;
    secondHalf: IDataObject;
}

export interface IDataObject {
    value: number;
    valueCount: number;
}

export interface ICurrent {
    value: number;
    maxPersonCount: number;
}

export type THour = Array<IHour>;
export type TWeek = { data: Record<TDay, THour>; maxPersonCount: number };
export type TYear = Array<TWeek>;
export type TDataType = { current: ICurrent; year: Record<number, TYear> };


export interface ChartWeek {
    data: {
        day: TDay;
        data: number[];
        open: number;
        close: number;
    }[];
    maxPersonCount: number;
}
