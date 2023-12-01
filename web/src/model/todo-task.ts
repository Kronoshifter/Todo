export interface TodoTask {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: number
}

export interface TodoTaskResponse {
  tasks: TodoTask[]
}
