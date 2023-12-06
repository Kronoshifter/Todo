import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { TodoTask } from "../../model/todo-task";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import { Subscription } from "rxjs";
import { TaskService } from "../../services/task.service";

export interface TodoDialogData {
  oldTask: TodoTask
}

export interface TodoDialogResult {
  task: TodoTask
  action: TodoDialogAction
}

export type TodoDialogAction = 'cancel' | 'save' | 'delete'

@Component({
  selector: 'app-todo-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatInputModule, FormsModule, MatDatepickerModule, FaIconComponent, ReactiveFormsModule],
  templateUrl: './todo-detail-dialog.component.html',
  styleUrl: './todo-detail-dialog.component.scss'
})
export class TodoDetailDialog implements OnInit, OnDestroy {

  @Output() change = new EventEmitter<TodoTask>()

  protected newTask: TodoTask
  private sub = new Subscription()

  protected dueDateForm: FormControl<DateTime | null>
  protected readonly faCalendarDay = faCalendarDay;

  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData,
    private tasks: TaskService
  ) {
  }

  protected get dueDate(): DateTime | null {
    if (this.newTask.dueDate) {
      return DateTime.fromMillis(this.newTask.dueDate)
    } else {
      return null
    }
  }

  protected set dueDate(value: DateTime | null) {
    if (value) {
      this.newTask.dueDate = value.toMillis()
    } else {
      this.newTask.dueDate = undefined
    }
  }

  ngOnInit() {
    this.newTask = structuredClone(this.data.oldTask);
    this.dueDateForm = new FormControl(this.dueDate);
    const dateSub = this.dueDateForm.valueChanges.subscribe(value => {
      this.dueDate = value
    })

    const changeSub = this.change.subscribe(this.tasks.taskChanged)

    this.sub.add(dateSub)
    this.sub.add(changeSub)
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  save() {6
    this.newTask.dueDate = this.dueDate?.toMillis() ?? undefined;
    this.change.emit(this.cloneTask())
    this.dialogRef.close({ task: this.cloneTask(), action: 'save' });
  }

  cancel() {
    this.dialogRef.close({ task: null, action: 'cancel' });
  }

  delete() {
    this.dialogRef.close({ task: this.data.oldTask, action: 'delete' });
  }

  private cloneTask(): TodoTask {
    return structuredClone(this.newTask) as TodoTask
  }
}
