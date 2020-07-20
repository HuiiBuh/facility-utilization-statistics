import {ClientRequest, IncomingMessage, OutgoingHttpHeaders} from "http";
import * as https from "https";
import {RequestOptions} from "https";

export default class RequestMaker {

    /**
     * Put request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     * @param headers The request headers
     */
    public async put(
        url: string,
        urlParams: URLSearchParams = null,
        body: Record<string, unknown> = {},
        headers: OutgoingHttpHeaders = {}
    ): Promise<string | null> {
        return await this.request("PUT", url, urlParams, body, headers);
    }

    /**
     * Get request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     * @param headers The request headers
     */
    public async get(
        url: string,
        urlParams: URLSearchParams = null,
        body: Record<string, unknown> = {},
        headers: OutgoingHttpHeaders = {}
    ): Promise<string | null> {
        return await this.request("GET", url, urlParams, body, headers);
    }

    /**
     * Post request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     * @param headers The request headers
     */
    public async post(
        url: string,
        urlParams: URLSearchParams = null,
        body: Record<string, unknown> = {},
        headers: OutgoingHttpHeaders = {}
    ): Promise<string | null> {
        return await this.request("POST", url, urlParams, body, headers);
    }

    /**
     * Delete request (Errors get handled)
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     * @param headers The request headers
     */
    public async delete(
        url: string,
        urlParams: URLSearchParams = null,
        body: Record<string, unknown> = {},
        headers: OutgoingHttpHeaders = {}
    ): Promise<string | null> {
        return await this.request("DELETE", url, urlParams, body, headers);
    }

    /**
     * Start the request (Errors get handled)
     * @param method The method which should be used for the request
     * @param url The url (relative to the base url)
     * @param urlParams A json object which will be used to create the url params
     * @param body The body as a json
     * @param headers To request headers
     */
    public async request(
        method: "GET" | "POST" | "DELETE" | "PUT",
        url: string,
        urlParams: URLSearchParams = null,
        body: Record<string, unknown> = {},
        headers: OutgoingHttpHeaders = {}
    ): Promise<string | null> {

        // Add url params
        if (urlParams) {
            url += "?" + new URLSearchParams(urlParams).toString();
        }

        // Parse the json object to string
        let bodyString = "";
        if (typeof body === "object") {
            bodyString = JSON.stringify(body);
        }

        // Add the request method
        const options: RequestOptions = {
            method: method,
        };

        // Add the request headers
        if (headers) {
            options.headers = headers;
        }
        try {
            return await this.makeRequest(url, options, bodyString);
        } catch (e) {
            RequestMaker.handleErrors(e);
        }
    }

    /**
     * Make the available request (No error handling)
     * @param url The request url
     * @param options The request options
     * @param body The body json as a json string
     */
    public makeRequest(url: string, options: RequestOptions, body: string): Promise<string> {
        return new Promise((resolve, reject) => {

            const req: ClientRequest = https.request(url, options, (res: IncomingMessage) => {
                let data = "";

                res.on("data", chunk => {
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

    /**
     * Handle request errors
     * @param e
     */
    private static handleErrors(e: Error): void {
        console.error(e);
    }
}
