import { EventEmitter, Injectable } from '@angular/core';
import { TodoTask } from "../model/todo-task";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _taskSelected = new Subject<TodoTask>()
  private _taskChanged = new Subject<TodoTask>()

  get taskSelected() { return this._taskSelected }
  get taskChanged() { return this._taskChanged }

  constructor() { }
}
