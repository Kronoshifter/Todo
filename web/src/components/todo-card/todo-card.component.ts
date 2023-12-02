import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TodoTask } from '../../model/todo-task'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faAngleRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { MatChipsModule } from '@angular/material/chips'
import { faCalendar, faCalendarPlus } from '@fortawesome/free-regular-svg-icons'
import { MatRippleModule } from '@angular/material/core'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'todo-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, FormsModule, FaIconComponent, MatChipsModule, MatRippleModule, MatTooltipModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  @Input({required: true}) task!: TodoTask
  @Output() completeChange = new EventEmitter<TodoTask>()
  @Output() selected= new EventEmitter<TodoTask>()

  protected readonly faAngleRight = faAngleRight
  protected readonly faCalendar = faCalendar
  protected readonly faCalendarPlus = faCalendarPlus
  protected readonly faCircleXmark = faCircleXmark

  isPressed = false

  get dueDate(): Date | null {
    if (this.task.dueDate) {
      return new Date(this.task.dueDate)
    }
    return null
  }

  setDueDate(task: TodoTask) {
    // TODO: Add date picker
    if (!task.dueDate) {
      task.dueDate = Date.now()
    }
  }

  handlePress(event: MouseEvent) {
    if (event.currentTarget === event.target) {
      this.isPressed = true
    }
  }
}
