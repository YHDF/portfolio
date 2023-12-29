import {Component} from '@angular/core';
import {LightingModeService} from "./shared/services/lighting-mode.service";
import {ResumeSseService} from "./shared/services/resume-sse.service";
import {SharedDataProviderService} from "./shared/services/shared-data-provider.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio-client';
  isDarkMode: boolean = false;
  showDashBoard: boolean = false;

  constructor(private lightingModeService: LightingModeService,
              private readonly resumeSseService: ResumeSseService,
              private sharedDataProviderService: SharedDataProviderService) {
    this.sharedDataProviderService.isThreeModelHidden = this.sharedDataProviderService.showMe = this.shouldHideThreeModel();

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
    this.listenToEvents();
    this.sharedDataProviderService.prepareThreeModelBuilder().then(() => this.showDashBoard = true)
  }

  listenToEvents() {
    this.resumeSseService.subscribe("/resume/stream-sse");
  }

  shouldHideThreeModel = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);


}
