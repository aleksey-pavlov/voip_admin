import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { UsersService, User, UserAuthed } from "./users.service"
declare var jQuery: any;

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
    providers: [UsersService],
})
export class UsersComponent implements OnInit {

    users: User[];
    groups: string[];
    private _removedUser: User;
    findCondition: string;

    constructor(private _service: UsersService, private _router: Router) {

    }

    onDelete(user) {
        this._removedUser = user;
    }

    public async onDeleteConfirm() {
        let result = await this._service.deleteUser(this._removedUser);

        if (result.status == 200) {
            this.loadUsers();
        } else {
            jQuery.growl.error({ message: result.error });
        }

        return true;
    }

    onEdit(user: User) {
        this._router.navigate(["/users/edit", user._id]);
    }

    async ngOnInit() {
        try {
            await this.loadUsers();
        } catch (err) {
            jQuery.growl.error({ message: err });
        } finally {
            this.groups = this._service.getGroups();
        }
    }

    private async loadUsers() {
        let result = await this._service.getUsers();
        this.users = result.users
    }

}
