import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';
import {Repository} from "../../../components/me/me";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectComponent implements AfterViewInit{
  @Input() repositories: Repository[] = [];
  public slides: any[] = new Array(3).fill({id: -1, src: '', title: '', subtitle: ''});

  constructor(private router: Router) { }
  ngAfterViewInit() {
  }

  navigateTo(repoLink: string) {
    window.location.href = repoLink;
  }
}
