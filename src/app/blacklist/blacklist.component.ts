import { Component, OnInit } from '@angular/core';
import { BlackListService, Recipient } from 'app/blacklist/blacklist.service';
import { Response } from '@angular/http/src/static_response';
declare var jQuery: any;
@Component({
    selector: 'app-blacklist',
    templateUrl: './blacklist.component.html',
    styleUrls: ['./blacklist.component.css'],
    providers: [BlackListService]
})
export class BlacklistComponent implements OnInit {

    private recipients: Recipient[] = [];
    public recipient: Recipient = { recipient: '' };

    constructor(private service: BlackListService) { }

    async ngOnInit() {
        await this.loadRecipients();
    }

    private async loadRecipients() {
        try {
            this.recipients = await this.service.getRecipients();
        } catch (err) {
            jQuery.growl.error({ message: err });
        }
    }

    async onSubmit() {

        if (this.recipient.recipient.length <= 0) {
            jQuery.growl.error({ message: "Recipient should not be empty!" });
            return;
        }

        let response = await this.service.create(this.recipient);
        this.showNoticeByResponse(response);

        await this.loadRecipients();
    }

    async onRemove(_id: string) {
        let response = await this.service.remove(_id);
        this.showNoticeByResponse(response);
        await this.loadRecipients();
    }

    async onSync() {
        let response = await this.service.sync();
        this.showNoticeByResponse(response);
    }

    private showNoticeByResponse(response: Response) {
        if (response.ok)
            jQuery.growl.notice({ message: "Ok" });
        else
            jQuery.growl.error(response);
    }
}
