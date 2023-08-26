import {Component, ViewEncapsulation, ElementRef, QueryList, ViewChildren, AfterViewInit} from '@angular/core';

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

  constructor(private el: ElementRef) { }



  ngAfterViewInit() {

  }

  clearScreenAnimation() {
    this.slideR();
    this.slideL();
    setTimeout(() => {
      this.showProjects = true;
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
