import { Http, Headers, Response, RequestOptionsArgs } from "@angular/http";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { Config } from "../config";

export abstract class RestService {

    public requestOptions: RequestOptionsArgs = {};

    constructor(private http: Http) {
        this.requestOptions.headers = new Headers();
        this.requestOptions.headers.append("Content-type", "application/json");
    }

    public getSessid() {
        return Cookie.get(Config.SESSKEY);
    }

    public objectToUrl(data: Object): string {

        let query: string[] = [];

        for (let i in data) {
            query.push(i + "=" + data[i]);
        }

        if (query.length === 0)
            return "";

        return "?" + query.join("&");
    }

    public async get(path: string, data?: Object) {

        if (!data) data = {};
        data[Config.SESSKEY] = this.getSessid();
        return new Promise<Response>((resolve, reject) => {
            this.http.get(
                Config.API_URL + path + this.objectToUrl(data),
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    };

    public async post(path: string, data?: Object, post?: Object) {

        if (!data) data = {};
        if (!post) post = {};

        data[Config.SESSKEY] = this.getSessid();

        return new Promise<Response>((resolve, reject) => {
            this.http.post(
                Config.API_URL + path + this.objectToUrl(data),
                post,
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    };

    public async put(path: string, data?: Object, put?: Object) {

        if (!data) data = {};
        if (!put) put = {};
        data[Config.SESSKEY] = this.getSessid();

        return new Promise<Response>((resolve, reject) => {
            this.http.put(
                Config.API_URL + path + this.objectToUrl(data),
                put,
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });

    };

    public async delete(path: string, data?: Object) {
        if (!data) data = {};
        data[Config.SESSKEY] = this.getSessid();
        return new Promise<Response>((resolve, reject) => {
            this.http.delete(
                Config.API_URL + path + this.objectToUrl(data),
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    };
}