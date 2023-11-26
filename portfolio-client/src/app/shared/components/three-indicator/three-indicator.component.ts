import {Component, Input} from '@angular/core';
import {SharedDataProviderService} from "../../services/shared-data-provider.service";

@Component({
  selector: 'app-three-indicator',
  templateUrl: './three-indicator.component.html',
  styleUrls: ['./three-indicator.component.scss']
})
export class ThreeIndicatorComponent {
  showIndicators : boolean = false;

  @Input()
  outputSource = "_DP_MAIN_"

  constructor(private readonly sharedDataProviderService : SharedDataProviderService) {
    this.sharedDataProviderService.showIndicatorsSubject$.subscribe({
      next: (v : boolean) =>  {
        this.showIndicators = v
      }
    });
  }

  @Input()
  bindScreen : () => void = () => {};

}
