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
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, AsyncPipe, TodoCardComponent, MatListModule, FaIconComponent, TodoListComponent, MatInputModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  tasks: TodoTask[] = []
  newTaskTitle = ''
  protected readonly faPlus = faPlus
  private sub: Subscription = new Subscription()

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

  //API calls

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
    const taskSub = this.api.fetchTasks().subscribe({
      next: (res) => {
        this.tasks = [...res]
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(taskSub)
  }

  addTask(task: TodoTask) {
    const taskSub = this.api.createTask(task).subscribe({
      next: (res) => {
        this.tasks.unshift(res)
        this.resetInput()
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(taskSub)
  }

  newTask() {
    if (this.newTaskTitle) {
      const task: TodoTask = {
        id: uuidv4(),
        title: this.newTaskTitle,
        completed: false,
      }

      this.addTask(task)
    } else {
      this.showSnackbar('Please enter a task title')
    }
  }

  openTask(task: TodoTask) {

  }

  private resetInput() {
    this.newTaskTitle = ''
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: 3000 })
  }
}
