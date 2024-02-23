import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthed, User, UsersService } from "./users/users.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [UsersService]
})
export class AppComponent implements OnInit {

    userLogged: User;

    constructor(private _router: Router, private _userService: UsersService) {

    }

    public async ngOnInit() {

        try {
            await this._userService.checkAuth();
            this.userLogged = UserAuthed.user;

            if (this.userLogged === undefined) {
                this._router.navigate(["/users/login"]);
            }
        } catch (err) {
            this._router.navigate(["/users/login"]);
        }
    }
}
