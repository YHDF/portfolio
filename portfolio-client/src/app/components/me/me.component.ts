import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {MeService} from "./me.service";
import {Repository, Work} from "./me";
import {NavigationEnd, Router} from '@angular/router';
import {lastValueFrom, Subscription} from "rxjs";
import {ResumeSseService} from "../../shared/services/resume-sse.service";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MeComponent implements AfterViewInit, OnDestroy {


  @ViewChildren('slideL') leftElement!: QueryList<ElementRef>;
  @ViewChildren('slideR') rightElement!: QueryList<ElementRef>;

  public showProjects: boolean = false;
  public showWork: boolean = false;
  public showContact: boolean = false;
  public showAbout: boolean = false;
  public repositories: Repository[] = [];
  public experiences: Work[] = [];
  message: any = undefined;
  private readonly messageSubscription: Subscription;


  constructor(private cdr: ChangeDetectorRef, private readonly meService: MeService, private readonly  resumeSseService: ResumeSseService,  private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.messageSubscription = this.resumeSseService.messages$.subscribe(
      message => {
        this.message = message;
        this.cdr.detectChanges(); // force change detection
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
    this.listenToEvents();
  }

  listenToEvents() {
    this.resumeSseService.subscribe("/resume/stream-see");
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

  clearScreenAnimationAndShowContact() {
    this.slideR();
    this.slideL();
    setTimeout(() => {
      this.showContact = true;
    }, 1000);
  }

  clearScreenAnimationAndShowAbout() {
    this.slideR();
    this.slideL();
    setTimeout(() => {
      this.showAbout = true;
    }, 1000);
  }

  downloadResume() {
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
      }),
      responseType: 'blob' as 'json'
    };
    this.meService.downloadResume(new Map(),httpOptions).pipe().subscribe({
      next : (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV-développeur-Java.pdf'; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error : (error) => {
        console.error('Error downloading resume:', error);
      }
    })
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

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.resumeSseService.unsubscribe();
  }
}
