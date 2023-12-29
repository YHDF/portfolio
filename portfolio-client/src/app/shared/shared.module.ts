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
import {LightingModeDirective} from './directives/lighting-mode.directive';
import {ContactInfoComponent} from './components/contact-info/contact-info.component';
import {OptionMenuComponent} from './components/option-menu/option-menu.component';
import {TranslateModule} from "@ngx-translate/core";
import {ThreeIndicatorComponent} from './components/three-indicator/three-indicator.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ErrorMessageDirective} from './directives/error-message.directive';
import {IconDirective} from "@coreui/icons-angular";

@NgModule({
  declarations: [
    ProjectComponent,
    WorkComponent,
    CustomAlertComponent,
    ContactComponent,
    LightingModeDirective,
    ContactInfoComponent,
    OptionMenuComponent,
    ThreeIndicatorComponent,
    ErrorMessageDirective,
  ],
    exports: [
        ProjectComponent,
        WorkComponent,
        CustomAlertComponent,
        ContactComponent,
        LightingModeDirective,
        ErrorMessageDirective,
        ContactInfoComponent,
        OptionMenuComponent,
        ThreeIndicatorComponent
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
        TranslateModule,
        ReactiveFormsModule,
        IconDirective,
    ]
})
export class SharedModule {
}
