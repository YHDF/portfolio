import {Component, Input} from '@angular/core';
import {ContactService} from "../contact/contact.service";
import {LightingModeService} from "../../services/lighting-mode.service";
import {InternationalizationLangService} from "../../services/internationalization-lang.service";
import {SharedDataProviderService} from "../../services/shared-data-provider.service";

@Component({
  selector: 'app-option-menu',
  templateUrl: './option-menu.component.html',
  styleUrls: ['./option-menu.component.scss']
})
export class OptionMenuComponent {
  @Input() actionType : string = "";
  @Input() isDarkMode : boolean = false;
  colorHex = "#7d7d7d";
  isEnglishVersion = true;

  constructor(private readonly contactService : ContactService, private lightingModeService: LightingModeService,
              private readonly internationalizationLangService : InternationalizationLangService,
              private sharedDataProviderService : SharedDataProviderService) {

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
      this.colorHex = this.isDarkMode ? "#FFC87C" : "#7d7d7d"
    });

  }

  toggle(){
    if(this.actionType === "_ACTION_LIGHT_MODE_") {
      this.switchLightMode();
    }else{
      this.switchLanguageSetting();
      this.sharedDataProviderService.languageChangeSubject$.next(!this.isEnglishVersion)
      this.isEnglishVersion = !this.isEnglishVersion
    }
  }

  switchLightMode(){
    this.lightingModeService.toggleMode();
  }

  switchLanguageSetting(){
    this.internationalizationLangService.toggleLanguage();
  }
}
