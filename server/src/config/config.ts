import {TConfig, TConfigFacility} from "./config.interfaces";
import {extractBloeckleData} from "./extraction-handler/bloeckle";
import {extractJumperData} from "./extraction-handler/jumpers";
import {extractKletterboxData} from "./extraction-handler/kletterbox";

export const Config: TConfig = {
    bloeckle: {
        url:
            "https://186.webclimber.de/de/trafficlight?callback=WebclimberTrafficlight.insertTrafficlight&key=mNth0wfz3rvAbgGEBpCcCnP5d9Z5CzGF&container=trafficlightContainer&type=undefined&area=undefined",
        fileName: "db/bloeckle.json",
        name: "Blöckle",
        maxPersonCount: 50,
        openingHours: {
            Monday: {open: 15, close: 22},
            Tuesday: {open: 10, close: 22},
            Wednesday: {open: 10, close: 22},
            Thursday: {open: 10, close: 22},
            Friday: {open: 10, close: 22},
            Saturday: {open: 10, close: 20.5},
            Sunday: {open: 10, close: 20.5},
        },
        extractionHandler: extractBloeckleData
    },
    kletterbox: {
        url:
            "https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IkRBVlJhdmVuc2J1cmcifQ.Zc5xwX5Oh7-60O5_6FF14IlLuoYRTJnnJcLuBd5APeM",
        fileName: "db/kletterbox.json",
        name: "Kletterbox",
        maxPersonCount: 25,
        openingHours: {
            Monday: {open: 17.5, close: 22.5},
            Tuesday: {open: 17.5, close: 22.5},
            Wednesday: {open: 17.5, close: 22.5},
            Thursday: {open: 17.5, close: 22.5},
            Friday: {open: 17.5, close: 22.5},
            Saturday: {open: 12, close: 21},
            Sunday: {open: 10, close: 21},
        },
        extractionHandler: extractKletterboxData
    },

    jumpers_friedrichshafen: {
        url:
            "https://www.jumpers-fitness.com/studios/friedrichshafen/studioauslastung.json?type=1589285582&tx_twofourjumpersintratech_customernumber%5BbranchId%5D=38",
        fileName: "db/jumpers_friedrichshafen.json",
        name: "Jumpers Friedrichshafen",
        maxPersonCount: 120,
        openingHours: {
            Monday: {open: 6, close: 24},
            Tuesday: {open: 6, close: 24},
            Wednesday: {open: 6, close: 24},
            Thursday: {open: 6, close: 24},
            Friday: {open: 6, close: 24},
            Saturday: {open: 9, close: 22},
            Sunday: {open: 9, close: 22},
        },
        extractionHandler: extractJumperData
    },
};

export function getConfigList(): TConfigFacility[] {
    const returnList: TConfigFacility[] = [];

    const facilityList: string[] = Object.keys(Config);

    for (const facilityIdentifier of facilityList) {
        if (!Config.hasOwnProperty(facilityIdentifier)) continue;
        const facility = Config[facilityIdentifier];
        facility.identifier = facilityIdentifier;
        returnList.push(facility);
    }

    return returnList;
}


