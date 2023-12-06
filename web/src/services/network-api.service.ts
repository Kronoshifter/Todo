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

  handleError(error: HttpErrorResponse) {
    if (!error.ok) {
      const message = `Error ${error.status}: ${error.error}`
      console.log(message)
    }
  }

  login(): Observable<HttpResponse<string>> {
    return this.http.get('/api/login', {
      responseType: 'text',
      observe: 'response',
    }).pipe(
      catchError((err, it) => {
        this.handleError(err)
        return it
      }),
      tap((res) => {
        this.session.session = res.headers.get('x-session-id')
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
