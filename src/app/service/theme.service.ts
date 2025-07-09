import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeKey = 'app-theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: string) {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem(this.themeKey, theme);
  }

  getCurrentTheme(): string {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  loadTheme() {
    this.setTheme(this.getCurrentTheme());
  }
}
