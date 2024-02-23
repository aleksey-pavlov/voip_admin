import { Component, OnInit } from '@angular/core';
import { GatewaysService } from "./gateways.service";
import { Gateway } from "./objects/gateway.model";
import { Router } from "@angular/router";

declare var jQuery: any;

@Component({
    selector: 'app-gateways',
    templateUrl: './gateways.component.html',
    styleUrls: ['./gateways.component.css'],
    providers: [GatewaysService]
})
export class GatewaysComponent implements OnInit {

    public gateways: Gateway[] = [];
    public processEvacuation: boolean = false;
    public outboxStat: { [x: string]: number } = {};
    public gatewaysProviderMap: Object = {};


    constructor(private service: GatewaysService, private router: Router) { }

    async ngOnInit() {
        await this.loadGatewaysProviderMap();
        let gateways = await this.service.getGateways();
        for (let i in gateways) {
            this.setProcessInfo(gateways[i]);
        }

        this.gateways = gateways;
    }

    private async setProcessInfo(gateway: Gateway) {
        gateway.processInfo.setPending();
        let processInfo = await this.service.processInfo(gateway._id, gateway.location);
        gateway.setProcessInfo(processInfo);
    }

    public onEdit(gateway: Gateway) {
        this.router.navigate(["gateways/edit/", gateway._id]);
    }

    public onCreate() {
        this.router.navigate(["gateways/edit/", ""]);
    }

    public async onStartGateway(gateway: Gateway) {
        gateway.processInfo.setPending();
        let processInfo = await this.service.startProcess(gateway._id, gateway.location);
        gateway.setProcessInfo(processInfo);
        setTimeout(() => this.loadGatewaysProviderMap(), 4000);
    }

    public async onStopGateway(gateway: Gateway) {
        gateway.processInfo.setPending();
        let processInfo = await this.service.stopProcess(gateway._id, gateway.location);
        gateway.setProcessInfo(processInfo);
        setTimeout(() => this.loadGatewaysProviderMap(), 4000);
    }

    public async onEvacuation(gateway: Gateway) {
        this.processEvacuation = true;
        let response = await this.service.evacuation(gateway._id, gateway);
        this.processEvacuation = false;


        if (response.error) {
            jQuery.growl.error({ message: response.error });
        } else {
            jQuery.growl.notice(response);
        }
    }

    public async onOutboxStat(gateway: Gateway) {
        this.outboxStat = await this.service.outboxStat(gateway._id, gateway);
    }

    public isRegisterOnProvider(gateway: Gateway) {

        let messagesType = gateway.messagesType || undefined;

        if (!this.gatewaysProviderMap[messagesType])
            return false;

        let mapByProvider = this.gatewaysProviderMap[messagesType];

        for (let i in gateway.ports) {
            let port = gateway.ports[i];
            let isActivePort = port.active || port.isResend;
            let provider = port.provider;
            if (isActivePort) {

                if (!mapByProvider[provider])
                    return false;

                let contains = false;
                for (let g in mapByProvider[provider]) {
                    if (mapByProvider[provider][g] == gateway._id)
                        contains = true;
                }

                if (!contains)
                    return false;
            }
        }

        return true;
    }

    private async loadGatewaysProviderMap(): Promise<void> {
        this.gatewaysProviderMap = await this.service.getGatewaysProviderMap();
    }
}
