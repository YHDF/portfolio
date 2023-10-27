import {Injectable} from "@angular/core";
import {ContactDataService} from "../../services/data/contact.data.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactService{

  constructor(private readonly contactDataService : ContactDataService) {}
  sendFormEmail(params? : Map<string, string>, body?: any, options?: Object) : Observable<any>{
    return this.contactDataService.sendFormEmail(params, body, options);
  }
}
