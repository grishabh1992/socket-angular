import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { StorageService } from './storage.service';
@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let ok: string;
    // extend server response observable with logging
    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        // Operation failed; error is an HttpErrorResponse
        error => {
          if (error && error.error && error.error.message) {
            if (error.status === 401) {
              this.storage.clearAll();
            }
          }
          ok = 'failed';
        }
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in`;
        console.log(msg);
      })
    );
  }
}
