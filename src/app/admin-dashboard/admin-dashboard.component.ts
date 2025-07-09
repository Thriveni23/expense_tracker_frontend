import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../service/admin-service.service';
import { CategoryService } from '../service/category.service';
import { SourceService } from '../service/source.service';
import { SnackbarService } from '../service/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  incomes: any[] = [];
  transactions: any[] = [];
  savings: any[] = [];
  budgets: any[] = [];

  
  categoryTypes: any[] = [];
  newCategory: string = '';

  sourceTypes: any[] = [];
  newSource: string = '';

  constructor(private adminService: AdminService,private categoryService:CategoryService,private sourceService:SourceService,private snackbarService:SnackbarService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadIncomes();
    this.loadTransactions();
    this.loadSavings();
    this.loadBudgets();
    this.loadCategories();
    this.loadSources();
  
  }

 
  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.filter((u: any) => u.role === 'User');
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }
   
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.snackbarService.show('User deleted successfully!');
          this.loadUsers(); 
          this.loadIncomes();
          this.loadTransactions();
          this.loadSavings();
          this.loadBudgets();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.snackbarService.show('Failed to delete user.');
        }
      });
    }
  }
  
 
  loadIncomes() {
    this.adminService.getAllIncomes().subscribe({
      next: (res) => this.incomes = res,
      error: (err) => console.error('Error fetching incomes:', err)
    });
  }


  loadTransactions() {
    this.adminService.getAllTransactions().subscribe({
      next: (res) => this.transactions = res,
      error: (err) => console.error('Error fetching transactions:', err)
    });
  }

 
  loadSavings() {
    this.adminService.getAllSavings().subscribe({
      next: (res) => this.savings = res,
      error: (err) => console.error('Error fetching savings:', err)
    });
  }

 
  loadBudgets() {
    this.adminService.getAllBudgets().subscribe({
      next: (res) => this.budgets = res,
      error: (err) => console.error('Error fetching budgets:', err)
    });
  }


  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => this.categoryTypes = res,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  addCategory() {
    if (!this.newCategory.trim()) return;
    const payload = { categoryType: this.newCategory };
    this.categoryService.addCategory(payload).subscribe({
      next: () => {
        this.newCategory = '';
        this.loadCategories();
      },
      error: (err) => console.error('Error adding category:', err)
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Error deleting category:', err)
    });
  }


  loadSources() {
    this.sourceService.getAllSources().subscribe({
      next: (res) => this.sourceTypes = res,
      error: (err) => console.error('Error loading sources:', err)
    });
  }

  addSource() {
    if (!this.newSource.trim()) return;
    const payload = { sourceType: this.newSource };
    this.sourceService.addSource(payload).subscribe({
      next: () => {
        this.newSource = '';
        this.loadSources();
      },
      error: (err) => console.error('Error adding source:', err)
    });
  }

  deleteSource(id: number) {
    this.sourceService.deleteSource(id).subscribe({
      next: () => this.loadSources(),
      error: (err) => console.error('Error deleting source:', err)
    });
  }
}
