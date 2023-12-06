import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { SessionService } from './session.service'
import { catchError, debounceTime, Observable, tap } from 'rxjs'
import { TodoTask } from '../model/todo-task'

@Injectable({
  providedIn: 'root',
})
export class NetworkAPIService {

  constructor(
    private http: HttpClient,
    private session: SessionService,
  ) {
  }

  handleError(error: any) {
    if (!error.ok) {
      console.log('Error', {...error})
    }
  }

  login(): Observable<HttpResponse<string>> {
    return this.http.get('/api/login', {
      responseType: 'text',
      observe: 'response',
    }).pipe(
      catchError((err, it) => {
        console.error("Error in login")
        this.handleError(err)
        return it
      }),
      tap((res) => {
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
        console.error("Error in logout")
        this.handleError(err)
        return it
      }),
      tap((res) => {
        this.session.session = null
      }),
    )
  }

  fetchTasks(): Observable<TodoTask[]> {
    return this.http.get<TodoTask[]>('/api/task', {
      headers: {
        'Accept': 'application/json',
        ...this.session.authHeadersMap()
      },
    }).pipe(
      catchError((err, it) => {
        console.error("Error in fetchTasks")
        this.handleError(err)
        if (err.status === 401) {
          this.session.logout()
        }
        return it
      }),
      debounceTime(1000),
    )
  }

  createTask(task: TodoTask) {
    return this.http.post<TodoTask>('/api/task', task, {
      headers: {
        'Content-Type': 'application/json',
        ...this.session.authHeadersMap()
      },
    })
  }

  updateTask(task: TodoTask) {
    return this.http.put<TodoTask>(`/api/task/${task.id}`, task, {
      headers: {
        ...this.session.authHeadersMap()
      },
    })
  }

  deleteTask(task: TodoTask) {
    return this.http.delete(`/api/task/${task.id}`, {
      headers: {
        ...this.session.authHeadersMap()
      },
    })
  }
}
