const Config: TConfig = {
    bloeckle: {
        url:
            "https://186.webclimber.de/de/trafficlight?callback=WebclimberTrafficlight.insertTrafficlight&key=mNth0wfz3rvAbgGEBpCcCnP5d9Z5CzGF&container=trafficlightContainer&type=undefined&area=undefined",
        fileName: "db/bloeckle.json",
        maxPersonCount: 50,
        openingHours: {
            Monday: {open: 15, close: 22},
            Tuesday: {open: 10, close: 22},
            Wednesday: {open: 10, close: 22},
            Thursday: {open: 10, close: 22},
            Friday: {open: 10, close: 22},
            Saturday: {open: 10, close: 21},
            Sunday: {open: 10, close: 21},
        },
    },
    kletterbox: {
        url:
            "https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IkRBVlJhdmVuc2J1cmcifQ.Zc5xwX5Oh7-60O5_6FF14IlLuoYRTJnnJcLuBd5APeM",
        fileName: "db/kletterbox.json",
        maxPersonCount: 25,
        openingHours: {
            Monday: {open: 17, close: 23},
            Tuesday: {open: 17, close: 23},
            Wednesday: {open: 17, close: 23},
            Thursday: {open: 17, close: 23},
            Friday: {open: 17, close: 23},
            Saturday: {open: 12, close: 21},
            Sunday: {open: 10, close: 21},
        },
    },
    allowedFacilities: ["bloeckle", "kletterbox"]
};

export default Config;

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
    allowedFacilities: string[]
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
