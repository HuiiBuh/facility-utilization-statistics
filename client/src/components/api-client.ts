export default class APIClient {
    private readonly _baseURL: string;

    /**
     * A new async api client which converts callbacks to promises
     * @param baseURL The base url of the server
     */
    constructor(baseURL = "") {
        this._baseURL = baseURL;
    }

    /**
     * Put request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async put<T>(url: string, urlParams: URLSearchParams | null = null, body: object = {}): Promise<T> {
        return await this.request("PUT", url, urlParams, body) as unknown as T;
    }

    /**
     * Get request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async get<T>(url: string, urlParams: URLSearchParams | null = null, body: object = {}): Promise<T> {
        return await this.request("GET", url, urlParams, body) as unknown as T;
    }

    /**
     * Post request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async post<T>(url: string, urlParams: URLSearchParams | null = null, body: object = {}): Promise<T> {
        return await this.request("POST", url, urlParams, body) as unknown as T;
    }

    /**
     * Delete request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async delete<T>(url: string, urlParams: URLSearchParams | null = null, body: object = {}): Promise<T> {
        return await this.request("DELETE", url, urlParams, body) as unknown as T;
    }

    /**
     * Start the request (Errors get handled)
     * @param method The method which should be used for the request
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async request(method: "GET" | "POST" | "DELETE" | "PUT", url: string, urlParams: URLSearchParams | null = null, body: object = {}): Promise<string | object> {

        // Add url params
        url = this._baseURL + url;
        if (urlParams) {
            url += "?" + new URLSearchParams(urlParams).toString();
        }

        let bodyString: string = "";
        // Parse the json object to string
        if (typeof body === "object") {
            bodyString = JSON.stringify(body);
        }

        return await this.executeRequest(method, url, bodyString).catch(error => {
            APIClient.handleError(error);
        });
    }

    /**
     * Make the available request (No error handling)
     * @param method The request method
     * @param url The complete request url
     * @param body The body json as a json string
     */
    public executeRequest(method: string, url: string, body: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
                    let response;
                    try {
                        response = JSON.parse(this.responseText);
                    } catch (e) {
                        APIClient.handleError(e);
                    }

                    resolve(response);
                } else if (this.readyState === this.DONE) {
                    reject({
                            status: this.status,
                            message: this.responseText,
                        },
                    );
                }
            };

            request.open(method, url, true);
            request.send(body);
        });
    }

    /**
     * Handle possible errors which happened during the request
     */
    private static handleError(error: any): void {
        console.error(error);
        //TODO Alert
    }
}
