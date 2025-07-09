import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../models/transaction-details';
import { TransactionDetailsService } from '../service/transaction-details.service';
import { SnackbarService } from '../service/snackbar.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Category } from '../models/category';
import { CategoryService } from '../service/category.service';

@Component({
  standalone: true,
  selector: 'app-insert-transaction',
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './insert-transaction.component.html',
 // styleUrls: ['./insert-transaction.component.css']
})


export class InsertTransactionComponent {
  @Input() transactionary: Transaction[] = [];
   allTransactions: Transaction[] = []; 
  transactionForm!: FormGroup;
  searchTerm: string = ''; 
  selectedCategory: string = 'All';
  categories: Category[] = [];
  transactionToEdit: Transaction | null = null; 

  constructor(
    private fb: FormBuilder,
    private transerve: TransactionDetailsService,
    private snackbarService: SnackbarService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getTransactions(); 
    this.getCategories(); 
  }

  initializeForm(): void {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, Validators.required],
      category: ['', Validators.required]
      
    });
  }

  getTransactions(): void {
    this.transerve.GetTransaction().subscribe({
      next: (data) => {
        this.transactionary = [...data];
        this.allTransactions = [...data]; 
        this.sortTransactionsByDate();
        console.log('Fetched Transactions:', this.transactionary);  
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
      }
    });
  } 
  
  getCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
  
      if (this.transactionToEdit) {
       
        const updatedTransaction: Transaction = {
          id: this.transactionToEdit.id,
          ...formValue
        };
  
        this.transerve.updateTransaction(this.transactionToEdit.id, updatedTransaction).subscribe({
          next: (response) => {
            console.log('Transaction updated successfully', response);
            this.snackbarService.show('Expense updated');
            this.getTransactions();
            this.transactionForm.reset({
              date: '',   
              description: '',
              amount: '',
              category: ''
            });
            this.transactionToEdit = null;
          },
          error: (err) => {
            console.error('Error updating transaction:', err);
            this.snackbarService.show('Failed to update Expense.');
          }
        });
      } else {
       
        const newTransaction: Transaction = formValue;
        console.log("Payload to send:", this.transactionForm.value);
        this.transerve.insertTransaction(newTransaction).subscribe({
          next: (response) => {
            console.log('Expense added', response);
            this.snackbarService.show('Expense added');
            this.getTransactions();
            this.transactionForm.reset({
              date: '',
              description: '',
              amount: '',
              category: ''
            });
          },
          error: (err) => {
            console.error('Error inserting transaction:', err);
            console.error('Validation Errors:', err.error?.errors);  
            this.snackbarService.show('Failed to add Expense.');
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.snackbarService.show('Please fill in all fields correctly.');
    }
  }
 
  
  onEdit(transaction: Transaction): void {
    this.transactionToEdit = { ...transaction }; 
  
    this.transactionForm.setValue({

      date: this.formatDateToInput(transaction.date),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category
    });
    this.transactionToEdit = transaction;  
  }

  formatDateToInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 

  onDelete(transaction: Transaction): void {
    console.log('Deleting transaction with ID:', transaction.id);
    this.transerve.deleteTransaction(transaction.id).subscribe({
      next: (response) => {
        console.log('Transaction deleted successfully', response); 
        this.snackbarService.show('Expense deleted');
        this.getTransactions();
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
        this.snackbarService.show('Failed to delete transaction.');
      }
    });
  }

  
  onSearchChange(): void {
    const search = this.searchTerm.toLowerCase().trim();
    if (search) {
      this.transactionary = this.allTransactions.filter((tran) =>
        tran.description.toLowerCase().includes(search)
      );
    } else {
      this.transactionary = [...this.allTransactions]; 
    }
  }

  onCategoryFilterChange(): void {
    if (this.selectedCategory === 'All') {
      this.transactionary = [...this.allTransactions];
    } else {
      this.transactionary = this.allTransactions.filter((tran) => tran.category === this.selectedCategory);
    }
  
   
    const search = this.searchTerm.toLowerCase().trim();
    if (search) {
      this.transactionary = this.transactionary.filter((tran) =>
        tran.description.toLowerCase().includes(search)
      );
    }
  }

  getCurrentMonthTransactions(): Transaction[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    return this.transactionary.filter(tran => {
      const tranDate = new Date(tran.date);
      return (
        tranDate.getMonth() === currentMonth &&
        tranDate.getFullYear() === currentYear
      );
    });
  }
  
  getMonthlyTotalAmount(): number {
    const monthlyTransactions = this.getCurrentMonthTransactions();
    return monthlyTransactions.reduce((sum, tran) => sum + tran.amount, 0);
  }
  
  
  exportToPDF(): void {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const monthlyTransactions = this.getCurrentMonthTransactions();
  

    doc.setFontSize(18);
    doc.text('Monthly Expense Report', 14, 15);
  
 
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate} `, 14, 22);
  
   
    const total = this.getMonthlyTotalAmount();
    const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    doc.text(`Total Expense for ${monthYear}: Rs. ${total}`, 14, 30);

    const headers = [['Date', 'Category', 'Amount', 'Description']];
    const data = monthlyTransactions.map(tran => [
      new Date(tran.date).toLocaleDateString(),
      tran.category,
      `Rs. ${tran.amount}`, 
      tran.description
    ]);
  
   
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35
    });
  
    doc.save('Monthly_Expense_Report.pdf');
  }
  

  private sortTransactionsByDate(): void {
    this.transactionary.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  
}
