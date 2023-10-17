import {SseService} from "./data/sse.service";
import {Injectable} from "@angular/core";
import {environment} from "../../../environment";
import {Subject} from "rxjs";


@Injectable({providedIn: 'root'})
export class ResumeSseService extends SseService{

  protected messageSubject = new Subject<string>();
  public messages$ = this.messageSubject.asObservable();
  public override subscribe(endpoint: string): void {
    super.subscribe(`${environment.portfolioWSURL}${endpoint}`);
  }
  public onError(error: Event): void {
    console.error('EventSource failed:', error);
    super.unsubscribe()
  }

  public onMessage(event: MessageEvent<any>): void {
    this.messageSubject.next(event.data);
  }

  public override unsubscribe(){
    super.unsubscribe();
  }

}
