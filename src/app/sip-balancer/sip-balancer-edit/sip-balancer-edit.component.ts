import { Component, OnInit } from '@angular/core';
import { SipBalancerService, SipBalancerModel } from '../sip-balancer.service';
import { Response } from '@angular/http';
declare var jQuery: any;

@Component({
    selector: 'app-sip-balancer-edit',
    templateUrl: './sip-balancer-edit.component.html',
    styleUrls: ['./sip-balancer-edit.component.css'],
    providers: [SipBalancerService]
})
export class SipBalancerEditComponent implements OnInit {

    public balancer: SipBalancerModel;
    public reloadAvailable: boolean = true;

    constructor(private service: SipBalancerService) { }

    async ngOnInit() {

        let response = await this.service.getBalancer();
        this.balancer = response.balancer;

        if (this.balancer.url) {
            await this.loadBalancerStat(this.balancer);
            setInterval(async () => await this.loadBalancerStat(this.balancer), 5000);
        }

        console.log(this.balancer);
    }

    async onSubmit() {

        let response: Response;
        this.reloadAvailable = false;

        if (!this.balancer._id) {
            response = await this.service.createBalancer(this.balancer);
            let json = response.json();
            this.balancer._id = json.insertedIds[0];
        } else {
            response = await this.service.saveBalancer(this.balancer);
        }

        this.onResponse(response);

        setTimeout(() => this.reloadAvailable = true, 1000);
    }

    async onReloadBalancer() {

        if (!this.reloadAvailable)
            return;

        let response = await this.service.reloadBalancer(this.balancer.url);
        this.onResponse(response);

    }

    private onResponse(response: Response) {

        if (response.ok)
            jQuery.growl.notice({ message: JSON.stringify(response.text()) });
        else
            jQuery.growl.error(response);

    }

    private async loadBalancerStat(balancer: SipBalancerModel) {

        let idleResp = await this.service.getIdleChannels(balancer.url);
        let idleChannels = idleResp.json();

        let busyResp = await this.service.getBusyChannels(balancer.url);
        let busyChannels = busyResp.json();


        balancer.setStat({ busy: busyChannels, idle: idleChannels });
    }

}
