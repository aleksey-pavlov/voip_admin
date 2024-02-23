import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { RestService } from "../rest.service";

export class Client {
    public _id: string;
    public statDaily: StatDaily;
    public voiceStatDaily: StatDaily;
    public ip: string;
    public ipVerification: boolean = false;
    public active: boolean = false;
    public blocked: boolean = false;
    public dailyLimit: number;
    public voiceDailyLimit: number;
    public sentTotal: number;
    public voiceSentTotal: number;
    public authAt: number;
    public uid: number;
    public email: string;
    public authKey: string;
    public sendStatusUrl: string;
    public resolveTaskUrl: string;
    public voiceBandwidthLimit: number = 0;
    public voiceQueue: number = 0;
    public voiceTrunkId: string;
    public voiceRetryLimit: number = 3;
    public voiceRetryDelayLimit: number = 300;

    constructor(json: Object) {
        Object.assign(this, json);

        if (!this.statDaily)
            this.statDaily = new StatDaily(this.statDaily);

        if (!this.voiceStatDaily)
            this.voiceStatDaily = new StatDaily(this.voiceStatDaily);
    }
}

export class StatDaily {
    sentMessages: number = 0;
    resetAt: number = 0;
    resetInterval: number = 86400;

    constructor(json: Object) {
        Object.assign(this, json);
    }
}

@Injectable()
export class ClientsService extends RestService {

    constructor(http: Http) {
        super(http);
    }

    public async getClients() {

        let response = await this.get("/clients");
        let data = response.json();
        let clients: Client[] = [];

        for (let i of data) {
            clients.push(new Client(i));
        }

        return {
            clients: clients,
            response: response
        };
    }

    public async getClient(_id: string) {
        let response = await this.get("/clients/" + _id);
        let data = response.json();
        let client = new Client(data);

        return {
            client: client,
            response: response
        };
    }

    public async saveClient(client: Client) {
        return await this.put("/clients/" + client._id, {}, client);
    }

    public async createClient(client: Client) {
        return await this.post("/clients", {}, client);
    }

    public async syncClient() {
        return await this.post("/clients/sync");
    }

    public async removeClient(client:Client) {
        return await this.delete(`/clients/${client._id}`, {});
    }

}