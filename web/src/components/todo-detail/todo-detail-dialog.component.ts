import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {TodoTask} from "../../model/todo-task";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons";

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
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatInputModule, FormsModule, MatDatepickerModule, FaIconComponent],
  templateUrl: './todo-detail-dialog.component.html',
  styleUrl: './todo-detail-dialog.component.scss'
})
export class TodoDetailDialog implements OnInit {

  protected newTask: TodoTask
  protected readonly faCalendarDay = faCalendarDay;

  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData
  ) {
  }

  ngOnInit() {
    this.newTask = structuredClone(this.data.oldTask);
  }

  save() {
    this.dialogRef.close({task: this.newTask, action: 'save'});
  }

  cancel() {
    this.dialogRef.close({task: null, action: 'cancel'});
  }

  delete() {
    this.dialogRef.close({task: this.data.oldTask, action: 'delete'});
  }
}
