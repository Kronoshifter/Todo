import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TodoTask } from '../../model/todo-task'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import {faAngleRight, faCircleXmark, faCalendar, faCalendarPlus, faCalendarDay} from '@fortawesome/free-solid-svg-icons'
import { MatChipsModule } from '@angular/material/chips'
import { MatRippleModule } from '@angular/material/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DateTime } from "luxon";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { TaskService } from "../../services/task.service";
import { MatInputModule } from "@angular/material/input";
import { Subscription } from "rxjs";

@Component({
  selector: 'todo-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, FormsModule, FaIconComponent, MatChipsModule, MatRippleModule, MatTooltipModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent implements OnInit, OnDestroy{
  @Input({required: true}) task!: TodoTask
  @Output() change = new EventEmitter<TodoTask>()
  @Output() selected= new EventEmitter<TodoTask>()

  protected newTask: TodoTask
  protected dueDateForm: FormControl<DateTime | null> = new FormControl(null)

  private sub = new Subscription()

  protected readonly faCalendarDay = faCalendarDay;
  protected readonly faCalendarPlus = faCalendarPlus
  protected readonly faAngleRight = faAngleRight
  protected readonly faCircleXmark = faCircleXmark

  isPressed = false

  get dueDate(): DateTime | null {
    if (this.task.dueDate) {
      return DateTime.fromMillis(this.task.dueDate)
    }
    return null
  }

  set dueDate(value: DateTime | null) {
    if (value) {
      this.newTask.dueDate = value.toMillis()
    } else {
      this.newTask.dueDate = undefined
    }
  }

  constructor(
    private taskService: TaskService
  ) {
    this.selected.subscribe(this.taskService.taskSelected)
    this.change.subscribe(this.taskService.taskChanged)
  }

  ngOnInit(): void {
    this.newTask = structuredClone(this.task)

    this.dueDateForm = new FormControl(this.dueDate)
    const dateSub = this.dueDateForm.valueChanges.subscribe(value => {
      this.dueDate = value
      this.change.emit(this.cloneTask())
    })

    this.sub.add(dateSub)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  handlePress(event: MouseEvent) {
    if (event.currentTarget === event.target) {
      this.isPressed = true
    }
  }

  handleClick(event: MouseEvent) {
    if (event.currentTarget === event.target) {
      this.selected.emit(this.cloneTask())
    }
  }

  private cloneTask() {
    return structuredClone(this.newTask);
  }

  deleteDate() {
    this.dueDate = null
    this.change.emit(this.newTask)
  }
}
