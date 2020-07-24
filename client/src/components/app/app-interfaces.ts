export type TOpeningHours = {
    Monday: { close: number; open: number };
    Thursday: { close: number; open: number };
    Friday: { close: number; open: number };
    Sunday: { close: number; open: number };
    Wednesday: { close: number; open: number };
    Tuesday: { close: number; open: number };
    Saturday: { close: number; open: number };
};

export interface IFacility {
    name: string
    identifier: string
    maxPersonCount: number
    openingHours: TOpeningHours
}