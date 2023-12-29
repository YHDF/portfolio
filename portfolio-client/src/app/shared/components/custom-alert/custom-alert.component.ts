import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ResumeSseService} from "../../services/resume-sse.service";
import {AlertOperationType} from "../../services/shared-data-provider.service";
import {LightingModeService} from "../../services/lighting-mode.service";

@Component({
  selector: 'app-custom-alert',
  template: `
    <ng-container *ngIf="message">
      <div class="alert-ctn light-text-color">
        <ng-container *ngIf="alertOperationType === AlertOperationType.ASYNC">
          <c-spinner size="sm" class="spinner"></c-spinner>
        </ng-container>
        <ng-container *ngIf="alertOperationType === AlertOperationType.SYNC">
          <svg height="14px" width="14px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17.837 17.837" xml:space="preserve" [attr.fill]="colorHex"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path [ngStyle]="{'fill': colorHex}" d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"></path> </g> </g></svg>        </ng-container>
        <span class="message">{{ message }}</span>
      </div>
    </ng-container>`,
  styles: [
    `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap');`,
    `.alert-ctn {
      position: absolute;
      bottom: 5px !important;
      right: 10px;
      width: auto;
      height: 6vh;
      display: flex;
      font-family: sans-serif;
      font-size: 0.7rem;
      font-weight: 900;
      padding: 0;
      background: rgba(0, 0, 0, 0);
      border: none;
      z-index: 100;
    }`, `.message {
      font-size: 0.7rem;
      font-weight: 500;
      vertical-align: bottom;
    }`,
    `.spinner, .message {
      white-space: nowrap;
    }`,
    `span::before {
      content: "\";
      margin-left: 10px;
    }`
  ]
})
export class CustomAlertComponent implements OnInit, OnDestroy {
  readonly haltCode = "NOP!"
  readonly SIMPLE = "_SIMPLE_";
  readonly SUBSCRIPTION = "_SUBSCRIPTION_";
  @Input() messageType: string = this.SIMPLE;
  @Input() simpleMessageValue: string = "";
  @Input() alertOperationType: AlertOperationType  = AlertOperationType.NA;

  message: any = undefined;
  private messageSubscription: Subscription;
  colorHex = "#7d7d7d";
  protected readonly AlertOperationType = AlertOperationType;

  constructor(private cdr: ChangeDetectorRef, private readonly resumeSseService: ResumeSseService, private lightingModeService: LightingModeService) {
    this.messageSubscription = new Subscription();

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.colorHex = mode === 'dark' ? "#FFC87C" : "#7d7d7d"
    });
  }



  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    if(this.messageType === this.SUBSCRIPTION){
      this.messageSubscription = this.resumeSseService.messages$.subscribe(message => {
        if (message === this.haltCode) {
          this.message = undefined;
          this.cdr.detectChanges();
        } else {
          this.message = message;
          this.cdr.detectChanges();
        }
      });
    }
    else {
      this.message = this.simpleMessageValue;
      this.cdr.detectChanges();
    }
  }
}
