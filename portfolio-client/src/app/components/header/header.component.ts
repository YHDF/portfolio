import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {LightingModeService} from "../../shared/services/lighting-mode.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDarkMode: boolean = false;

  showHeader : boolean = false;


  constructor(private cdr: ChangeDetectorRef,private router: Router,
              private lightingModeService: LightingModeService,) {
    setTimeout(() => this.showHeader = !this.showHeader, 3000);


    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }

  clearScreenAnimationAndShowContact() {
    setTimeout(() => {
      this.router.navigate(['/contact'])
      //this.showContact = true;
    }, 1000);
  }

  clearScreenAnimationAndShowAbout() {
    setTimeout(() => {
      this.router.navigate(['/about'])
      //this.showAbout = true;
    }, 1000);
  }
}
