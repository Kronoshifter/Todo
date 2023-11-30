export interface TodoTask {
  id: number
  title: string
  description: string
  completed: boolean
  dueDate?: number
}

export interface TodoTaskResponse {
  tasks: TodoTask[]
}
