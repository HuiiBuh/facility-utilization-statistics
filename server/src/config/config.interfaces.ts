export type TConfig = {
    bloeckle: {
        fileName: string;
        openingHours: TOpeningHours;
        url: string;
        maxPersonCount: number;
    };
    kletterbox: {
        fileName: string;
        openingHours: TOpeningHours;
        url: string;
        maxPersonCount: number;
    };
};

export type TOpeningHours = {
    Monday: { close: number; open: number };
    Thursday: { close: number; open: number };
    Friday: { close: number; open: number };
    Sunday: { close: number; open: number };
    Wednesday: { close: number; open: number };
    Tuesday: { close: number; open: number };
    Saturday: { close: number; open: number };
};
