import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public storage: StorageService ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.storage.getLoggedUser();
    if (user && user.token) {
      request = request.clone({
        setHeaders: {
          Authorization: user.token,
          'content-type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
