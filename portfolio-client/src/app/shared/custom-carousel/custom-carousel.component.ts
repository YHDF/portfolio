import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-custom-carousel',
  templateUrl: './custom-carousel.component.html',
  styleUrls: ['./custom-carousel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CustomCarouselComponent implements AfterViewInit{
  public slides: any[] = new Array(3).fill({id: -1, src: '', title: '', subtitle: ''});


  ngAfterViewInit() {
  }
}
