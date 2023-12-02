export interface TodoTask {
  id: string
  title: string
  completed: boolean
  // tags: string
  description?: string
  dueDate?: number
}

export interface TodoTaskResponse {
  tasks: TodoTask[]
}
