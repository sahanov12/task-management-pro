export type TaskStatus = 'completed' | 'progress' | 'pending';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id?: string;
  type: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
}