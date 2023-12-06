import { Injectable } from '@angular/core';
import { TodoTask } from "../model/todo-task";
import { BehaviorSubject, concatMap, map, Observable, Subject } from "rxjs";
import { NetworkAPIService } from "./network-api.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _taskSelected = new Subject<TodoTask>()

  get taskSelected() {
    return this._taskSelected
  }

  private _taskChanged = new Subject<TodoTask>()

  get taskChanged() {
    return this._taskChanged
  }

  private _tasks = new BehaviorSubject<TodoTask[]>([])
  tasks = this._tasks.asObservable()

  constructor(private api: NetworkAPIService) {
    this.taskChanged.pipe(
      concatMap((task) => {
        return this.updateTask(task)
      })
    ).subscribe(
      () => {
        console.log('Task updated')
      }
    )
  }

  fetchTasks(): Observable<void> {
    console.log('Retrieving tasks')
    return this.api.fetchTasks().pipe(
      map((tasks) => {
        this._tasks.next(tasks)
      })
    )
  }

  addTask(task: TodoTask): Observable<void> {
    console.log('Adding new task: ', {...task})
    return this.api.createTask(task).pipe(
      concatMap(() => {
        return this.fetchTasks()
      })
    )
  }

  updateTask(task: TodoTask): Observable<void> {
    console.log('Updating task: ', {...task})
    return this.api.updateTask(task).pipe(
      concatMap(() => {
        return this.fetchTasks()
      })
    )
  }

  deleteTask(task: TodoTask) {
    console.log('Deleting task: ', task.title, task.id)
    return this.api.deleteTask(task).pipe(
      concatMap(() => {
        return this.fetchTasks()
      })
    )
  }
}
