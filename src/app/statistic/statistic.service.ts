import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { RestService } from "../rest.service";

export interface Query {
    from: number;
    to: number;
    email: string;
}

@Injectable()
export class StatisticService extends RestService {

    constructor(http: Http) {
        super(http);
    }

    public async upload(params: Query) {
        return await this.get("/statistic/upload", params);
    }    
}