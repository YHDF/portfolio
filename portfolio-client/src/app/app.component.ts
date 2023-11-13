import {Component} from '@angular/core';
import {LightingModeService} from "./shared/services/lighting-mode.service";
import {InternationalizationLangService} from "./shared/services/internationalization-lang.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio-client';
  isDarkMode: boolean = false;

  constructor(private lightingModeService: LightingModeService, private internationalizationLangService : InternationalizationLangService) {

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }
}
