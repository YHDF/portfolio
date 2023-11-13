import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {ThreeModelModule} from "../three-model/three-model.module";
import {HeaderModule} from "../header/header.module";


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ThreeModelModule,
    RouterModule.forChild(routes),
    HeaderModule
  ]
})
export class DashboardModule {
}
