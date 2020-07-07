/**
 * Create a label for data
 * @param length The length of the data
 * @param openHour The opening hour of the facility
 * @param closeHour The closing hour of the facility
 */
export function createLabel(length: number, openHour: number, closeHour: number): string[] {
    const labelList: string[] = [];

    for (let i = openHour; i <= closeHour; ++i) {
        labelList.push(i.toString().padStart(0) + ":00");
        labelList.push(i.toString().padStart(0) + ":30");
    }

    return labelList;
}
