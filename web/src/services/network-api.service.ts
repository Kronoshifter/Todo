import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { SessionService } from './session.service'
import { catchError, firstValueFrom, Observable } from 'rxjs'

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
    const req = this.http.get('/api/login', {
      responseType: 'text',
      observe: 'response',
    }).pipe(
      catchError((err, it) => {
        this.handleError(err)
        return it
      })
    )

    req.subscribe({
        next: (res) => {
          this.session.userId = '123abc'
          this.session.session = res.headers.get('x-session-id')
        },
        error: (err) => {
          this.handleError(err)
        }
      }
    )

    return req
  }
}
