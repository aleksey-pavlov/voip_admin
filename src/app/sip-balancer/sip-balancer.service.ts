import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RestService } from 'app/rest.service';

export type TSipBalancerStat = {

    idle: {},
    busy: {}

}

export class SipBalancerModel {

    public _id: string;
    public url: string;
    public channels: string;
    public stat: TSipBalancerStat = { busy: {}, idle: {} };

    constructor(source: TSipBalancerSource) {

        this._id = source._id;
        this.url = source.url;

        let channels = [];
        for (let i in source.channels) {

            let channel = source.channels[i];
            channels[i] = `${channel.id};${channel.provider};${channel.weight};${channel.timeout || 0}`;
        }

        this.channels = channels.join("\n");

    }

    getSource(): TSipBalancerSource {

        return {
            _id: this._id,
            url: this.url,
            channels: (() => {

                let source: TSipBalancerChannelSource[] = [];

                let channels = this.channels.split("\n");
                for (let i in channels) {

                    let ch = channels[i].split(';');

                    source[i] = {
                        id: ch[0],
                        provider: ch[1],
                        weight: Number(ch[2]),
                        timeout: Number(ch[3]) || 0
                    }
                }

                return source;
            })()
        }

    }

    setStat(stat: TSipBalancerStat) {
        this.stat = stat;
    }

}

export type TSipBalancerChannelSource = {
    id: string,
    provider: string,
    weight: number,
    timeout: number
}

export type TSipBalancerSource = {

    _id: string;
    url: string;
    channels: TSipBalancerChannelSource[]
}

@Injectable()
export class SipBalancerService extends RestService {

    private _http: Http;

    constructor(http: Http) {
        super(http);
        this._http = http;
    }

    public async getBalancer() {

        let response = await this.get('/sip_balancer');
        let balancer = response.json();

        return { response: response, balancer: new SipBalancerModel(balancer[0] || {}) };

    }

    public async saveBalancer(balancer: SipBalancerModel) {

        return await this.put(`/sip_balancer/${balancer._id}`, {}, balancer.getSource());
    }

    public async createBalancer(balancer: SipBalancerModel) {

        return await this.post(`/sip_balancer`, {}, balancer.getSource());
    }

    public async reloadBalancer(url: string): Promise<Response> {

        return new Promise<Response>((resolve, reject) => {
            this._http.get(
                `${url}/channels/reload`,
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    }

    public async getIdleChannels(url: string): Promise<Response> {

        return new Promise<Response>((resolve, reject) => {
            this._http.get(
                `${url}/channels/idle`,
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    }

    public async getBusyChannels(url: string): Promise<Response> {

        return new Promise<Response>((resolve, reject) => {
            this._http.get(
                `${url}/channels/busy`,
                this.requestOptions).subscribe(data => resolve(data), error => reject(error));
        });
    }

}
