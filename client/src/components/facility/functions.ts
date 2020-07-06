export function createLabel(length: number, openHour: number, closeHour: number): string[] {
    const labelList: string[] = [];

    for (let i = openHour; i <= closeHour; ++i) {
        labelList.push(i.toString().padStart(0) + ":00");
        labelList.push(i.toString().padStart(0) + ":30");
    }

    return labelList;
}
