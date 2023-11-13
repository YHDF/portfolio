import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export class CustomHttpLoaderFactory extends TranslateHttpLoader {
  constructor(private readonly httpClient : HttpClient) {
    super(httpClient, "/assets/i18n/json/", ".json");
  }
  public override getTranslation(lang: string): Observable<Object> {
    return super.getTranslation(lang)
  }
}
