import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiBaseUrl}/auth`;
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<any | null>(null)
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {
    this.checkToken();
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }
  login(data: any) {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        if (res.success) {
          console.log('res', res);
          localStorage.setItem('access_token', res.data.accessToken);
          localStorage.setItem('User', JSON.stringify(res.data.user));
          this.isLoggedIn$.next(true);
          this.user$.next(JSON.stringify(res.data.user));
        }
        else {
          this.isLoggedIn$.next(false);
          this.user$.next(null);
        }
      })
    );
  }

  refreshToken() {
    return this.http.post(`${this.api}/refresh`, {}).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.accessToken);
      }),
      catchError((error) => {
        localStorage.clear()
        this.isLoggedIn$.next(false)
        this.user$.next(null)
        this.router.navigate(['/login'])
        return throwError(() => error)
      })
    );
  }


  checkToken() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('User')
    if (token && user) {
      this.isLoggedIn$.next(!!token);
      this.user$.next(user);
    }
    else {
      this.isLoggedIn$.next(false);
      this.user$.next(null);
    }
  }


  logout() {
    localStorage.clear();
    this.isLoggedIn$.next(false);
    this.user$.next(null);
    return this.http.post(`${this.api}/logout`, {})
  }

  get getUser() {
    const user = localStorage.getItem('User');
    return user ? JSON.parse(user) : null;
  }
  getAdminReq() {
    return this.http.get<any>(`${this.api}/adminRequists`, {})
  }
  approveAdminReq(id: any) {
    return this.http.put<any>(`${this.api}/approveAdmin/${id}`, {})
  }
  rejectAdminReq(id: any) {
    return this.http.put<any>(`${this.api}/rejectAdmin/${id}`, {})
  }

}
