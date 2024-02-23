import { Component, OnInit } from '@angular/core';
import { StatisticService, Query } from "./statistic.service";
import { UserAuthed } from "../users/users.service";
import * as moment from "moment";
declare var jQuery: any;

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.css'],
    providers: [StatisticService]
})
export class StatisticComponent implements OnInit {

    public fromDate: string;
    public toDate: string;
    public query: Query = {
        from: Math.floor(Date.now()/1000),
        to: Math.floor(Date.now()/1000),
        email: UserAuthed.user.email
    };

    constructor(private service: StatisticService) { }

    async ngOnInit() {
        this.fromDate = moment((this.query.from-86400)*1000).format("YYYY-MM-DD HH:00:00");
        this.toDate = moment(this.query.to*1000).format("YYYY-MM-DD HH:00:00");
    }

    async onUpload() {

        let response = await this.service.upload(this.query);

        if (response.ok) {
            jQuery.growl.notice({ message: JSON.stringify(response.json()) });
        } else {
            jQuery.growl.error(response);
        }
    }

    setFromDate(event) {
        this.fromDate = event;
        let time = Math.floor(new Date(this.fromDate).getTime() / 1000);
        this.query.from = time;
    }

    setToDate(event) {
        this.toDate = event;
        let time = Math.floor(new Date(this.toDate).getTime() / 1000);
        this.query.to = time;
    }
}
