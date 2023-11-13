import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Work} from "../../../components/me/me";
import {LightingModeService} from "../../services/lighting-mode.service";
import {SharedDataProviderService} from "../../services/shared-data-provider.service";

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  animations: [
    trigger('fillUp', [
      state('0', style({height: '25%'})),
      state('1', style({height: '50%'})),
      state('2', style({height: '75%'})),
      state('3', style({height: '100%'})),
      transition('* <=> *', [
        animate('.5s')
      ])
    ])
  ],
})
export class WorkComponent implements OnInit {
  dynamicHeight: string = '';
  currentSection: number = 0;
  isDarkMode: boolean = false;

  experiences: Work[] = [];

  @ViewChild('timelineSlider', {static: false}) timelineSlider!: ElementRef;
  @ViewChild('progress', {static: false}) progressElement!: ElementRef;
  @ViewChild('containerElement') containerElement!: ElementRef;
  @ViewChildren('childElement') childElement!: QueryList<ElementRef>;
  @ViewChildren('timelineElement') timelineElement!: QueryList<ElementRef>;

  constructor(private cdRef: ChangeDetectorRef, private lightingModeService: LightingModeService,
              private readonly sharedDataProviderService: SharedDataProviderService) {

    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.isDarkMode = mode === 'dark';
    });
  }

  ngOnInit(): void {
    if(this.sharedDataProviderService.experiences.length === 0){
      this.sharedDataProviderService.fetchWorkAndProjects().then(() => {
        this.setExperiencesAndManageUi();
      });
    }else{
      this.setExperiencesAndManageUi();
    }
  }

  setExperiencesAndManageUi() {
    new Promise((resolve, reject) => {
      this.experiences = this.sharedDataProviderService.experiences;
      resolve(this.experiences)
    }).then(() => {
      setTimeout(() => {
        this.manageClassList(this.timelineElement.get(this.currentSection)!, ["timeline-section-clicked"], ["timeline-section-unclicked"], 0, 0);
        this.containerElement.nativeElement.scrollTop = 0;
        this.dynamicHeight = this.currentSection.toString();
        this.cdRef.detectChanges();
        this.childElement.toArray().map((value, index) => {
          if (index != this.currentSection) {
            this.manageClassList(value, ["invisible-experience"], ["experience"], 0, 0);
          }
        });
      } , 50)
    })
  }

  scrollToSection(sectionIndex: number) {
    if (this.currentSection != sectionIndex) {
      this.timelineElement.toArray().filter((value, index) => index != sectionIndex).map(value => {
        this.manageClassList(value, ["timeline-section-unclicked"], ["timeline-section-clicked"], 0, 0);
      });

      this.manageClassList(this.timelineElement.get(sectionIndex)!, ["timeline-section-clicked"], ["timeline-section-unclicked"], 0, 0);


      this.manageClassList(this.childElement.get(this.currentSection)!, ["animate-invisible-experience", "invisible-experience"], ["animate-visible-experience", "experience"], 200, 200);
      this.manageClassList(this.childElement.get(sectionIndex)!, ["animate-visible-experience", "experience"], ["animate-invisible-experience", "invisible-experience"], 200, 200);

      this.currentSection = sectionIndex;
      this.dynamicHeight = sectionIndex.toString();
      this.cdRef.detectChanges();
    }
  }

  manageClassList(eltRef: ElementRef, classesToAdd: String[], classesToRemove: String[], addTimeout: number, removeTimeout: number) {
    classesToAdd.map(value => setTimeout(() => eltRef.nativeElement.classList.add(value), addTimeout));
    classesToRemove.map(value => setTimeout(() => eltRef.nativeElement.classList.remove(value), removeTimeout));
  }

  onContainerScroll(event: any) {
    /*const container = event.target;
    const totalHeight = container.scrollHeight;
    const scrolledHeight = container.scrollTop;
    const visibleHeight = container.clientHeight;

    const scrollRatio = scrolledHeight / (totalHeight - visibleHeight);
    const progressBarHeight = this.timelineElement.nativeElement.clientHeight * scrollRatio;

    this.renderer.setStyle(this.progressElement.nativeElement, 'height', `${progressBarHeight}px`);*/
  }

  // Add wheel listener to the timeline-data-ctn to detect scroll direction
  @HostListener('mousewheel', ['$event']) onWheel(event: any) {
    if (event.deltaY > 0 && this.currentSection < 3) {
      this.scrollToSection(this.currentSection + 1);
    } else if (event.deltaY < 0 && this.currentSection > 0) {
      this.scrollToSection(this.currentSection - 1);
    }
  }
}
