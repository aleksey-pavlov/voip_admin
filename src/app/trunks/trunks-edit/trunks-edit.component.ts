import { Component, OnInit } from '@angular/core';
import { TrunksService, TrunkModel } from '../trunks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GmsProviders } from 'app/app.model';

declare var jQuery: any;

@Component({
    selector: 'app-trunks-edit',
    templateUrl: './trunks-edit.component.html',
    styleUrls: ['./trunks-edit.component.css'],
    providers: [TrunksService]
})
export class TrunksEditComponent implements OnInit {

    public trunk: TrunkModel;
    public providers = GmsProviders;
    constructor(private service: TrunksService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(async params => {
            let trunkId = params["id"];
            this.trunk = await this.service.getTrunk(trunkId);
            let processInfo = await this.service.processInfo(trunkId, this.trunk.location);
            this.trunk.setProcessInfo(processInfo);
        });
    }

    async onSubmit() {
        try {
            if (this.trunk._id)
                await this.service.saveTrunk(this.trunk);
            else
                await this.service.createTrunk(this.trunk);

            jQuery.growl.notice({ message: "ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onStopTrunk(trunk: TrunkModel) {
        try {
            trunk.processInfo.setPending();
            let processInfo = await this.service.stopProcess(trunk._id, trunk.location);
            trunk.setProcessInfo(processInfo);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onStartTrunk(trunk: TrunkModel) {
        try {
            trunk.processInfo.setPending();
            let processInfo = await this.service.startProcess(trunk._id, trunk.location, trunk.debugMode);
            trunk.setProcessInfo(processInfo);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }
}
