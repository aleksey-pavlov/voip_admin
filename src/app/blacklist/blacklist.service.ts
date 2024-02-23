import { Injectable } from "@angular/core";
import { RestService } from "app/rest.service";
import { Http } from "@angular/http/src/http";

export type Recipient = {
    _id?: string,
    recipient: string,
    created_at?: string
}


@Injectable()
export class BlackListService extends RestService {

    constructor(http: Http) {
        super(http);
    }

    public async getRecipients(): Promise<Recipient[]> {
        let response = await this.get("/blacklist", {});
        return response.json();
    }

    public async create(recipient: Recipient) {
        return await this.post("/blacklist/", {}, recipient);
    }

    public async remove(_id: string) {
        return await this.delete("/blacklist/" + _id);
    }

    public async sync() {
        return await this.post("/blacklist/sync");
    }
}