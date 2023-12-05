import { Component, OnDestroy, OnInit } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { NetworkAPIService } from '../../services/network-api.service'
import { TodoTask } from '../../model/todo-task'
import { debounceTime, Subscription } from 'rxjs'
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
import { MatDialog } from "@angular/material/dialog";
import { TodoDetailDialog, TodoDialogData, TodoDialogResult } from "../todo-detail/todo-detail-dialog.component";
import { TaskService } from "../../services/task.service";

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
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    // this.fetchTaskResponse()
    this.fetchTasks()

    const selectSub = this.taskService.taskSelected.subscribe({
      next: (task) => {
        this.openTask(task)
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      }
    })

    const changeSub = this.taskService.taskChanged.pipe(debounceTime(500)).subscribe({
      next: (task) => {
        this.updateTask(task)
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      }
    })

    this.sub.add(selectSub)
    this.sub.add(changeSub)
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  newTask() {
    if (this.newTaskTitle) {
      const task: TodoTask = {
        id: uuidv4(),
        title: this.newTaskTitle,
        completed: false,
        tags: [],
      }

      this.addTask(task)
    } else {
      this.showSnackbar('Please enter a task title')
    }
  }

  openTask(task: TodoTask) {
    const data: TodoDialogData = {
      oldTask: task
    }

    const ref = this.dialog.open(TodoDetailDialog, {
      data: data,
      autoFocus: 'dialog',
      disableClose: true,
      width: '500px',
    })

    const closeSub = ref.afterClosed().subscribe({
      next: (res) => {
        const result = res as TodoDialogResult
        if (result) {
          if (result.action === 'save') {
            this.updateTask(result.task)
          } else if (result.action === 'delete') {
            this.deleteTask(result.task)
          } else if (result.action === 'cancel') {
            // do nothing
          }
        }
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(closeSub)
  }

  //API calls

  private fetchTasks() {
    const taskSub = this.api.fetchTasks().subscribe({
      next: (tasks) => {
        this.tasks = [...tasks]
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(taskSub)
  }

  private addTask(task: TodoTask) {
    const taskSub = this.api.createTask(task).subscribe({
      next: (res) => {
        this.resetInput()
        this.fetchTasks()
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(taskSub)
  }

  private updateTask(task: TodoTask) {
    console.log('Updating task: ', task.title, task.id)

    this.api.updateTask(task).subscribe({
      next: (res) => {
        this.fetchTasks()
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })
  }

  private deleteTask(task: TodoTask) {
    this.api.deleteTask(task).subscribe({
      next: (res) => {
        this.fetchTasks()
      },
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })
  }

  //Helpers

  private resetInput() {
    this.newTaskTitle = ''
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: 3000 })
  }
}
