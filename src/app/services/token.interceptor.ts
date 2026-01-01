    import { HttpInterceptorFn } from '@angular/common/http';
    import { inject } from '@angular/core';
    import { AuthService } from './auth.service';
    import { catchError, switchMap, throwError } from 'rxjs';


    export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = localStorage.getItem('access_token');


    let modifiedReq = req;
    console.log('intercept',token);
    if (token) {
    modifiedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
    withCredentials:true
    });
    }
    else{
        modifiedReq=req.clone({
            withCredentials:true
        })
    }


    return next(modifiedReq).pipe(
    catchError((error) => {
    if (error.status === 401) {
    return auth.refreshToken().pipe(
    switchMap(() => {
    const newToken = localStorage.getItem('access_token');
    const retryReq = req.clone({
    setHeaders: { Authorization: `Bearer ${newToken}` },
    withCredentials:true
    });
    return next(retryReq);
    })
    );
    }
    return throwError(() => error);
    })
    );
    };