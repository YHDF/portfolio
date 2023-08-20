import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MeComponent} from "./me.component";

@NgModule({
  declarations: [MeComponent],
  exports : [
    MeComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class MeModule { }
