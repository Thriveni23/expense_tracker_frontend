import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Income } from '../models/income-details';
import { IncomeDetailsService } from '../service/income-details.service';
import { SnackbarService } from '../service/snackbar.service';

import { SourceService } from '../service/source.service';
import { Source } from '../models/source';

@Component({
  standalone: true,
  selector: 'app-income-tracking',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './income-tracking.component.html',
 // styleUrl: './income-tracking.component.css'
})
export class IncomeTrackingComponent {
  @Input() incomeary: Income[] = [];
  allIncomes: Income[] = []; 
  incomeForm!: FormGroup;
  sources: Source[] = [];
  searchTerm: string = ''; 
  selectedSource: string = 'All';
  
  incomeToEdit: Income | null = null;  

  constructor(
    private fb: FormBuilder,
    private incoserve: IncomeDetailsService,
    private snackbarService: SnackbarService,
    private sourceService: SourceService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getIncome(); 
    this.getSources(); 
  }

  initializeForm(): void {
    this.incomeForm = this.fb.group({
      
      date: ['',Validators.required],  
      description: ['', Validators.required],  
      amount: [0, [Validators.required, Validators.min(0)]],  
      source: ['', Validators.required]     
    });
  }

  getIncome(): void {
    this.incoserve.GetIncome().subscribe({
      next: (data) => {
        this.incomeary = [...data];
        this.allIncomes = [...data]; 
        this.sortIncomesByDate()
        console.log('Fetched Incomes:', this.incomeary);  
      },
      error: (err) => {
        console.error('Error loading incomes:', err);
      }
    });
  }
  

  getSources(): void {
    this.sourceService.getAllSources().subscribe({
      next: (data) => {
        this.sources = data;
      },
      error: (err) => {
        console.error('Error fetching sources:', err);
      }
    });
  }
  

  onSubmit(): void {
    if (this.incomeForm.valid) {
      const formValue = this.incomeForm.value;
  
      if (this.incomeToEdit) {
       
        const updatedIncome: Income = {
          id: this.incomeToEdit.id,
          ...formValue
        };
  
        this.incoserve.updateIncome(this.incomeToEdit.id, updatedIncome).subscribe({
          next: (response) => {
            console.log('Income updated successfully', response);
            this.snackbarService.show('SUCCESSFULLY UPDATED!!');
            this.getIncome();
            this.incomeForm.reset();
            this.incomeToEdit = null;
          },
          error: (err) => {
            console.error('Error updating income:', err);
            this.snackbarService.show('Failed to update income.');
          }
        });
      } else {
        
        const newIncome: Income = formValue;
        this.incoserve.insertIncome(newIncome).subscribe({
          next: (response) => {
            console.log('Income inserted successfully', response);
            this.snackbarService.show('Income has been added successfully!');
            this.getIncome();
            this.incomeForm.reset();
          },
          error: (err) => {
            console.error('Error inserting income:', err);
            this.snackbarService.show('Failed to add income.');
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.snackbarService.show('Please fill in all fields correctly.');
    }
  }
  
  onEdit(income: Income): void {
    this.incomeToEdit = { ...income }; 
    
    this.incomeForm.setValue({
     
      date: this.formatDateToInput(income.date),
      description: income.description,
      amount: income.amount,
      source: income.source
    });
    this.incomeToEdit = income;  
  }

  formatDateToInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  onDelete(income: Income): void {
    console.log('Deleting income with ID:', income.id);
    this.incoserve.deleteIncome(income.id).subscribe({
      next: (response) => {
        console.log('Transaction deleted successfully', response); 
        this.snackbarService.show('SUCCESSFULLY DELETED!');
        this.getIncome();
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
      this.incomeary = this.allIncomes.filter((inco) =>
        inco.description?.toLowerCase().includes(search)
      );
    } else {
      this.incomeary = [...this.allIncomes];
       
    }
  }

  onSourceFilterChange(): void {
    if (this.selectedSource === 'All') {
      this.incomeary = [...this.allIncomes];
    } else {
      this.incomeary = this.allIncomes.filter((inco) => inco.source === this.selectedSource);
    }
  
 
    const search = this.searchTerm.toLowerCase().trim();
    if (search) {
      this.incomeary = this.incomeary.filter((inco) =>
        inco.description.toLowerCase().includes(search)
      );
    }
  }

  private sortIncomesByDate(): void {
    this.incomeary.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.allIncomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
