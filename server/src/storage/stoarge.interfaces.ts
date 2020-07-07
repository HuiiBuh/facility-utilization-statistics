export type TDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface IStorageAccessKeys {
    day: TDay;
    year: number;
    week: number;
    hour: number;
    firstHalf: boolean;
}

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

export type TFacility = "bloeckle" | "kletterbox";

export type THour = Array<IHour>;
export type TWeek = { data: Record<TDay, THour>; maxPersonCount: number };
export type TYear = Array<TWeek>;
export type TStorageData = { current: ICurrent; year: Record<number, TYear> };
