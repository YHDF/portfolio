import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {Repository} from "../../../components/me/me";
import {Router} from "@angular/router";
import {LightingModeService} from "../../services/lighting-mode.service";
import {MeService} from "../../../components/me/me.service";
import {SharedDataProviderService} from "../../services/shared-data-provider.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectComponent implements AfterViewInit{
  isDarkMode: boolean = false;

  repositories: Repository[] = [];


  constructor(private router: Router, private lightingModeService: LightingModeService,
              private readonly meService: MeService, private readonly sharedDataProviderService : SharedDataProviderService) {
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }
  ngAfterViewInit() {
    if(this.sharedDataProviderService.repositories.length === 0){
      this.sharedDataProviderService.fetchWorkAndProjects().then(() => {
        this.repositories = this.sharedDataProviderService.repositories;
      });
    }else{
      this.repositories = this.sharedDataProviderService.repositories;
    }
  }

  navigateTo(repoLink: string) {
    window.location.href = repoLink;
  }
}
