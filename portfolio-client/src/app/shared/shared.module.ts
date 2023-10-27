import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './components/project/project.component';
import {ButtonDirective, CarouselModule, SpinnerComponent} from "@coreui/angular";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from "@angular/platform-browser";
import {WorkComponent} from './components/work/work.component';
import {CustomAlertComponent} from './components/custom-alert/custom-alert.component';
import {ContactComponent} from './components/contact/contact.component';

@NgModule({
  declarations: [
    ProjectComponent,
    WorkComponent,
    CustomAlertComponent,
    ContactComponent
  ],
    exports: [
        ProjectComponent,
        WorkComponent,
        CustomAlertComponent,
        ContactComponent
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
