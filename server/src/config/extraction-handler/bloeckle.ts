/**
 * Extract the data from the bloeckle website
 * @param data The crawled data
 * @returns The blocked percentage
 */
export function extractBloeckleData(data: string): number {
    const startRegex = new RegExp(`style='width: *`);
    const startMatch: RegExpExecArray = startRegex.exec(data);
    const startIndex: number = startMatch.index + startMatch[0].length;

    const endRegex = new RegExp("% *;");
    const endMatch: RegExpExecArray = endRegex.exec(data);
    const endIndex = endMatch.index;

    const percentage: string = data.slice(startIndex, endIndex);
    return parseFloat(percentage);
}
