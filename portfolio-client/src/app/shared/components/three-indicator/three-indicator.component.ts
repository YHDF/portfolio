import {Component, Input} from '@angular/core';
import {SharedDataProviderService} from "../../services/shared-data-provider.service";
import {LightingModeService} from "../../services/lighting-mode.service";

@Component({
  selector: 'app-three-indicator',
  templateUrl: './three-indicator.component.html',
  styleUrls: ['./three-indicator.component.scss']
})
export class ThreeIndicatorComponent {
  showIndicators : boolean = false;
  isDarkMode: boolean = false;

  @Input()
  outputSource = "_DP_MAIN_"

  constructor(private lightingModeService: LightingModeService, private readonly sharedDataProviderService : SharedDataProviderService) {

    this.sharedDataProviderService.showIndicatorsSubject$.subscribe({
      next: (v : boolean) =>  {
        this.showIndicators = v
      }
    });

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }

  @Input()
  bindScreen : () => void = () => {};

}
