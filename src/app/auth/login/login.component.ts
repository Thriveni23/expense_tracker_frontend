import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackbarService.show('Please fill in all fields correctly.');
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.snackbarService.show('Login successful!');
        // localStorage.setItem('token', res.token);
        // localStorage.setItem('role', res.role); 
              localStorage.setItem('token', res.result.token);
      localStorage.setItem('role', res.result.role);
        if (res.result.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.snackbarService.show('Login failed: ' + (err.error?.title || 'Invalid credentials'));
      },
    });
  }
  
}
