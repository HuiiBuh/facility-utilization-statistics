/**
 * Create a label for data
 * @param length The length of the data
 * @param openHour The opening hour of the facility
 * @param closeHour The closing hour of the facility
 */
export function createLabels(length: number, openHour: number, closeHour: number): string[] {
    const labelList: string[] = [];

    for (let i = openHour; i <= closeHour; i += 0.5) {

        const hour = Math.floor(i).toString().padStart(0);

        if (i % 1 === 0) labelList.push(hour + ":00");
        else labelList.push(hour + ":30");
    }

    return labelList;
}
