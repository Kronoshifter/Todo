import { Pipe, PipeTransform } from '@angular/core';
import { TodoTask } from '../model/todo-task'

@Pipe({
  name: 'sortByComplete',
  standalone: true,
  pure: false
})
export class SortByCompletePipe implements PipeTransform {

  transform(value: TodoTask[]): TodoTask[] {
    return value.sort((a, b) => {
      if (!a.completed && b.completed) {
        return -1
      } else if (a.completed && !b.completed) {
        return 1
      } else {
        return 0
      }
    });
  }



}
