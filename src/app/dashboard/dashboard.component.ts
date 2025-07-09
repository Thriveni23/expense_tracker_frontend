import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,RouterModule,CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = false;
  userRole: string | null = null;

  constructor(private router: Router) {
    this.userRole = localStorage.getItem('role');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.closeSidebar();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }
}

