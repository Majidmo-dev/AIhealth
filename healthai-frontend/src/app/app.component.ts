import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
<div class="app" [class.dark]="dark()">
  <aside class="sidebar">
    <a routerLink="/" class="brand"><span>+</span> Afya<strong>AI</strong></a>
    <p class="nav-label">MAIN MENU</p>
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"><span>Home</span>Dashboard</a>
      <a routerLink="/symptom-checker" routerLinkActive="active"><span>Check</span>Symptom checker</a>
      <a routerLink="/appointments" routerLinkActive="active"><span>Book</span>Appointments</a>
      <a routerLink="/clinics" routerLinkActive="active"><span>Care</span>Nearby clinics</a>
      <a routerLink="/history" routerLinkActive="active"><span>History</span>Patient history</a>
      <a routerLink="/chat" routerLinkActive="active"><span>Chat</span>AI assistant</a>
    </nav>
    <div class="urgent-card">
      <strong>Need urgent help?</strong>
      <p>For a life-threatening emergency, call local emergency services or go to the nearest hospital.</p>
      <a routerLink="/clinics">Find urgent care</a>
    </div>
    <div class="account">
      <span class="avatar">MA</span>
      <div><strong>Majid Ali</strong><small>Patient account</small></div>
    </div>
  </aside>
  <main class="main">
    <header class="topbar">
      <a class="mobile-brand" routerLink="/">+ AfyaAI</a>
      <form class="global-search" (ngSubmit)="search()" role="search">
        <label class="sr-only" for="global-search">Search doctors and clinics</label>
        <input id="global-search" [(ngModel)]="query" name="q" placeholder="Search doctors, clinics, specialties…">
        <button type="submit" aria-label="Search">Search</button>
      </form>
      <button type="button" class="icon-button" (click)="toggleTheme()" [attr.aria-label]="'Switch to ' + (dark() ? 'light' : 'dark') + ' mode'">{{ dark() ? 'Light' : 'Dark' }}</button>
      <span class="avatar top-avatar">MA</span>
    </header>
    <div class="content"><router-outlet /></div>
    <footer class="site-footer">
      <div class="footer-brand">
        <strong>+ AfyaAI</strong>
        <p>General health information for Zanzibar. Not medical advice, diagnosis, or treatment.</p>
      </div>
      <nav class="footer-nav" aria-label="Footer">
        <a routerLink="/symptom-checker">Symptom check</a>
        <a routerLink="/clinics">Clinics</a>
        <a routerLink="/appointments">Appointments</a>
        <a routerLink="/chat">AI assistant</a>
      </nav>
      <small>© {{ year }} AfyaAI · For emergencies, call your local emergency service.</small>
    </footer>
  </main>
</div>`
})
export class AppComponent {
  readonly dark = signal(this.readTheme());
  readonly year = new Date().getFullYear();
  query = '';

  constructor(private readonly router: Router) {
    effect(() => {
      try { localStorage.setItem('afya-theme', this.dark() ? 'dark' : 'light'); } catch {}
    });
  }

  toggleTheme() { this.dark.set(!this.dark()); }

  search() {
    const q = this.query.trim().toLowerCase();
    if (!q) return;
    const target = q.includes('clinic') || q.includes('hospital') ? '/clinics' : '/appointments';
    this.router.navigate([target], { state: { query: q } });
  }

  private readTheme(): boolean {
    try {
      const saved = localStorage.getItem('afya-theme');
      if (saved) return saved === 'dark';
    } catch {}
    return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }
}
