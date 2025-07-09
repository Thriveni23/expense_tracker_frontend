import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SnackbarService } from '../service/snackbar.service';
import { CommonModule } from '@angular/common';
import { SavingGoalService } from '../service/saving-goal.service';
import { SavingGoal } from '../models/savings-goals';

@Component({
  standalone:true,
  selector: 'app-savings-goal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './savings-goal.component.html',
  styleUrl: './savings-goal.component.css'
})

export class SavingsGoalComponent {
  
  goalForm!: FormGroup;
  goals: SavingGoal[] = [];
  contributionAmount: { [goalId: number]: number } = {};

  constructor(
    private fb: FormBuilder,
    private goalService: SavingGoalService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.goalForm = this.fb.group({
      goalName: ['', Validators.required],
      targetAmount: ['', Validators.required]
    });
    this.getGoals();
  }

  getGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (data) => (this.goals = data),
      error: () => this.snackbar.show('Failed to fetch goals')
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      const formValue = { ...this.goalForm.value, savedAmount: 0 };
      this.goalService.addGoal(formValue).subscribe({
        next: () => {
          this.snackbar.show('Goal set');
          this.goalForm.reset();
          this.getGoals();
        },
        error: () => this.snackbar.show('Failed to add goal')
      });
    } else {
      this.snackbar.show('Please fill in all fields.');
    }
  }

  onDelete(goalId: number): void {
    this.goalService.deleteGoal(goalId).subscribe({
      next: () => {
        this.snackbar.show('Goal deleted');
        this.getGoals();
      },
      error: () => this.snackbar.show('Failed to delete goal')
    });
  }

  onAddToSavings(goalId: number): void {
    const amount = this.contributionAmount[goalId];
    if (!amount || amount <= 0) {
      
      return;
    }

    this.goalService.addToSavings(goalId, amount).subscribe({
      next: () => {
        this.snackbar.show('Savings added');
        this.contributionAmount[goalId] = 0;
        this.getGoals();
      },
      error: () => this.snackbar.show('Failed to add amount')
    });
  }

  getProgress(goal: SavingGoal): number {
    return goal.targetAmount ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  }

}
