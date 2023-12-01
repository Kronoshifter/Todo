import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common';
import { TodoTask } from '../../model/todo-task'
import { TodoCardComponent } from '../todo-card/todo-card.component'
import { MatCardModule } from '@angular/material/card'
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, MatCardModule, CdkDropList, CdkDrag, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {

  @Input() tasks!: TodoTask[]
  @Output() taskSelected = new EventEmitter<TodoTask>()

  selectTask(task: TodoTask) {
    this.taskSelected.emit(task)
  }

  dropTask(event: CdkDragDrop<TodoTask>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex)
  }
}
