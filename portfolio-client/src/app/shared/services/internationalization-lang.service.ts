import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class InternationalizationLangService {
  private defaultLang: string = 'US-en'; // default language
  private alternateLang: string = 'FR-fr'; // alternate language

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.defaultLang);
    this.setLanguage(this.defaultLang);
  }

  // Method to set a specific language
  setLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  // Method to get the current language
  getLanguage(): string {
    return this.translateService.currentLang;
  }

  // Method to toggle between languages
  toggleLanguage(): void {
    let currentLang = this.getLanguage();
    let newLang = currentLang === this.defaultLang ? this.alternateLang : this.defaultLang;
    this.setLanguage(newLang);
  }
}
