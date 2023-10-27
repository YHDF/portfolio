import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from "../../../../environment";

export abstract class AbstractHttpDataService {

  protected constructor(protected http: HttpClient) {}

  protected get<T>(url: string, params? : Map<string, string>, options?: Object): Observable<T> {
    if(params){
      url += `?${this.buildParamsStringFromMap(params)}`;
    }
    return this.http.get<T>(`${environment.portfolioWSURL}${url}`, options).pipe(catchError(this.handleError));
  }

  protected post<T>(url: string, params? : Map<string, string>, body?: any, options?: Object): Observable<T> {
    if(params){
      url += `?${this.buildParamsStringFromMap(params)}`;
    }
    return this.http.post<T>(`${environment.portfolioWSURL}${url}`, body, options).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(error);
  }

  private buildParamsStringFromMap(paramsMap: Map<string, string> ) : string {
    let paramString = "";
    paramsMap.forEach((value, key) => {
      paramString += `${key}=${value}`
    })
    return paramString;
  }
}
