import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LightConfigService} from "./shared/services/light-config.service";
import {DashboardModule} from "./dashboard/dashboard.module";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
