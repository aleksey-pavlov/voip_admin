import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UsersService, UserAuthed, User } from '../users.service'

declare var jQuery: any;

@Component({
    templateUrl: "./users-edit.component.html",
    providers: [UsersService]
})

export class UsersEditComponent implements OnInit {
    user: User;
    confirm_password: string;
    groups: string[];

    constructor(private service: UsersService, private route: ActivatedRoute, private _router: Router) {

    }

    ngOnInit() {
        
        this.route.params.subscribe(async (params) => { 
            
            let result = await this.service.getUser(params['id']);
            this.user = result.user;
            console.log(this.user);
        });
        

        this.groups = this.service.getGroups();

    }

    onSelectGroups(event) {
        this.user.groups = {};
        
        let options = event.target.options;
    
        for (let i in options) {
            if (options[i] && options[i].selected === true)
                this.user.groups[options[i].value] = 1;
        }
    }

    public async onSubmit() {

        if ( this.confirm_password!=='' &&  this.confirm_password !== this.user.password ) {
            jQuery.growl.error({ "message": "Pasword is not equals" });
            return;
        }
        let result = {};
        if ( this.user._id !== undefined && this.user._id !==''  ) {
            result = await this.service.saveUser( this.user );
        }
        else {
            result = await this.service.createUser(this.user );
            let id = result['result']['insertedIds'][0];
            this._router.navigate(["/users/edit", id]);
        }

        if (result["status"] == 200)
           jQuery.growl.notice({ "message": "Ok" });
        else
           jQuery.growl.error({ "message": result });
    }
}

