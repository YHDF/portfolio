import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  animations: [
    trigger('fillUp', [
      state('0', style({height: '50%'})),
      state('1', style({height: '100%'})),
      transition('* <=> *', [
        animate('.5s')
      ])
    ])
  ],
})
export class WorkComponent implements AfterViewInit{
  dynamicHeight: string = '';
  currentSection: number = 0;
  @ViewChild('timelineSlider', {static: false}) timelineSlider!: ElementRef;
  @ViewChild('progress', {static: false}) progressElement!: ElementRef;
  @ViewChild('containerElement') containerElement!: ElementRef;
  @ViewChildren('childElement') childElement!: QueryList<ElementRef>;
  @ViewChildren('timelineElement') timelineElement!: QueryList<ElementRef>;
  public fadeAnimationClasses: String[] = ['animate-fadeOutUp', 'animate-fadeInUp', 'animate-fadeOutDown', 'animate-fadeInDown']

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.timelineElement.get(this.currentSection)!.nativeElement.classList.remove('timeline-section-unclicked')
    this.timelineElement.get(this.currentSection)!.nativeElement.classList.add('timeline-section-clicked')
    this.containerElement.nativeElement.scrollTop = 0;
    this.dynamicHeight = this.currentSection.toString();
    this.cdRef.detectChanges();
  }
  scrollToSection(sectionIndex: number) {

    if(this.currentSection != sectionIndex){
      this.timelineElement.toArray().filter((value, index) => index != sectionIndex).map(value => {
        value.nativeElement.classList.remove('timeline-section-clicked')
        value.nativeElement.classList.add('timeline-section-unclicked')
      })
      this.timelineElement.get(sectionIndex)!.nativeElement.classList.remove('timeline-section-unclicked')
      this.timelineElement.get(sectionIndex)!.nativeElement.classList.add('timeline-section-clicked')
      this.childElement.toArray().forEach(value => {
        console.log(...this.fadeAnimationClasses)
        value.nativeElement.classList.remove(...this.fadeAnimationClasses);
        value.nativeElement.style.transition = "";
        value.nativeElement.style.opacity = 1;
      })

      if(sectionIndex > this.currentSection){
        if(sectionIndex===0){
          this.childElement.get(sectionIndex+1)!.nativeElement.classList.add('animate-fadeOutUp');
          this.childElement.get(sectionIndex)!.nativeElement.classList.add('animate-fadeInUp');
        }else{
          this.childElement.get(sectionIndex-1)!.nativeElement.classList.add('animate-fadeOutUp');
          this.childElement.get(sectionIndex)!.nativeElement.classList.add('animate-fadeInUp');
        }
      }else{
        if(sectionIndex===0){
          this.childElement.get(sectionIndex+1)!.nativeElement.classList.add('animate-fadeOutDown');
          this.childElement.get(sectionIndex)!.nativeElement.classList.add('animate-fadeInDown');
        }else{
          this.childElement.get(sectionIndex-1)!.nativeElement.classList.add('animate-fadeOutDown');
          this.childElement.get(sectionIndex)!.nativeElement.classList.add('animate-fadeInDown');
        }
      }



      this.currentSection = sectionIndex;
      this.dynamicHeight = sectionIndex.toString();
      this.cdRef.detectChanges();
    }
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
