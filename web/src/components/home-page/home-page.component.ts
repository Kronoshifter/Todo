import { Component, OnDestroy, OnInit } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'
import { TodoTask } from '../../model/todo-task'
import { Observable, Subscription } from 'rxjs'
import { MatCardModule } from '@angular/material/card'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TodoCardComponent } from '../todo-card/todo-card.component'
import { v4 as uuidv4 } from 'uuid'
import { MatListModule } from '@angular/material/list'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TodoListComponent } from '../todo-list/todo-list.component'

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, AsyncPipe, TodoCardComponent, MatListModule, FaIconComponent, TodoListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {

  tasks: TodoTask[] = []

  private sub: Subscription

  constructor(
    private api: NetworkAPIService,
    private router: Router,
    private snackBar: MatSnackBar,
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
    this.sub = this.api.fetchTasks().subscribe({
      next: (res) => {
        this.tasks = [...res]
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })
  }

  addTask() {
    const task: TodoTask = {
      id: uuidv4(),
      title: 'New Task',
      description: 'Description',
      completed: false,
      dueDate: Date.now(),
    }

    this.tasks.push(task)
  }

  openTask(task: TodoTask) {

  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: 3000 })
  }

  protected readonly faPlus = faPlus
}
