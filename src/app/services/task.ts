import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { Task, TaskStatus } from "../models/task";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  // signals
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Task[]>(`${this.apiUrl}/getTasks`).subscribe({
      next: (tasks) => {
        console.log('Fetched tasks:', tasks);
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load tasks');
        this.loading.set(false);
      }
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/createTasks`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteTasks`, { params: { id } });
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/updateTasks`, task);
  }
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
  inProgressCount = computed(() => this.tasks().filter(t => t.status === 'progress').length);
  doneCount     = computed(() => this.tasks().filter(t => t.status === 'completed').length);
  todoCount  = computed(() =>  this.tasks().filter(t => t.status === 'pending').length);

  // ✦ Mutate the signal
  addTask(task: Task) {
    console.log('Adding task:', task);
    this.tasks.update(tasks => [...tasks, task]);
  }

  // updateTask(updated: Task) {
  //   this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
  // }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find(t => t.id === id);
  }
}