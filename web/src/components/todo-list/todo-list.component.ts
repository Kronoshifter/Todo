import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common';
import { TodoTask } from '../../model/todo-task'
import { TodoCardComponent } from '../todo-card/todo-card.component'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {

  @Input() tasks!: TodoTask[]
  @Output() taskSelected = new EventEmitter<TodoTask>()

  selectTask(task: TodoTask) {
    this.taskSelected.emit(task)
  }
}
