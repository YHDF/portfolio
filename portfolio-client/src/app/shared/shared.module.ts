import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsComponent} from './components/project/projects.component';
import {ButtonDirective, CarouselModule, SpinnerComponent} from "@coreui/angular";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from "@angular/platform-browser";
import {WorkComponent} from './components/work/work.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    WorkComponent
  ],
  exports: [
    ProjectsComponent,
    WorkComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    CarouselModule,
    BrowserModule,
    HttpClientModule,
    ButtonDirective,
    SpinnerComponent,
  ]
})
export class SharedModule { }
