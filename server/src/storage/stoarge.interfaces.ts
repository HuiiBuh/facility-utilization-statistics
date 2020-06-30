export type day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export interface IStorageAccessKeys {
    day: day;
    year: number;
    week: number;
    hour: number;
    firstHalf: boolean
}

export interface IHour {
    firstHalf: IDataObject
    secondHalf: IDataObject
}

export interface IDataObject {
    value: number
    valueCount: number
}

export interface ICurrent {
    value: number
    maxPersonCount: number
}

export type Hour = Array<IHour>;
export type Week = { data: Record<day, Hour>, maxPersonCount: number }
export type Year = Array<Week>;
export type DataType = Record<number, Year>;