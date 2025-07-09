import { Component } from '@angular/core';
import { ThemeService } from '../service/theme.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  
})
export class SettingsComponent {

  changePasswordForm: FormGroup;
  passwordSuccess: string = '';
  passwordError: string = '';
  deleteMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onChangePassword() {
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully.';
        this.passwordError = '';
        this.changePasswordForm.reset();
      },
      error: (err) => {
        this.passwordError = err.error;
        this.passwordSuccess = '';
      }
    });
  }

  onDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.deleteMessage = 'Account deleted successfully. Redirecting to login...';
          this.authService.logout();
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.deleteMessage = err.error;
        }
      });
    }
  }
}
