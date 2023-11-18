import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {MeService} from "./me.service";
import {NavigationEnd, Router} from '@angular/router';
import {ResumeSseService} from "../../shared/services/resume-sse.service";
import {HttpHeaders} from "@angular/common/http";
import {LightingModeService} from "../../shared/services/lighting-mode.service";
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MeComponent implements AfterViewInit, OnDestroy {


  @ViewChildren('slideL') leftElement!: QueryList<ElementRef>;
  @ViewChildren('slideR') rightElement!: QueryList<ElementRef>;

  public isDarkMode: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private readonly meService: MeService,
              private readonly  resumeSseService: ResumeSseService,  private router: Router,
              private lightingModeService: LightingModeService,
              private readonly sharedDataProviderService : SharedDataProviderService) {
    this.sharedDataProviderService.showHeaderSubject$.next(true)

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });

  }

  @Input()
  toggleShowMe : (value : boolean) => void = (value) => {};

  ngAfterViewInit() {
    this.sharedDataProviderService.fetchWorkAndProjects();
  }

  clearScreenAnimationAndShowProjects() {
    setTimeout(() => this.router.navigate(['/projects']), 500)
    this.slideR();
    this.slideL();

  }

  clearScreenAnimationAndShowWork() {
    setTimeout(() => this.router.navigate(['/work']), 500)
    this.slideR();
    this.slideL();
  }

  downloadResume(version : string) {
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
      }),
      responseType: 'blob' as 'json'
    };
    const resumeParamsMap = new Map();
    resumeParamsMap.set('version', version);
    this.meService.downloadResume(resumeParamsMap,httpOptions).pipe().subscribe({
      next : (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = version === 'fr' ? 'CV-développeur-fullstack.pdf' : 'Fullstack-developer-resume.pdf';
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
  }

  quit(){
    this.sharedDataProviderService.showMe = false;
    this.toggleShowMe(this.sharedDataProviderService.showMe);
  }
}
