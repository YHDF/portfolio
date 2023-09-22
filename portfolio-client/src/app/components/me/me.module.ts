import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MeComponent} from "./me.component";
import {SharedModule} from "../../shared/shared.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MeComponent,
  ],
  exports : [
    MeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BrowserAnimationsModule
  ]
})
export class MeModule { }
