import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements AfterViewInit {
  constructor(private el: ElementRef) { }

  ngAfterViewInit() {

  }



}
