/**
 * Sleep function
 * @param ms The time the function sleeps
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}
