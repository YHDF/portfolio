import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MeService} from "./me.service";
import {Repository, Work} from "./me";
import {NavigationEnd, Router} from '@angular/router';
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MeComponent implements AfterViewInit {


  @ViewChildren('slideL') leftElement!: QueryList<ElementRef>;
  @ViewChildren('slideR') rightElement!: QueryList<ElementRef>;

  public showProjects: boolean = false;
  public showWork: boolean = false;
  public repositories: Repository[] = [];
  public experiences: Work[] = [];


  constructor(private meService: MeService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit() {
    const repositories$ = this.meService.fetchGithubRepositories();
    const repositoriesPromise = lastValueFrom(repositories$);

    const experiences$ = this.meService.fetchWorkExperiences();
    const experiencesPromise = lastValueFrom(experiences$);
    Promise.all([repositoriesPromise, experiencesPromise]).then((values) => {
      this.repositories = values[0];
      this.experiences = values[1];
    });
  }

  clearScreenAnimationAndShowProjects() {
    this.slideR();
    this.slideL();
    setTimeout(() => {
      this.showProjects = true;
    }, 1000);
  }

  clearScreenAnimationAndShowWork() {
    this.slideR();
    this.slideL();
    setTimeout(() => {
      this.showWork = true;
    }, 1000);
  }

  slideR() {
    const delayDuration = 100; // e.g., 300ms delay
    this.rightElement.toArray().forEach((element, index) => {
      setTimeout(() => {
        element.nativeElement.classList.add('slideR-ref');
      }, index * delayDuration);
    });
  }

  slideL() {
    const delayDuration = 100; // e.g., 300ms delay
    this.leftElement.toArray().forEach((element, index) => {
      setTimeout(() => {
        element.nativeElement.classList.add('slideL-ref');
      }, index * delayDuration);
    });
  }




}
