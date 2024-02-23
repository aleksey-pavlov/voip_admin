import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router";
import { UserAuthed, User, UsersService } from "../users.service";

declare var jQuery: any;

@Component({
    templateUrl: "./users-login.component.html",
    providers: [UsersService]
})
export class UsersLoginComponent implements OnInit {

    UserLogged: User;
    user: User;

    constructor(private service: UsersService, private router: Router) {
        this.user = new User({});
    }

    public async ngOnInit() {

        this.UserLogged = UserAuthed.user;

        if (this.UserLogged) {

            try {
                await this.service.destroyAuth();
                document.location.reload();
            } catch (err) {
                jQuery.growl.error({ message: err });
            }
        }

    }

    public async onAuth() {

        try {
            await this.service.auth(this.user);
            document.location.href = "/";
        } catch (err) {
            console.log("onAuth:" + err);
            jQuery.growl.error({ message: err });
        }

    }
}