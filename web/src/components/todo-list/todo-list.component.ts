import {Component, EventEmitter, Input, Output} from '@angular/core'
import {CommonModule} from '@angular/common'
import {TodoTask} from '../../model/todo-task'
import {TodoCardComponent} from '../todo-card/todo-card.component'
import {MatCardModule} from '@angular/material/card'
import {SortByCompletePipe} from '../../pipes/sortByComplete.pipe'
import {NgAutoAnimateDirective} from 'ng-auto-animate'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, MatCardModule, SortByCompletePipe, NgAutoAnimateDirective],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {

  @Input({required: true}) tasks!: TodoTask[]
  @Output() select = new EventEmitter<TodoTask>()

  constructor() {

  }

}
