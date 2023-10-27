import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {ResumeSseService} from "../../services/resume-sse.service";

@Component({
  selector: 'app-custom-alert',
  template: `
    <ng-container *ngIf="message">
      <div class="alert-ctn">
        <c-spinner size="sm" class="spinner"></c-spinner>
        <span class="message">{{ message }}</span>
      </div>
    </ng-container>`,
  styles: [
    `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap');`,
    `.alert-ctn {
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: auto;
      height: 6vh;
      display: flex;
      font-family: sans-serif;
      font-size: 15px;
      font-weight: 900;
      padding: 0;
      background: rgba(0, 0, 0, 0);
      border: none
    }`, `.message {
      font-size: 12px;
      font-weight: 500;
      vertical-align: bottom;
    }`,
    `.spinner, .message {
      background: radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 50%, rgb(252, 251, 121) 90%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      line-break: auto;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      white-space: nowrap;
    }`,
    `span::before {
      content: "\";
      margin-left: 10px;
    }`
  ]
})
export class CustomAlertComponent implements AfterViewInit, OnDestroy {
  message: any = undefined;
  readonly haltCode = "NOP!"
  protected readonly undefined = undefined;
  private messageSubscription: Subscription;

  constructor(private cdr: ChangeDetectorRef, private readonly resumeSseService: ResumeSseService) {
    this.messageSubscription = new Subscription();
  }

  ngAfterViewInit(): void {
    this.messageSubscription = this.resumeSseService.messages$.subscribe(message => {
      if (message === this.haltCode) {
        this.message = undefined;
        this.cdr.detectChanges();
      } else {
        this.message = message;
        this.cdr.detectChanges();
      }
    });
    this.listenToEvents();

  }

  listenToEvents() {
    this.resumeSseService.subscribe("/resume/stream-see");
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.resumeSseService.unsubscribe();
  }
}
