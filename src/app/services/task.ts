import { computed, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { Task, TaskStatus } from "../models/task";

@Injectable({
  providedIn: 'root'
})

export class TaskService {

    // ✦ Core signal — single source of truth
  private tasks = signal<Task[]>([
    { id: '1', title: 'Set up Angular signal store', 
      description: 'Create TaskService using signal() and computed()', 
      status: 'in-progress', priority: 'high', dueDate: '2026-06-28', tags: ['Angular', 'Signals'] },
    { id: '2', title: 'Build TaskCard standalone component', description: 'Standalone component with no NgModule', status: 'todo', priority: 'medium', dueDate: '2026-06-29', tags: ['Angular'] },
    { id: '3', title: 'Create GitHub repo and push', description: 'Init repo and push initial commit', status: 'done', priority: 'low', dueDate: '2026-06-27', tags: ['GitHub'] },
    { id: '4', title: 'Configure lazy-loaded routes', description: 'Set up loadComponent() routing', status: 'in-progress', priority: 'high', dueDate: '2026-06-30', tags: ['Angular'] },
  ]);
    // ✦ Active filter signal
  activeFilter = signal<TaskStatus | 'all'>('all');

  // ✦ computed() — auto-updates when tasks or filter changes
  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    const all = this.tasks();
    return filter === 'all' ? all : all.filter(t => t.status === filter);
  });

  // ✦ Stats — all derived, never manually tracked
  totalCount    = computed(() => this.tasks().length);
  inProgressCount = computed(() => this.tasks().filter(t => t.status === 'in-progress').length);
  doneCount     = computed(() => this.tasks().filter(t => t.status === 'done').length);
  todoCount  = computed(() =>  this.tasks().filter(t => t.status === 'todo').length);

  // ✦ Mutate the signal
  addTask(task: Task) {
    console.log('Adding task:', task);
    this.tasks.update(tasks => [...tasks, task]);
  }

  updateTask(updated: Task) {
    this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
  }

  deleteTask(id: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find(t => t.id === id);
  }
}