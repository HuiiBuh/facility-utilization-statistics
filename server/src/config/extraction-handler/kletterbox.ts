/**
 * Extract the data from the kletterbox website
 * @param data The crawled data
 * @returns The blocked percentage
 */
export function extractKletterboxData(data: string): number {
    const startRegex = new RegExp(`<span data-value="`, "g");

    const startMatchOne: RegExpExecArray = startRegex.exec(data);
    const startIndexOne: number = startMatchOne.index + startMatchOne[0].length;

    const startMatchTwo: RegExpExecArray = startRegex.exec(data);
    const startIndexTwo: number = startMatchTwo.index + startMatchTwo[0].length;

    const endRegex = new RegExp("\">[0-9]*</span>", "g");
    const endIndexOne: number = endRegex.exec(data).index;
    const endIndexTwo: number = endRegex.exec(data).index;

    const blocked: number = parseFloat(data.slice(startIndexOne, endIndexOne));
    const free: number = parseFloat(data.slice(startIndexTwo, endIndexTwo));
    return (blocked / (blocked + free)) * 100;
}