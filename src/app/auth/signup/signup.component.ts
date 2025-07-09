import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  //styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private snackBarService:SnackbarService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['User', Validators.required] 
    });
    
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.snackBarService.show('Please fill in all fields correctly.');
      return;
    }

    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.snackBarService.show('Signup successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Signup error:', err);
        const errorMessages = err.error?.errors?.join(', ') || err.error?.title || 'Signup failed';
this.snackBarService.show(errorMessages);

      }
    });
  }
}
