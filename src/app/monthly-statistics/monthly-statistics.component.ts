import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { TransactionDetailsService } from '../service/transaction-details.service';
import { IncomeDetailsService } from '../service/income-details.service';
import { Transaction } from '../models/transaction-details';
import { Income } from '../models/income-details';

@Component({
  selector: 'app-monthly-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './monthly-statistics.component.html',
  styleUrls: ['./monthly-statistics.component.css']
})
export class MonthlyStatisticsComponent implements OnInit {
  currentMonthYear = '';

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  pieChartType: 'pie' = 'pie';

  pieChartLabels: string[] = ['Income', 'Expense', 'Savings'];

  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ₹${ctx.parsed}`
        }
      }
    }
  };

  constructor(
    private incomeService: IncomeDetailsService,
    private expenseService: TransactionDetailsService
  ) {}

  ngOnInit(): void {
    this.setCurrentMonthYear();
    this.loadCurrentMonthData();
  }

  setCurrentMonthYear() {
    const now = new Date();
    this.currentMonthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  loadCurrentMonthData(): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.incomeService.GetIncome().subscribe((incomes: Income[]) => {
      let totalIncome = 0;
      incomes.forEach(income => {
        const date = new Date(income.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          totalIncome += income.amount;
        }
      });

      this.expenseService.GetTransaction().subscribe((expenses: Transaction[]) => {
        let totalExpense = 0;
        expenses.forEach(expense => {
          const date = new Date(expense.date);
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            totalExpense += expense.amount;
          }
        });

        this.updateChart(totalIncome, totalExpense);
      });
    });
  }

  updateChart(income: number, expense: number): void {
    this.totalIncome = income;
    this.totalExpense = expense;
    this.balance = income - expense;

   
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [income, expense, this.balance > 0 ? this.balance : 0],
          backgroundColor: ['#4caf50', '#f44336', '#2196f3']
        }
      ]
    };
  }
}
