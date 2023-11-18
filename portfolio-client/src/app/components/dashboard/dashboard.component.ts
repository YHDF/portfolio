import {Component} from '@angular/core';
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";
import {LightingModeService} from "../../shared/services/lighting-mode.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  showGreeting : boolean = false;
  isDarkMode: boolean = false;

  constructor(private lightingModeService: LightingModeService,
              private readonly sharedDataProviderService : SharedDataProviderService) {

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
    this.sharedDataProviderService.showGreetingSubject$.subscribe({
      next: (v : boolean) =>  this.showGreeting = v
    });
  }
}
