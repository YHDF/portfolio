import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeModelComponent } from './three-model.component';



@NgModule({
  declarations: [
    ThreeModelComponent
  ],
  exports: [
    ThreeModelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ThreeModelModule { }
