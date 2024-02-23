import { Injectable } from "@angular/core";
import { Http, Headers, ReadyState, Response } from "@angular/http";
import * as moment from "moment";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { Config } from "../../config";
import { RestService } from "../rest.service";

export class User {

    public _id: string
    public name: string
    public email: string
    public groups: Object
    public password: string
    public created_at: string
    public updated_at: string
    public authed_at: string

    constructor(json: Object) {

        this._id = json["_id"] || "";
        this.name = json["name"] || "";
        this.email = json["email"];
        this.groups = json["groups"];
        this.created_at = moment(json["created_at"]).format("YYYY-MM-DD HH:mm:ss");
        this.updated_at = moment(json["updated_at"]).format("YYYY-MM-DD HH:mm:ss");
        this.authed_at = moment(json["authed_at"]).format("YYYY-MM-DD HH:mm:ss");
    }
}

export class UserAuthed {

    static user: User;

    static CreateLogged(user: User) {
        this.user = user;
    }

    static DestroyLogged() {
        this.user = null;
    }
}

@Injectable()
export class UsersService extends RestService {

    private _groups = ["admin", "user"];

    constructor(http: Http) {
        super(http);
    }

    getGroups() {
        return this._groups;
    }

    public async getUsers(): Promise<{
        users?: User[],
        status: number,
        error?: any
    }> {

        try {
            let response = await this.get("/users", {});

            let result = response.json();
            let users = [];
            for (var i in result)
                users.push(new User(result[i]));

            return {
                status: response.status,
                users: users
            };

        } catch (error) {
            return {
                status: error.status,
                error: error
            };
        }
    }

    public async getUser(id) {

        let response = await this.get("/users/" + id);
        let data = response.json();
        let user = new User(data || {});
        return {
            response: response,
            user: user
        };

    }

    public async saveUser(user: User): Promise<{
        result?: Object,
        status: number,
        error?: any
    }> {

        try {
            let response = await this.put("/users/" + user._id, {}, user);
            return {
                result: response.json(),
                status: response.status
            };
        } catch (error) {
            return {
                error: error,
                status: error.status
            };
        }
    }

    public async createUser(user: User): Promise<{
        result?: Object,
        status: number,
        error?: any
    }> {

        try {
            let response = await this.post("/users", {}, user);
            return {
                result: response.json(),
                status: response.status
            };
        } catch (error) {
            return {
                error: error,
                status: error.status
            };
        }
    }

    public async deleteUser(user: User): Promise<{
        result?: Object,
        status: number,
        error?: any
    }> {
        if (user._id !== undefined && user._id !== '') {
            try {
                let response = await this.delete("/users/" + user._id, {});
                return {
                    result: response.json(),
                    status: response.status
                };
            } catch (error) {
                return {
                    error: error,
                    status: error.status
                };
            }
        }
    }

    public async auth(data: Object): Promise<Response> {
        let response = await this.post("/users/auth", {}, data);
        let json = response.json();
        if (json['sessid'])
            Cookie.set(Config.SESSKEY, json['sessid']);

        return response;
    }

    public async checkAuth(): Promise<Response> {

        let response = await this.post("/users/checkAuth");
        let user = new User(response.json());
        UserAuthed.CreateLogged(user);

        return response;

    }

    public async destroyAuth(): Promise<{
        status: number,
        result?: Object,
        error?: any
    }> {
        try {
            let response = await this.post("/users/destroyAuth");
            return {
                status: response.status,
                result: response.json()
            };
        } catch (error) {
            return {
                status: error.status,
                error: error
            };
        }
    }
}

