import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {LightingModeService} from "../../shared/services/lighting-mode.service";
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDarkMode: boolean = false;

  showHeader : boolean = false;
  constructor(private cdr: ChangeDetectorRef,private router: Router,
              private lightingModeService: LightingModeService, private readonly sharedDataProviderService : SharedDataProviderService) {

    this.sharedDataProviderService.showHeaderSubject$.subscribe({
      next: (v : boolean) =>  this.showHeader = v
    });


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
