import { Component, OnDestroy, OnInit } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
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
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
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
        this.taskService.updateTask(task)
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

      this.taskService.addTask(task).subscribe({
          next: () => {
            this.resetInput()
          },
          error: (err) => {
            this.showSnackbar(`Error: ${err.message}`)
          },
        }
      )
    } else {
      this.showSnackbar('Please enter a task title')
    }
  }

  //Helpers

  openTask(task: TodoTask) {
    const data: TodoDialogData = {
      oldTask: task
    }

    const ref = this.dialog.open(TodoDetailDialog, {
      data: data,
      autoFocus: 'dialog',
      disableClose: true,
      width: '70%',
    })

    const closeSub = ref.afterClosed().subscribe({
      next: (res) => {
        const result = res as TodoDialogResult
        if (result) {
          if (result.action === 'save') {
            this.taskService.updateTask(result.task).subscribe({
                next: () => {

                },
                error: (err) => {
                  this.showSnackbar(`Error: ${err.message}`)
                },
              }
            )
          } else if (result.action === 'delete') {
            this.taskService.deleteTask(result.task).subscribe({
              next: () => {
                // do nothing
              },
              error: (err) => {
                this.showSnackbar(`Error: ${err.message}`)
              },
            })
          } else if (result.action === 'cancel') {
            // do nothing
          }
        }
      }
      ,
      error: (err) => {
        this.showSnackbar(`Error: ${err.message}`)
      },
    })

    this.sub.add(closeSub)
  }


  private resetInput() {
    this.newTaskTitle = ''
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'dismiss', { duration: 3000 })
  }
}
