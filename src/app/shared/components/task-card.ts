import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task';


@Component({
  selector: 'app-task-card',
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.scss']
})
export class TaskCardComponent {
  // ✦ New signal-based input() — replaces @Input()
  task = input.required<Task>();

  // ✦ New signal-based output() — replaces @Output() EventEmitter
  taskClicked = output<Task>();

  onCardClick() {
    this.taskClicked.emit(this.task());
  }

  get priorityClass() {
    return `priority-${this.task().priority}`;
  }

  get statusLabel() {
    const map: Record<string, string> = {
      'todo': 'Todo',
      'in-progress': 'In progress',
      'done': 'Done'
    };
    return map[this.task().status];
  }
}