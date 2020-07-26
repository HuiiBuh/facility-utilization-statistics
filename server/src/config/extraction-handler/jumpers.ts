type JumpersData = { "maxCheckinsAllowed": number, "countCheckedInCustomer": number }

/**
 * Extract the data from the jumpers website
 * @param data The crawled data
 * @returns The jumper percentage
 */
export function extractJumperData(data: string): number {
    const dataJSON: JumpersData = JSON.parse(data);


    let maxPersons = 80;
    if (dataJSON?.maxCheckinsAllowed) {
        maxPersons = dataJSON.maxCheckinsAllowed;
    }

    return (dataJSON.countCheckedInCustomer / maxPersons) * 100;
}