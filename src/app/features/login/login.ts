import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth";
import { MatButtonModule } from "@angular/material/button";
import { MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule, MatCardContent, MatCardTitle, MatCardHeader, MatCard, MatError, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  showSignInModal = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  signInForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  navigateToSignIn() {
    this.showSignInModal = true;
  }

  closeSignInModal() {
    this.showSignInModal = false;
    this.signInForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email || '';
      const password = this.loginForm.value.password || '';
      this.authService.loginUser(email, password).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onRegisterSubmit() {
    if (this.signInForm.valid) {
      const firstName = this.signInForm.value.firstName ?? '';
      const lastName = this.signInForm.value.lastName ?? '';
      const email = this.signInForm.value.email ?? '';
      const password = this.signInForm.value.password ?? '';

      this.authService.registerUser({ email, password }).subscribe({
        next: () => {
          this.snackBar.open('Successfully registered!', 'Close', { duration: 3000 });
          this.closeSignInModal();
        },
        error: () => {
          this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}