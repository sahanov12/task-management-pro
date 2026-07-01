export type TaskStatus = 'todo' | 'progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
}