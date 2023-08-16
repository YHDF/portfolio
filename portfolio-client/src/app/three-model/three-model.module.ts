import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeModelComponent } from './three-model.component';
import {ANIMATION_CONFIG_TOKEN} from "./animation-config.token";
import * as animationConfig from '../../assets/json/animation.json'
import {MeComponent} from "../me/me.component";

@NgModule({
  declarations: [
    ThreeModelComponent,
    MeComponent
  ],
  exports: [
    ThreeModelComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: ANIMATION_CONFIG_TOKEN,
      useValue: animationConfig
    }
  ],
})
export class ThreeModelModule { }
