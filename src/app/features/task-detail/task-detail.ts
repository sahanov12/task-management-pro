import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../../models/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink, MatIconModule, MatButtonModule, 
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatBadgeModule, 
    MatToolbarModule, ReactiveFormsModule ],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.scss']
})
export class TaskDetail implements OnInit {
route = inject(ActivatedRoute);
taskService = inject(TaskService);
snackBar = inject(MatSnackBar);
fb = inject(FormBuilder);
router = inject(Router);
taskDetailForm!: FormGroup;

ngOnInit() {
  this.taskDetailForm = this.fb.group({
  title: ['', Validators.required],
  description: ['', Validators.required],
  dueDate: ['', Validators.required],
  status: ['', Validators.required],
  priority: ['', Validators.required],
  tags: [[] as string[]]
});

 // Get id from route
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      // Initialize form for new task
      this.taskDetailForm.reset();
    } else if (id) {
      const task = this.taskService.getTaskById(id);
      if (task) {
        // Patch values into the reactive form
        this.taskDetailForm.patchValue(task);
      }
    }
}

onSubmit() {
  if (this.taskDetailForm.valid) {
    const task: Task = this.taskDetailForm.value;
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Form submitted with task:', task, 'and id:', id);
    
    if (id === 'new') {
     this.taskService.createTask(task).subscribe({
        next: (createdTask) => {
          this.openToast('Task added successfully!', true);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.openToast('Failed to add task!', false);
        }
      });
    } else if (id) {
      task.id = id || undefined; // Ensure the task has the correct id
      this.taskService.updateTask(task).subscribe({
        next: (updatedTask) => {
          this.openToast('Task updated successfully!', true);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.openToast('Failed to update task!', false);
        }
      });
    }
  }
}

openToast(message: string, success: boolean) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // duration in milliseconds (3 seconds)
      panelClass: [success ? 'success-snackbar' : 'delete-snackbar'],
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top',     // 'top' | 'bottom'
    });
  }

  onDelete() {
    this.taskService.deleteTask(this.route.snapshot.paramMap.get('id')!).subscribe({
      next: () => {
        this.openToast('Task deleted successfully!', true);
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.openToast('Failed to delete task!', false);
      }
    });
  }

}