import { Port } from "./port.model";
import { ProcessInfo } from "app/app.model";

export type MessageType = "service" | "advertising";

export type Source = {
    _id: string;
    ports: Port[];
    ip: string;
    port: number;
    user: string;
    password: string;
    maxMsgInQueue: number;
    maxQueryResult: number;
    limitMsgQueryResult: number;
    rutineInterval: number;
    name: string;
    statusCode: number;
    statusNote: string;
    location: string;
    sentBoxExpire: number;
    deviceUserId: number;
    messagesType: MessageType;
    adminUrl: string;
    mobileConfigManual: boolean;

}

export class PortsState {
    public providers: { [x: string]: number } = {};
    public active: number = 0;
    public resend: number = 0;
    public total: number = 0;
}

export class Gateway {
    public _id: string;
    public port: number;
    public ip: string;
    public user: string;
    public password: string;
    public name: string;
    public location: string;
    public maxMsgInQueue: number;
    public maxQueryResult: number;
    public limitMsgQueryResult: number;
    public rutineInterval: number;
    public sentBoxExpire: number;
    public deviceUserId: number;
    public statusCode: number;
    public statusNote: string;
    public messagesType: MessageType;
    public adminUrl: string;
    public mobileConfigManual: boolean;
    public portsState: PortsState;


    public ports: { [x: number]: Port } = {};
    public processInfo: ProcessInfo;
    public boxesState: Object = {
        outbox: 0,
        sentbox: 0
    };

    constructor(json: Object) {
        Object.assign(this, json);
        this.setProcessInfo(new ProcessInfo(json["processInfo"] || {}));
        this.setPortsState();
    }

    public setProcessInfo(info: ProcessInfo): void {
        this.processInfo = info;
    }

    private setPortsState() {

        this.portsState = new PortsState();

        for (var i in this.ports) {
            let provider = this.ports[i].provider;
            let active = this.ports[i].active;
            let resend = this.ports[i].isResend;

            if (this.portsState.providers[provider] == undefined)
                this.portsState.providers[provider] = 0

            this.portsState.providers[provider]++;
            if (active)
                this.portsState.active++;

            if (resend)
                this.portsState.resend++;

            this.portsState.total++;
        }
    }

    public get(): Source {

        let ports = [];

        for (let i in this.ports) {
            ports[i] = this.ports[i];
        }

        return {
            _id: this._id,
            ports: ports,
            port: this.port,
            ip: this.ip,
            user: this.user,
            password: this.password,
            name: this.name,
            location: this.location,
            maxMsgInQueue: this.maxMsgInQueue,
            maxQueryResult: this.maxQueryResult,
            limitMsgQueryResult: this.limitMsgQueryResult,
            rutineInterval: this.rutineInterval,
            sentBoxExpire: this.sentBoxExpire,
            statusCode: this.statusCode,
            statusNote: this.statusNote,
            deviceUserId: this.deviceUserId,
            messagesType: this.messagesType,
            adminUrl: this.adminUrl,
            mobileConfigManual: this.mobileConfigManual
        };
    }
}