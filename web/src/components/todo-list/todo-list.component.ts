import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import {CommonModule} from '@angular/common'
import {TodoTask} from '../../model/todo-task'
import {TodoCardComponent} from '../todo-card/todo-card.component'
import {MatCardModule} from '@angular/material/card'
import {SortByCompletePipe} from '../../pipes/sortByComplete.pipe'
import {NgAutoAnimateDirective} from 'ng-auto-animate'
import { TaskService } from "../../services/task.service";
import { Observable, Subscription, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, MatCardModule, SortByCompletePipe, NgAutoAnimateDirective],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, OnDestroy {

  // tasks!: TodoTask[]

  tasks!: Observable<TodoTask[]>

  private sub = new Subscription()

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    // this.taskService
    this.tasks = this.taskService.tasks
    this.taskService.fetchTasks().subscribe(() => {
      console.log('fetched tasks')
    })
  }

  ngOnDestroy(): void {
  }
}
