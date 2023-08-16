import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenUtils } from '../utils/token.utils';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      // decode JWT payload part.
      const payload = TokenUtils.parseJwt(token);

      // Check token exp.
      if (!payload || Date.now() >= payload.exp * 1000) {
        // Token expire remove it in sessionStorage
        sessionStorage.removeItem('access_token');
      } else {
        // If we have a token, we set it to the header
        request = this.addToken(request, token);
      }
    }

    request = this.addContentType(request, 'application/json');

    return next.handle(request).pipe(
      catchError((error) => {
        let message = '';
        if (error.status === 500) {
          if (error.error.message.code === 'ER021') {
            message = 'ソートは (ASC, DESC) でなければなりません。';
            this.router.navigate(['/systemerror'], {
              state: { message: message },
            });
          }
          if (error.error.message.code === 'ER018') {
            let param = error.error.message.params?.[0];
            message = param + ' phải là số halfsize.';
            this.router.navigate(['/systemerror'], {
              state: { message: message },
            });
          }
          //Xử lý lỗi ở màn add khi người dùng nhập employeeloginid trùng với employeeLoginId trong DB
          if (error.error.message.code === 'ER003') {
            let param = error.error.message.params?.[0];
            message = param + ' đã tồn tại.';
            this.router.navigate(['/user/add'], {
              state: { message: message },
            });
          }
          //Xử lý lỗi không không kết nối được DB
          if (error.error.message.code === 'ER023') {
            message = 'システムエラーが発生しました。';
            this.router.navigate(['/systemerror'], {
              state: { message: message },
            });
          }
        }

        return throwError(error.error);
      })
    );
  }

  private addContentType(request: HttpRequest<any>, contentType: string) {
    return request.clone({
      setHeaders: {
        'Content-Type': contentType,
      },
    });
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const TokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptorService,
  multi: true,
};
