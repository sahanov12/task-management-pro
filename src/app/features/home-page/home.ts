import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task';
import { Task, TaskStatus } from '../../models/task';
import { Router } from '@angular/router';
import { TaskCardComponent } from '../../shared/components/task-card';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, MatButtonModule, MatButtonToggleModule, TaskCardComponent, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
today: string = '';

taskService = inject(TaskService);
router = inject(Router);

ngOnInit() {
  const currentDate = new Date();
  this.today = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

 onFilterChange(filter: TaskStatus | 'all') {
    this.taskService.activeFilter.set(filter);
  }

    onTaskClicked(task: Task) {
    this.router.navigate(['/task', task.id]);
  }

  onNewTaskClick() {
    this.router.navigate(['/task', 'new']);
  }

}
