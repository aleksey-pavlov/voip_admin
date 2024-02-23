import { Injectable } from '@angular/core';
import { RestService } from 'app/rest.service';
import { Http } from '@angular/http';
import { ProcessInfo } from 'app/app.model';

export type TTrankSource = {
    _id: string;
    id: string;
    provider: string;
    weight: number;
    bandwidth: number;
    location: string;
    sipChannelTemplate: string;
    debugMode: boolean;
    devMode: boolean;
    host: string;
    port: number;
    user: string;
    pass: string;
    comment: string;
    cronInterval: number;
    batchSize: number;
    reservable: boolean;
    defaultCaller: string;
    thresholdQueueNotify: number;
    callers: string[];
    callerPrefix: string;
    notice: string;
    maxAllowCallingHour: number;
    minAllowCallingHour: number;

}

export class TrunkModel {
    _id: string;
    id: string = "";
    provider: string = "";
    weight: number = 1;
    bandwidth: number = 1;
    location: string = "";
    sipChannelTemplate: string = "${provider}_${id}/${recipient}";
    statistic: TrunkStatistic = {
        active: 0,
        queue: 0,
        retry: 0
    };;
    debugMode: boolean = false;
    devMode: boolean = false;
    host: string = "localhost";
    port: number = 5038;
    user: string = "admin";
    pass: string = "admin";
    comment: string = "";
    cronInterval: number = 5;
    batchSize: number = 25;
    reservable: boolean = false;
    defaultCaller: string = "";
    thresholdQueueNotify: number = 0;
    processInfo: ProcessInfo;
    callers: string = "";
    callerPrefix: string = "";
    notice: string = "";
    maxAllowCallingHour: number = 24;
    minAllowCallingHour: number = 0;


    constructor(source: TTrankSource) {
        Object.assign(this, source);
        this.callers = source.callers ? source.callers.join('\n') : this.callers;
        this.setProcessInfo(new ProcessInfo({ name: null, pid: 0, pm2_env: {}, pm_id: 0, monit: { cpu: 0, memory: 0 } }));
    }

    setProcessInfo(processInfo: ProcessInfo) {
        this.processInfo = processInfo;
    }

    getSource(): TTrankSource {
        return {
            _id: this._id,
            id: this.id,
            provider: this.provider,
            weight: this.weight,
            bandwidth: this.bandwidth,
            location: this.location,
            sipChannelTemplate: this.sipChannelTemplate,
            debugMode: this.debugMode,
            devMode: this.devMode,
            host: this.host,
            port: this.port,
            user: this.user,
            pass: this.pass,
            comment: this.comment,
            cronInterval: this.cronInterval,
            batchSize: this.batchSize,
            reservable: this.reservable,
            defaultCaller: this.defaultCaller,
            thresholdQueueNotify: this.thresholdQueueNotify,
            callers: this.callers.split("\n").map(item => item.trim()),
            callerPrefix: this.callerPrefix,
            notice: this.notice,
            maxAllowCallingHour: this.maxAllowCallingHour,
            minAllowCallingHour: this.minAllowCallingHour

        }
    }

    getTrunkId(): string {
        return `${this.provider}_${this.id}`;
    }
}

export type TrunkStatistic = {
    queue: number;
    active: number;
    retry: number;
}

@Injectable()
export class TrunksService extends RestService {

    constructor(http: Http) {
        super(http);
    }

    public async getTrunks(): Promise<TrunkModel[]> {
        let response = await this.get('/trunks');
        let data = response.json();
        let trunks = [];
        for (let i in data) {
            trunks.push(new TrunkModel(data[i]));
        }
        return trunks;
    }

    public async getTrunk(_id: string): Promise<TrunkModel> {
        let data: any = {};
        if (_id) {
            let response = await this.get(`/trunks/${_id}`);
            data = response.json();
        }

        let trunk = new TrunkModel(data);
        return trunk;
    }

    public async saveTrunk(trunk: TrunkModel) {

        if (trunk.processInfo.running)
            return await this.put(`/trunks-running/${trunk._id}`, {}, trunk.getSource());

        return await this.put(`/trunks/${trunk._id}`, {}, trunk.getSource());
    }

    public async createTrunk(trunk: TrunkModel) {
        return await this.post('/trunks/', {}, trunk.getSource());
    }

    public async removeTrunk(_id: string) {
        return await this.delete(`/trunks/${_id}`, {});
    }

    public async startProcess(_id: string, location: string, debug: boolean): Promise<ProcessInfo> {
        let response = await this.get(`/agent/trunk/run/${location}/${_id}`, { debug: debug });
        let data = response.json();
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async stopProcess(_id: string, location: string) {
        let response = await this.get(`/agent/trunk/stop/${location}/${_id}`);
        let data = response.json();
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async processInfo(_id: string, location: string) {
        let data = [];
        if (_id && location) {
            let response = await this.get(`/agent/trunk/info/${location}/${_id}`);
            data = response.json();
        }
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async getTrunkProviderMap(): Promise<Object> {
        let response = await this.get("/trunks-provider/balancer/map");
        return response.json();
    }

    public async evacuation(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.get(`/trunks-running/evacuation/${trunk._id}`);
        return response.json();
    }

    public async getActiveVoices(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.get(`/trunks-running/active-voices/${trunk._id}`);
        return response.json();
    }

    public async cleanActiveVoices(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.delete(`/trunks-running/active-voices/${trunk._id}`);
        return response.json();
    }

    public async getQueueVoices(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.get(`/trunks-running/queue-voices/${trunk._id}`);
        return response.json();
    }

    public async cleanQueueVoices(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.delete(`/trunks-running/queue-voices/${trunk._id}`);
        return response.json();
    }

    public async register(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.get(`/trunks-running/register/${trunk._id}`);
        return response.json();
    }

    public async unregister(trunk: TrunkModel) {
        if (!trunk.processInfo.running) {
            throw new Error("Trunk is not running!");
        }

        let response = await this.get(`/trunks-running/unregister/${trunk._id}`);
        return response.json();
    }
}
