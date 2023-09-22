import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThreeModelComponent} from './three-model.component';
import {ANIMATION_CONFIG_TOKEN} from "./animation-config.token";
import * as animationConfig from '../../../assets/json/animation.json'
import {MeModule} from "../me/me.module";

@NgModule({
  declarations: [
    ThreeModelComponent,
  ],
  exports: [
    ThreeModelComponent
  ],
  imports: [
    CommonModule,
    MeModule
  ],
  providers: [
    {
      provide: ANIMATION_CONFIG_TOKEN,
      useValue: animationConfig
    }
  ],
})
export class ThreeModelModule { }
