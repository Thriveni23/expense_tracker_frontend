import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TransactionDetailsService } from './service/transaction-details.service';
import { HttpClientModule } from '@angular/common/http';
import { Transaction } from './models/transaction-details';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CommonModule],
  //providers: [HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public router: Router) {}

  title = 'expenseTrackerapp';
}
