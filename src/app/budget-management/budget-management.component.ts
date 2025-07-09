import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget } from '../models/budget-details';
import { BudgetDetailsService } from '../service/budget-details.service';
import { BudgetSummary } from '../models/budget-summary';
import { SnackbarService } from '../service/snackbar.service';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  selector: 'app-budget-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgChartsModule
    ],
  templateUrl: './budget-management.component.html',
 // styleUrl: './budget-management.component.css'
})
export class BudgetManagementComponent {
  budgetForm!: FormGroup;
  budgetSummary: BudgetSummary[] = [];

  categories = [
    "Food",
    "Transportation",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Fitness",
    "Rent",
    "Education",
    "Travel",
    "Others"
  ];

  constructor(private fb: FormBuilder, private budgetDetailsService: BudgetDetailsService,    private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.budgetForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      monthyear: ['', Validators.required],
    });
    this.loadBudgetSummary();
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const budgetData: Budget = this.budgetForm.value;
      console.log('Sending data to backend:', budgetData); 
  
      this.budgetDetailsService.addBudget(budgetData).subscribe({
        next: (res) => {
          this.snackbarService.show('Budget set');
          console.log('Income inserted successfully', res);
          this.budgetForm.reset();
          this.loadBudgetSummary();
        },
        error: (err) => {
          this.snackbarService.show('Error setting budget');
          console.error(err);
        }
      });
    }
    
  }

  loadBudgetSummary() {
    this.budgetDetailsService.getCurrentMonthSummary().subscribe((data) => {
      this.budgetSummary = data;
    });
  }

  getChartData(spent: number, remaining: number) {
    return {
      labels: ['Spent', 'Remaining'],
      datasets: [{
        data: [spent, remaining],
        backgroundColor: ['#FF6384', '#36A2EB'], 
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      }],
      plugins: [ChartDataLabels]
    };
  }
  
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold',
          size: 14
        }
      }
    }
  };
  
  
  
}
