import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DashboardModule} from "./dashboard/dashboard.module";
import {LightConfigService} from "./shared/light-config.service";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [LightConfigService],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
