import {NgModule} from '@angular/core';
import {HeaderComponent} from "./header.component";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import {NgIf} from "@angular/common";


@NgModule({
  declarations: [
    HeaderComponent
  ],
    imports: [
        TranslateModule,
        SharedModule,
        NgIf
    ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
