import DataLoader from "src/storage/DataLoader";
import {ICurrent, IHour, Week} from "src/storage/stoarge.interfaces";
import Storage from "src/storage/Storage";


class DataExtractor {
    private bloeckleStorage: Storage;
    private kletterboxStorage: Storage;

    constructor() {
        const dataLoader = new DataLoader();
        this.bloeckleStorage = dataLoader.bloeckle;
        this.kletterboxStorage = dataLoader.kletterbox;
    }

    extractDay(): Array<IHour> {

        return null;
    }

    extractCurrent(): ICurrent {

        return null;
    }

    extractExpectation(): Week {
        const {year, week} = Storage.getJSONKeys();
        const weekAccess = week - 1;

        const weekObject: Week = {} as Week;

        for (let i = weekAccess - 4; i <= weekAccess; ++i) {
            const weekData = this.bloeckleStorage.data[year][i].data;

            for (const day in weekData) {
                if (!weekData.hasOwnProperty(day)) continue;
                const dayObject: IHour = weekData[day];

                let data = dayObject.firstHalf.value;
                let dataWeight = dayObject.firstHalf.valueCount;
                weekObject.data[day].firstHalf.value = (dayObject.firstHalf.value * dayObject.firstHalf.valueCount + data * dataWeight) / (dayObject.firstHalf.valueCount + dataWeight);
                weekObject.data[day].firstHalf.valueCount += dataWeight;

                data = dayObject.secondHalf.value;
                dataWeight = dayObject.secondHalf.valueCount;
                weekObject.data[day].secondHalf.value = (dayObject.secondHalf.value * dayObject.secondHalf.valueCount + data * dataWeight) / (dayObject.secondHalf.valueCount + dataWeight);
                weekObject.data[day].secondHalf.valueCount += dataWeight;
            }
            const personCount = this.bloeckleStorage.data[year][i].maxPersonCount;
            weekObject.maxPersonCount = (personCount + weekObject.maxPersonCount);
        }
        weekObject.maxPersonCount = weekObject.maxPersonCount / 4;

        return weekObject;
    }

    extractMonth(): Week[] {
        const {year, week} = Storage.getJSONKeys();
        const weekAccess = week - 1;

        const month: Week[] = [];
        for (let i = 0; i < 4; ++i) {
            month.push(this.bloeckleStorage.data[year][weekAccess - i]);
        }

        return month;
    }

}