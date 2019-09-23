import { SharedService } from './shared.service';
import { Observable } from 'rxjs';;

export interface currentUserObject {
    userId: Number;
    userName: string;
    userEmail: string;
    userLogin: string;
    isSiteAdmin: Boolean;
}

export class ShareFunction {
    currentUser: currentUserObject;

    constructor(private shareService: SharedService) {

    }
    getUserCurrent() {
        this.shareService.getCurrentUser().subscribe(
            itemValue => {
                this.currentUser = {
                    userId: itemValue["Id"],
                    userName: itemValue["Title"],
                    userEmail: itemValue["Email"],
                    userLogin: itemValue["LoginName"],
                    isSiteAdmin: itemValue["IsSiteAdmin"]
                }

            },
            error => console.log("error: " + error),
            () => {
                console.log(this.currentUser);
            }
        );
    }
}