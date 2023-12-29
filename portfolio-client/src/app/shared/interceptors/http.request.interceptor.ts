import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    console.info(`Intercepted ${req.method} request to ${req.url}`);

    // Set withCredentials property
    let clonedReq = req.clone({
      withCredentials: false
    });

    //use case : Post request for sending Emails - response type is text/html
    if(req.url.endsWith("send") && req.responseType.includes("json")) {
      console.warn('Server responded with text/html. Handling it accordingly.');
      clonedReq = clonedReq.clone({
        responseType: "text"
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP error occurred:', error);
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, body was:`, error.error);
        }
        return throwError(error);
      })
    );
  }
}
