import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService, Client } from "../clients/clients.service";
import { TrunksService, TrunkModel } from 'app/trunks/trunks.service';
declare var jQuery: any;
@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css'],
    providers: [ClientsService, TrunksService]
})
export class ClientsComponent implements OnInit {

    public clients: Client[];
    private removeClient: Client;
    private trunks: { [x: string]: string } = {};

    constructor(private service: ClientsService, private trunksService: TrunksService, private router: Router) { }

    async ngOnInit() {

        this.trunks = await this.getTrunksById();

        await this.loadClients();

    }

    onEdit(client: Client) {
        this.router.navigate(["/clients/edit", client._id]);
    }

    onRemove(client: Client) {
        this.removeClient = client;
    }
    async onRemoveConfirm() {

        try {
            await this.service.removeClient(this.removeClient);
            this.removeClient = null;
            jQuery.growl.notice({ message: "OK" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        } finally {
            this.loadClients();
        }
    }


    async onCopy(client: Client) {
        try {
            client.sentTotal = 0;
            client.voiceSentTotal = 0;
            client.voiceStatDaily.sentMessages = 0;
            client.statDaily.sentMessages = 0;
            await this.service.createClient(client);
            this.loadClients();
            jQuery.growl.notice({ message: "OK" });
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    async onSync() {

        let response = await this.service.syncClient();
        console.log(response);
        if (response.ok)
            jQuery.growl.notice(response.json());
        else
            jQuery.growl.error(response.json());
    }

    private async loadClients() {
        let result = await this.service.getClients();
        this.clients = result.clients;
    }

    private async getTrunksById(): Promise<{ [x: string]: string }> {

        let trunksById = {};

        let trunks = await this.trunksService.getTrunks();

        for (let i in trunks)
            trunksById[trunks[i]._id] = trunks[i].comment;

        return trunksById;

    }

}
