import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { TodoTask } from '../../model/todo-task'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { MatChipsModule } from '@angular/material/chips'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

@Component({
  selector: 'todo-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, FormsModule, FaIconComponent, MatChipsModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  @Input() task!: TodoTask

  protected readonly faAngleRight = faAngleRight
  protected readonly faCalendar = faCalendar

  get dueDate(): Date | null {
    if (this.task.dueDate) {
      return new Date(this.task.dueDate);
    }
    return null;
  }
}
