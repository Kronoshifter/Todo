import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { SessionService } from './session.service'
import { catchError, Observable, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NetworkAPIService {

  constructor(
    private http: HttpClient,
    private session: SessionService,
  ) {
  }

  private handleError(error: HttpErrorResponse) {
    if (!error.ok) {
      const message = `Error ${error.status}: ${error.error}`
      throw new Error(message)
    }
  }

  login(username: string, password: string): Observable<HttpResponse<string>> {
    return this.http.get('/api/login', {
      responseType: 'text',
      observe: 'response',
    }).pipe(
      catchError((err, it) => {
        this.handleError(err)
        return it
      }),
      tap((res) => {
        this.session.userId = '123abc'
        this.session.session = res.headers.get('x-session-id')
      }),
    )
  }

  logout(): Observable<HttpResponse<string>> {
    return this.http.get('/api/logout', {
      headers: this.session.authHeaders(),
      responseType: 'text',
      observe: 'response',
    }).pipe(
      catchError((err, it) => {
        this.handleError(err)
        return it
      }),
      tap((res) => {
        this.session.userId = null
        this.session.session = null
      }),
    )
  }
}
