import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'
import { TodoTask } from '../../model/todo-task'
import { Observable, Subscription } from 'rxjs'
import { MatCardModule } from '@angular/material/card'
import { AsyncPipe} from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, AsyncPipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  title = 'Kronos Todo'

  tasks: TodoTask[] = []
  tasks$: Observable<TodoTask[]>

  private sub: Subscription

  constructor(
    private api: NetworkAPIService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    // this.fetchTaskResponse()
    this.fetchTasks()
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  logout() {
    this.api.logout().subscribe((res) => {
      console.log(res)
      this.router.navigate(['/login'])
    })
  }

  fetchTaskResponse() {
    this.sub = this.api.fetchTaskResponse().subscribe({
      next: (res) => {
        this.tasks = [...res.tasks]
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })
  }

  fetchTasks() {
    this.tasks$ = this.api.fetchTasks()
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: 3000, })
  }
}
