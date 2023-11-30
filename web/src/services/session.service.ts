import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _session: string | null = null;
  private _userId: string | null = null;

  constructor(private router: Router) {
    this._session = sessionStorage['sessionid'];
  }

  get session(): string | null {
    return this._session;
  }

  set session(session: string | null) {
    this._session = session;

    if (session) {
      sessionStorage['sessionid'] = session;
    } else {
      delete sessionStorage['sessionid'];
    }
  }

  get userId(): string | null {
    return this._userId;
  }

  set userId(userId: string | null) {
    this._userId = userId;
    if (userId) {
      sessionStorage['userid'] = userId;
    } else {
      delete sessionStorage['userid'];
    }
  }

  get isAuthenticated(): boolean {
    return !!this.session
  }

  authHeaders(): HttpHeaders {
    return new HttpHeaders({
        'x-session-id': this.session
      })
  }

  authHeadersMap(): Record<string, string> {
    return {
      'x-session-id': this.session,
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.authenticate();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.authenticate();
  }

  private async authenticate(): Promise<boolean | UrlTree> {
    const auth = this.isAuthenticated
    if (!auth) {
      return this.router.createUrlTree(['/login'])
    }

    return true
  }
}
