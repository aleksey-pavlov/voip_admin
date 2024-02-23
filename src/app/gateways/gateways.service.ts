import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RestService } from '../rest.service';
import { Gateway } from './objects/gateway.model';
import { ProcessInfo } from 'app/app.model';

export let mesagesTypes = [undefined, 'service', 'advertising'];
export let methodsGetStatus = ['query', 'push'];
export let messageStatus = ["", "SENT_OK", "DELIVERED", "DELETED"];

@Injectable()
export class GatewaysService extends RestService {
    private readonly IS_NOT_RUNNING: string = "Gateway is not running!";
    constructor(http: Http) {
        super(http);
    }

    public async getGateways(): Promise<Gateway[]> {
        let response = await this.get('/gateways');
        let data = response.json();
        let gateways = [];
        for (let i in data) {
            gateways.push(new Gateway(data[i]));
        }
        return gateways;
    }

    public async getGateway(_id: string): Promise<Gateway> {
        let data = {};
        if (_id) {
            let response = await this.get(`/gateways/${_id}`);
            data = response.json();
        }

        let gateway = new Gateway(data);
        return gateway;
    }

    public async saveGateway(gateway: Gateway) {

        if (gateway.processInfo.running) {
            return await this.put(`/gateways-running/${gateway._id}`, {}, gateway.get());
        }

        return await this.put(`/gateways/${gateway._id}`, {}, gateway.get());
    }

    public async createGateway(gateway: Gateway) {
        return await this.post('/gateways/', {}, gateway.get());
    }

    public async startProcess(_id: string, location: string): Promise<ProcessInfo> {
        let response = await this.get(`/agent/run/${location}/${_id}`);
        let data = response.json();
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async stopProcess(_id: string, location: string) {
        let response = await this.get(`/agent/stop/${location}/${_id}`);
        let data = response.json();
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async processInfo(_id: string, location: string) {
        let data = [];
        if (_id && location) {
            let response = await this.get(`/agent/info/${location}/${_id}`);
            data = response.json();
        }
        let processInfo = new ProcessInfo(data[0] || {});
        return processInfo;
    }

    public async evacuation(_id: string, gateway: Gateway) {
        if (gateway.processInfo.running) {
            let response: Response = await this.get(`/gateways-running/evacuation/${_id}`);
            return response.json();
        }

        return { error: this.IS_NOT_RUNNING }
    }

    public async outboxStat(_id: string, gateway: Gateway) {
        if (gateway.processInfo.running) {
            let response: Response = await this.get(`/gateways-running/outbox-stat/${_id}`);
            return response.json();
        }

        return { error: this.IS_NOT_RUNNING }
    }

    public async getGatewaysProviderMap() {
        let response = await this.get("/gateways-provider/map");
        return response.json();
    }
}