export type TConfig = {
    bloeckle: TConfigFacility;
    kletterbox: TConfigFacility;
};

export type TConfigFacility = {
    fileName: string;
    identifier?: string | undefined;
    extractionHandler: (data: string) => number;
    name: string
    openingHours: TOpeningHours;
    url: string;
    maxPersonCount: number;
}

export type TOpeningHours = {
    Monday: { close: number; open: number };
    Thursday: { close: number; open: number };
    Friday: { close: number; open: number };
    Sunday: { close: number; open: number };
    Wednesday: { close: number; open: number };
    Tuesday: { close: number; open: number };
    Saturday: { close: number; open: number };
};
