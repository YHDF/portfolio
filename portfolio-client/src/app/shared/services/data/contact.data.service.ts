import {Injectable} from "@angular/core";
import {AbstractHttpDataService} from "./abstract-http.data.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactDataService extends AbstractHttpDataService{

  constructor(protected override http: HttpClient) {
    super(http);
  }

  sendFormEmail(params? : Map<string, string>, body?: any, options?: Object): Observable<any>{
    return this.post(`/contact/send`, params, body, options);
  }
}
