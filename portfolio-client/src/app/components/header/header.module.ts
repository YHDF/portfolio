import {NgModule} from '@angular/core';
import {HeaderComponent} from "./header.component";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import {NgForOf, NgIf} from "@angular/common";


@NgModule({
  declarations: [
    HeaderComponent
  ],
    imports: [
        TranslateModule,
        SharedModule,
        NgIf,
        NgForOf
    ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
