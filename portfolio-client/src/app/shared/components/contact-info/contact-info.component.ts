import {Component, Input, OnInit} from '@angular/core';
import {ContactService} from "../contact/contact.service";
import {LightingModeService} from "../../services/lighting-mode.service";
import {AlertOperationType, SharedDataProviderService} from "../../services/shared-data-provider.service";
import {delay, mapTo, of, timer} from "rxjs";

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  ACTION_PHONE = '_ACTION_PHONE_';
  ACTION_EMAIL = '_ACTION_EMAIL_';
  ACTION_GITHUB = '_ACTION_GITHUB_';
  ACTION_LINKEDIN = '_ACTION_LINKEDIN_';
  @Input() actionType: string = "";
  @Input() actionValue: string = "";
  @Input() actionMessage: any = undefined;
  @Input() contactType: string = "";
  @Input() contactValue: string = "";
  @Input() isDarkMode: boolean = false;
  colorHex = "#7d7d7d";
  alertOperationType: AlertOperationType  = AlertOperationType.NA;

  constructor(private readonly contactService: ContactService, private lightingModeService: LightingModeService,
              private readonly sharedDataProviderService : SharedDataProviderService) {
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
      this.colorHex = this.isDarkMode ? "#FFC87C" : "#7d7d7d"
    });
  }

  ngOnInit(): void {
  }

  executeContactAction(actionValue? : string) {
    switch (this.actionType){
      case this.ACTION_PHONE:
        this.alertOperationType = AlertOperationType.SYNC
        navigator.clipboard.writeText(actionValue!)//.then(r => );
        break;
      case this.ACTION_EMAIL :
        this.alertOperationType = AlertOperationType.SYNC
        navigator.clipboard.writeText(actionValue!)//.then(r => );
        break;
      case this.ACTION_GITHUB :
      case this.ACTION_LINKEDIN:
        this.alertOperationType = AlertOperationType.ASYNC
        timer(1000).subscribe( v => window.open(actionValue!, "_blank"));
        break;
      default:
        break;
    }
    this.sharedDataProviderService.AlertInfoSubject$.next({
      showAlert : true,
      alertMessage : this.actionMessage,
      alertOperationType : this.alertOperationType
    })

    const alertStatusUpdate =  of(null).pipe(mapTo(null), delay(2000));
    alertStatusUpdate.subscribe(value => this.sharedDataProviderService.AlertInfoSubject$.next({
      showAlert : false,
      alertMessage : SharedDataProviderService.EMPTY_NULL_MESSAGE,
      alertOperationType : AlertOperationType.NA
    }))
  }
}
