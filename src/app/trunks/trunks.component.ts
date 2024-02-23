import { Component, OnInit } from '@angular/core';
import { TrunksService, TrunkModel } from './trunks.service';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
    selector: 'app-trunks',
    templateUrl: './trunks.component.html',
    styleUrls: ['./trunks.component.css'],
    providers: [TrunksService]
})
export class TrunksComponent implements OnInit {

    public trunks: TrunkModel[] = [];
    public trunkProviderMap: Object;
    public processEvacuating: boolean = false;
    public processRegistering: boolean = false;
    public refreshIntervals: Object[] = [
        { title: "off", interval: 0 },
        { title: "10s", interval: 10 },
        { title: "30s", interval: 30 },
        { title: "60s", interval: 60 },
    ];
    public selectedRefreshInterval: number = 0;
    public voices: Object[] = [];

    constructor(private service: TrunksService, private router: Router) { }

    async ngOnInit() {

        try {
            await this.loadTrunkProviderMap();
            await this.loadTrunks();
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onSetAutoRefresh() {
        await this.autoRefreshRecursion();
    }

    public isBalancedOnProvider(trunk: TrunkModel): boolean {

        for (let i in this.trunkProviderMap) {
            if (this.trunkProviderMap[i].map &&
                this.trunkProviderMap[i].map[trunk.provider]) {

                for (let j in this.trunkProviderMap[i].map[trunk.provider]) {
                    if (this.trunkProviderMap[i].map[trunk.provider][j] === trunk.id)
                        return true;
                }
            }
        }

        return false;
    }

    public isRegisteredTrunk(trunk: TrunkModel): boolean {

        for (let i in this.trunkProviderMap) {
            if (this.trunkProviderMap[i].trunks[trunk._id])
                return true;
        }

        return false;

    }

    public onEdit(trunk: TrunkModel) {
        this.router.navigate(["trunks/edit/", trunk._id]);
    }

    public onCreate() {
        this.router.navigate(["trunks/edit/", ""]);
    }

    public async onStartTrunk(trunk: TrunkModel) {
        try {
            trunk.processInfo.setPending();
            await this.service.startProcess(trunk._id, trunk.location, trunk.debugMode);
            setTimeout(async () => {
                this.loadTrunkProviderMap();
                trunk.setProcessInfo(
                    await this.service.processInfo(trunk._id, trunk.location));
            }, 5000);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onStopTrunk(trunk: TrunkModel) {
        try {
            trunk.processInfo.setPending();
            await this.service.stopProcess(trunk._id, trunk.location);

            setTimeout(async () => {
                this.loadTrunkProviderMap();
                trunk.setProcessInfo(
                    await this.service.processInfo(trunk._id, trunk.location));
            }, 5000);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onEvacuation(trunk: TrunkModel) {
        try {
            this.processEvacuating = true;
            await this.service.evacuation(trunk);
            jQuery.growl.notice({ message: "Ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        } finally {
            this.processEvacuating = false;
        }
    }

    public async onRegister(trunk: TrunkModel) {
        try {
            this.processRegistering = true;
            await this.service.register(trunk);
            setTimeout(() => {
                this.processRegistering = false;
                this.loadTrunkProviderMap()
            }, 2000);
            jQuery.growl.notice({ message: "Ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onUnRegister(trunk: TrunkModel) {
        try {
            this.processRegistering = true;
            await this.service.unregister(trunk);
            setTimeout(() => {
                this.processRegistering = false;
                this.loadTrunkProviderMap()
            }, 2000);
            jQuery.growl.notice({ message: "Ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onLoadActiveVoices(trunk: TrunkModel) {
        try {
            this.voices = await this.service.getActiveVoices(trunk);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onCleanActiveVoices(trunk: TrunkModel) {
        try {
            await this.service.cleanActiveVoices(trunk);
            jQuery.growl.notice({ message: "Ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onLoadQueueVoices(trunk: TrunkModel) {
        try {
            this.voices = await this.service.getQueueVoices(trunk);
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onCleanQueueVoices(trunk: TrunkModel) {
        try {
            await this.service.cleanQueueVoices(trunk);
            jQuery.growl.notice({ message: "Ok" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onCopy(trunk: TrunkModel) {
        try {
            await this.service.createTrunk(trunk);
            await this.loadTrunks();
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    public async onRemove(trunk: TrunkModel) {
        try {
            if (trunk.processInfo.running) {
                await this.onStopTrunk(trunk);
            }

            await this.service.removeTrunk(trunk._id);
            await this.loadTrunks();

        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    private async loadTrunks() {
        this.trunks = await this.service.getTrunks();
        for (let i in this.trunks) {
            this.loadTrunkRuntimeData(this.trunks[i]);
        }
    }

    private async loadTrunkRuntimeData(trunk: TrunkModel) {
        await this.loadProcessInfo(trunk);
    }

    private async loadProcessInfo(trunk: TrunkModel) {
        trunk.processInfo.setPending();
        let processInfo = await this.service.processInfo(trunk._id, trunk.location);
        trunk.setProcessInfo(processInfo);
    }

    private async loadTrunkProviderMap() {
        this.trunkProviderMap = await this.service.getTrunkProviderMap();
    }

    private async autoRefreshRecursion() {
        if (this.selectedRefreshInterval > 0) {
            setTimeout(async () => {
                await this.loadTrunks();
                await this.autoRefreshRecursion();
            }, this.selectedRefreshInterval * 1000);
        }
    }
}
