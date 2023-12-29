import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";
import {LightingModeService} from "../../shared/services/lighting-mode.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  showGreeting : boolean = false;
  isDarkMode: boolean = false;
  showMe : boolean = false;
  constructor(private lightingModeService: LightingModeService,
              private readonly sharedDataProviderService : SharedDataProviderService, private cdr : ChangeDetectorRef) {

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
    this.sharedDataProviderService.showGreetingSubject$.subscribe({
      next: (v : boolean) =>  this.showGreeting = v
    });
    this.sharedDataProviderService.showMeSubject$.subscribe({
      next: (v : boolean) => {
        this.showMe = this.sharedDataProviderService.showMe = v
        this.cdr.detectChanges()
      }
    });
  }

  ngOnInit() {
    this.showMe = this.sharedDataProviderService.showMe;
  }

}
