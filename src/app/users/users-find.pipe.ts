import { Pipe, PipeTransform } from "@angular/core"
import { User } from "./users.service"

@Pipe({ name: "findUsers" })
export class UsersFindPipe implements PipeTransform {
    transform(value: User, condition) {
        try {
            let regex = new RegExp("^" + condition, "i");
            let finded = [];
            for (let i in value) {

                if (regex.test(value[i].name) ||
                    regex.test(value[i].login) ||
                    regex.test(value[i].email) )
                {
                    finded.push(value[i]);
                }
            }

            return finded;
        } catch (e) {
            console.log(e);
        }
    }
}