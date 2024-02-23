import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { GatewaysService, mesagesTypes, methodsGetStatus, messageStatus } from "../gateways.service";
import { Gateway } from "../objects/gateway.model";
import { Port } from "../objects/port.model";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";
import { isUndefined } from "util";
import { GmsProviders } from 'app/app.model';

declare var jQuery: any;

@Component({
    selector: 'app-gateways-edit',
    templateUrl: './gateways-edit.component.html',
    styleUrls: ['./gateways-edit.component.css'],
    providers: [GatewaysService]
})
export class GatewaysEditComponent implements OnInit {

    public gateway: Gateway;
    public massDayLimit: number;
    public massMonthLimit: number;
    public massNumSlots: number;
    public massResetAtDay: number = Date.now();
    public massResetAtMonth: number = Date.now();
    public massActiveSlot: number;
    public massSMSC: string;
    public slotsPerPort: number = 0;
    public portProviders: string[];
    public messagesTypes: string[];
    public methodsGetStatus: string[];
    public messageStatus: string[];
    public advancedPortsSelector: boolean = false;

    public advancedData = {
        ports: [],
        limitDay: null,
        provider: null,
        activeSlot: null,
        active: false,
        isResend: false,
        initialActive: false,
        initialIsResend: false
    };

    constructor(private service: GatewaysService, private route: ActivatedRoute) { }

    async ngOnInit() {
        this.portProviders = GmsProviders;
        this.messagesTypes = mesagesTypes;
        this.methodsGetStatus = methodsGetStatus;
        this.messageStatus = messageStatus;
        this.route.params.subscribe(async params => {
            let id = params["id"];
            let gateway = await this.service.getGateway(id);
            let processInfo = await this.service.processInfo(gateway._id, gateway.location);
            gateway.setProcessInfo(processInfo);

            for (let i in gateway.ports) {
                if (this.slotsPerPort < gateway.ports[i].numSlots)
                    this.slotsPerPort = gateway.ports[i].numSlots;

                this.advancedData.ports[i] = false;
            }
            this.gateway = gateway;
        });
    }

    public async onStartGateway(gateway: Gateway) {
        let processInfo = await this.service.startProcess(gateway._id, gateway.location);
        gateway.setProcessInfo(processInfo);
    }

    public async onStopGateway(gateway: Gateway) {
        let processInfo = await this.service.stopProcess(gateway._id, gateway.location);
        gateway.setProcessInfo(processInfo);
    }

    onChangeMassDayLimit() {
        if (this.massDayLimit && this.massDayLimit > 0) {
            for (let port in this.gateway.ports) {
                this.gateway.ports[port].limitDay = this.massDayLimit;
            }
        }
    }

    onChangeMassMonthLimit() {
        if (this.massMonthLimit && this.massMonthLimit > 0) {
            for (let port in this.gateway.ports) {
                this.gateway.ports[port].limitMonth = this.massMonthLimit;
            }
        }
    }

    onChangeMassNumSlots() {
        if (this.massNumSlots && this.massNumSlots > 0) {
            for (let port in this.gateway.ports) {
                this.gateway.ports[port].numSlots = this.massNumSlots;
            }
        }
    }

    onChangeMassResetAtDay(event) {
        let time = Math.floor(new Date(event).getTime() / 1000);
        if (this.massResetAtDay && this.massResetAtDay > 0) {
            for (const port in this.gateway.ports) {
                this.gateway.ports[port].resetDayAt = time;
            }
        }
    }

    onChangeMassResetAtMonth(event) {
        let time = Math.floor(new Date(event).getTime() / 1000);
        if (this.massResetAtMonth && this.massResetAtMonth > 0) {
            for (const port in this.gateway.ports) {
                this.gateway.ports[port].resetMonthAt = time;
            }
        }
    }

    onSetMassActiveSlot() {
        if (this.massActiveSlot != undefined) {
            for (let port in this.gateway.ports) {
                this.gateway.ports[port].activeSlot = this.massActiveSlot;
            }
        }
    }

    onChangeMassSMSC() {
        if (this.massSMSC != undefined) {
            for (let port in this.gateway.ports) {
                this.gateway.ports[port].mobileConfig.SMSC = this.massSMSC;
            }
        }
    }

    onToggleAdvanceInitialActive = () => this.advancedData.initialActive = this.advancedData.initialActive ? false : true;

    onToggleAdvanceInitialIsResend = () => this.advancedData.initialIsResend = this.advancedData.initialIsResend ? false : true;

    onApplyAdvancedData() {
        for (let i in this.advancedData.ports) {
            if (this.advancedData.ports[i]) {
                for (let j in this.advancedData) {
                    if (this.advancedData[j] !== null)
                        this.gateway.ports[i][j] = this.advancedData[j];
                }
            }
        }
    }

    onToggleAdvancedPortsSelector() {
        this.advancedPortsSelector = this.advancedPortsSelector ? false : true;
        for (let i in this.advancedData.ports)
            this.advancedData.ports[i] = this.advancedPortsSelector;
    }

    onClearAdvanceData() {
        for (let i in this.advancedData.ports)
            this.advancedData.ports[i] = false;

        this.advancedData.activeSlot = null;
        this.advancedData.limitDay = null;
        this.advancedData.provider = null;
        this.advancedData.active = false;
        this.advancedData.isResend = false;
        this.advancedData.initialActive = false;
        this.advancedData.initialIsResend = false;
    }

    diagnostic() {
        return JSON.stringify(this.gateway, null, 2);
    }

    setResetDayAt(event, port: Port) {
        let time = Math.floor(new Date(event).getTime() / 1000);
        port.resetDayAt = time;
    }

    setResetMonthAt(event, port: Port) {
        let time = Math.floor(new Date(event).getTime() / 1000);
        port.resetMonthAt = time;
    }

    async onSubmit() {

        let response: Response;

        if (!this.gateway._id)
            response = await this.service.createGateway(this.gateway);
        else
            response = await this.service.saveGateway(this.gateway);

        if (response.ok) {
            jQuery.growl.notice({ message: JSON.stringify(response.json()) });
        } else
            jQuery.growl.error(response);
    }

    onAppendPort() {

        let ports = {};
        let lenPorts = Object.keys(this.gateway.ports).length;
        for (let i = 0; i < lenPorts + 1; i++)
            ports[i] = this.gateway.ports[i] === undefined ? new Port(i) : this.gateway.ports[i];
        this.gateway.ports = ports;
        return true;
    }

    onRemovePort() {
        if (!isUndefined(this.gateway.ports)) {
            let ports = {};
            let lenPorts = Object.keys(this.gateway.ports).length;
            for (let i = 0; i < lenPorts - 1; i++)
                ports[i] = this.gateway.ports[i];
            this.gateway.ports = ports;
            return true;
        }
    }

    onToggleActiveLock(portNum: number) {
        this.gateway.ports[portNum].initialActive = this.gateway.ports[portNum].initialActive ? false : true
    }

    onToggleResendLock(portNum: number) {
        this.gateway.ports[portNum].initialIsResend = this.gateway.ports[portNum].initialIsResend ? false : true
    }
}