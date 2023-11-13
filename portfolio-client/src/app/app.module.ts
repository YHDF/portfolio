import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardModule} from "./components/dashboard/dashboard.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContactComponent} from "./shared/components/contact/contact.component";
import {WorkComponent} from "./shared/components/work/work.component";
import {ProjectComponent} from "./shared/components/project/project.component";
import {HttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CustomHttpLoaderFactory} from "./factory/custom-http-loader.factory";
import {SharedModule} from "./shared/shared.module";
import {HeaderModule} from "./components/header/header.module";
import {MeComponent} from "./components/me/me.component";


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: AppComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'work',
    component: WorkComponent
  },
  {
    path: 'projects',
    component: ProjectComponent
  },
  {
    path: 'me',
    component: MeComponent
  }
];

// AoT requires an exported function for factories
export function customHttpLoaderFactory(http: HttpClient) {
  return new CustomHttpLoaderFactory(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      defaultLanguage: 'US-en',
      loader: {
        provide: TranslateLoader,
        useFactory: customHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    HeaderModule
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
