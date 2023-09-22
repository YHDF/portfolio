import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MeService} from "./me.service";
import {Repository} from "./me";
import {NavigationEnd, Router} from '@angular/router';

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


  constructor(private meService: MeService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit() {
    this.meService.fetchGithubRepositories().subscribe(
      responseData => responseData.map(value => this.repositories.push(value))
    );
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
