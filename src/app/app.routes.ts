import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeTrackingComponent } from './income-tracking/income-tracking.component';
import { BudgetManagementComponent } from './budget-management/budget-management.component';
import { InsertTransactionComponent } from './insert-transaction/insert-transaction.component';
import { MonthlyStatisticsComponent } from './monthly-statistics/monthly-statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { SavingsGoalComponent } from './savings-goal/savings-goal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'monthlystatistics', component: MonthlyStatisticsComponent }, 
      { path: 'expensetracking', component: InsertTransactionComponent },
      { path: 'incometracking', component: IncomeTrackingComponent },
      { path: 'budgetmanaging', component: BudgetManagementComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'savingsgoal', component: SavingsGoalComponent },
      { path: '', redirectTo: 'monthlystatistics', pathMatch: 'full' }  
    ]
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  }
];
