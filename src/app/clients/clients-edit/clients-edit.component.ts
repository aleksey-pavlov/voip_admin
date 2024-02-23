import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from "@angular/http";
import { ClientsService, Client } from "../clients.service";
import { TrunksService, TrunkModel } from 'app/trunks/trunks.service';
declare var jQuery: any;

@Component({
    selector: 'app-clients-edit',
    templateUrl: './clients-edit.component.html',
    styleUrls: ['./clients-edit.component.css'],
    providers: [ClientsService, TrunksService]
})
export class ClientsEditComponent implements OnInit {

    public client: Client;
    public trunks: TrunkModel[];
    public reservableTrunks: TrunkModel[];

    constructor( private service: ClientsService, private trunksService: TrunksService, private route: ActivatedRoute ) { }

    ngOnInit() {
        this.route.params.subscribe(async (params) => {

            let response = await this.service.getClient(params['id']);

            this.client = response.client;

            this.trunks = await this.trunksService.getTrunks();
            this.reservableTrunks = this.trunks.filter(t => t.reservable);
        } );
    }

    async onSubmit() {

        let response: Response;

        if ( !this.client._id )
            response = await this.service.createClient(this.client);
        else
            response = await this.service.saveClient(this.client);

        if ( response.ok )
            jQuery.growl.notice({message: JSON.stringify(response.json())});
        else
            jQuery.growl.error(response);
    }

}
