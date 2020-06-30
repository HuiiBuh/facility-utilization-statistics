import * as https from "https";
import {RequestOptions} from "https";
import {ClientRequest, IncomingMessage, OutgoingHttpHeaders} from "http";


export default class APIClient {
    private readonly _baseURL: string;
    private readonly headers: OutgoingHttpHeaders;

    /**
     * A new async api client which converts callbacks to promises
     * @param baseURL The base url of the server
     * @param header The headers which should be sent with every request
     */
    constructor(baseURL = "", header: OutgoingHttpHeaders = null) {
        this._baseURL = baseURL;
        this.headers = header;
    }

    /**
     * Put request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async put(url: string, urlParams: URLSearchParams = null, body: Record<string, unknown> = {}): Promise<string> {
        return await this.request("PUT", url, urlParams, body);
    }

    /**
     * Get request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async get(url: string, urlParams: URLSearchParams = null, body: Record<string, unknown> = {}): Promise<string> {
        return await this.request("GET", url, urlParams, body);
    }

    /**
     * Post request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async post(url: string, urlParams: URLSearchParams = null, body: Record<string, unknown> = {}): Promise<string> {
        return await this.request("POST", url, urlParams, body);
    }

    /**
     * Delete request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async delete(url: string, urlParams: URLSearchParams = null, body: Record<string, unknown> = {}): Promise<string> {
        return await this.request("DELETE", url, urlParams, body);
    }

    /**
     * Start the request (Errors get handled)
     * @param method The method which should be used for the request
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     */
    public async request(method: "GET" | "POST" | "DELETE" | "PUT", url: string, urlParams: URLSearchParams = null, body: Record<string, unknown> = {}): Promise<string> {

        // Add url params
        url = this._baseURL + url;
        if (urlParams) {
            url += "?" + new URLSearchParams(urlParams).toString();
        }

        let bodyString = "";
        // Parse the json object to string
        if (typeof body === "object") {
            bodyString = JSON.stringify(body);
        }

        return await this.executeRequest(method, url, bodyString);
    }

    /**
     * Make the available request (No error handling)
     * @param method The request method
     * @param url The complete request url
     * @param body The body json as a json string
     */
    public executeRequest(method: string, url: string, body: string): Promise<string> {
        return new Promise((resolve, reject) => {

            const options: RequestOptions = {
                method: method,
            };

            if (this.headers) {
                options.headers = this.headers;
            }

            const req: ClientRequest = https.request(url, options, (res: IncomingMessage) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    resolve(data);
                });
            });

            req.on("error", (error: Error) => {
                reject(error);
            });

            req.write(body);
            req.end();
        });

    }
}
