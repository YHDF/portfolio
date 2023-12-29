import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {LightingModeService} from "../../shared/services/lighting-mode.service";
import {
  AlertInfo,
  AlertOperationType,
  SharedDataProviderService
} from "../../shared/services/shared-data-provider.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDarkMode: boolean = false;

  showHeader : boolean = false;

  showAlert : boolean = false;

  alertMessage : string = SharedDataProviderService.EMPTY_NULL_MESSAGE;

  alertOperationType: AlertOperationType  = AlertOperationType.NA;

  contactInfos : any[] = [];
  constructor(private cdr: ChangeDetectorRef,private router: Router,
              private lightingModeService: LightingModeService, private readonly sharedDataProviderService : SharedDataProviderService) {

    this.sharedDataProviderService.showHeaderSubject$.subscribe({
      next: (v : boolean) =>  this.showHeader = v
    });

    this.sharedDataProviderService.AlertInfoSubject$.subscribe({
      next: (v : AlertInfo) =>  {
        this.showAlert = v.showAlert;
        this.alertMessage = v.alertMessage;
        this.alertOperationType = v.alertOperationType
      }
    });


    this.contactInfos = this.sharedDataProviderService.loadContactInfo()
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }


  clearScreenAnimationAndShowContact() {
      this.router.navigate(['/contact'])
  }

  clearScreenAnimationAndShowAbout() {
      this.router.navigate(['/about'])
  }

}
