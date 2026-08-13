import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AppointmentRequest, ChatMessage, Clinic, Doctor } from '../core/models';

const emergency = /chest pain|difficulty breathing|shortness of breath|unconscious|fainting|seizure|severe bleeding|suicid/i;
const dateLabel = (date: string) => new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const initials = (name: string) => name.replace('Dr. ', '').split(' ').map(word => word[0]).join('').slice(0, 2);
const readNavState = <T = unknown>(key: string): T | undefined => {
  try { return (history.state as Record<string, unknown> | null)?.[key] as T | undefined; } catch { return undefined; }
};

@Component({
  selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink],
  template: `
<div class="page-head">
  <div>
    <p class="eyebrow">WELCOME BACK, MAJID</p>
    <h1>Care that fits your day</h1>
    <p class="description">Check symptoms, choose a local clinician, and keep your care information in one place.</p>
  </div>
  <a class="primary" routerLink="/symptom-checker">Check symptoms</a>
</div>
<section class="dashboard-hero">
  <div>
    <p class="eyebrow light-eyebrow">HEALTH SUPPORT</p>
    <h2>Start with what you are feeling.</h2>
    <p>Get clear next steps and choose appropriate local care. AfyaAI does not diagnose medical conditions.</p>
    <a class="light-button" routerLink="/symptom-checker">Start a symptom check</a>
  </div>
  <div class="hero-mark">+</div>
</section>
<div class="summary-grid">
  <article class="summary"><span>Next appointment</span><strong>{{ nextLabel }}</strong><small>{{ nextDetail }}</small></article>
  <article class="summary"><span>Care reminder</span><strong>Keep records current</strong><small>Review your saved care activity anytime.</small></article>
</div>
<div class="section-title"><div><h2>Choose a service</h2><p>Start with the option that best fits your need.</p></div></div>
<div class="action-grid">
  <a class="action-card" routerLink="/chat"><span><strong>Ask AfyaAI</strong><small>General health guidance</small></span><b>→</b></a>
  <a class="action-card" routerLink="/clinics"><span><strong>Find a clinic</strong><small>View nearby care options</small></span><b>→</b></a>
  <a class="action-card" routerLink="/appointments"><span><strong>Book a visit</strong><small>Request a clinician appointment</small></span><b>→</b></a>
  <a class="action-card" routerLink="/history"><span><strong>View history</strong><small>Review saved activity</small></span><b>→</b></a>
</div>
<div class="section-title"><div><h2>Available clinicians</h2><p>Choose a provider, then request a convenient time.</p></div><a routerLink="/appointments">View all</a></div>
<div class="doctor-grid">
  <article class="doctor-card" *ngFor="let doctor of doctors">
    <span class="doctor-avatar">{{ initials(doctor.name) }}</span>
    <h3>{{ doctor.name }}</h3>
    <p class="specialty">{{ doctor.specialty }}</p>
    <p>{{ doctor.clinic }}</p>
    <div class="meta">Rating {{ doctor.rating }} · {{ doctor.hours }}</div>
    <a class="secondary wide" routerLink="/appointments">Request appointment</a>
  </article>
</div>`
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  doctors: Doctor[] = [];
  nextLabel = 'None scheduled';
  nextDetail = 'Book a visit when you need one.';
  readonly initials = initials;
  ngOnInit() {
    this.api.getDoctors().subscribe(data => (this.doctors = data));
    this.api.getAppointments().subscribe(list => {
      const next = list.filter(a => (a.status ?? 'Requested') === 'Requested')
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      if (next) { this.nextLabel = dateLabel(next.date); this.nextDetail = `${next.doctor ?? 'Clinician'} at ${next.time}`; }
    });
  }
}

@Component({
  selector: 'app-symptoms', standalone: true, imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="page-head"><div><p class="eyebrow">HEALTH GUIDANCE</p><h1>Symptom check</h1><p class="description">This check offers general next steps. It does not diagnose conditions or replace a clinician.</p></div></div>
<div class="two-column">
  <section class="panel">
    <h2>Tell us what is happening</h2>
    <p class="muted">Select any symptoms that apply, then add useful details such as how long they have been present.</p>
    <fieldset>
      <legend>Common symptoms</legend>
      <div class="chips">
        <button type="button" *ngFor="let item of common" [class.selected]="symptoms.includes(item)" (click)="toggle(item)" [attr.aria-pressed]="symptoms.includes(item)">{{ symptoms.includes(item) ? '✓ ' : '+ ' }}{{ item }}</button>
      </div>
    </fieldset>
    <label for="notes">Describe your symptoms</label>
    <textarea id="notes" [(ngModel)]="notes" placeholder="For example: I have had a fever and headache since yesterday."></textarea>
    <p class="helper">If you have chest pain, difficulty breathing, severe bleeding, fainting, seizure, or feel unsafe, seek emergency help now.</p>
    <button type="button" class="primary wide" [disabled]="!symptoms.length && !notes.trim()" (click)="review()">Review next steps</button>
  </section>
  <aside class="guidance">
    <h2>What this does</h2>
    <ol>
      <li><strong>Collects your concerns</strong><span>You choose symptoms and add context.</span></li>
      <li><strong>Checks for urgent wording</strong><span>It highlights emergency care when terms suggest urgency.</span></li>
      <li><strong>Guides your next action</strong><span>You can find a clinician or nearby facility.</span></li>
    </ol>
  </aside>
</div>
<section *ngIf="assessment" class="assessment" [class.urgent]="urgent" aria-live="polite">
  <p class="eyebrow">NEXT STEP</p>
  <h2>{{ assessment.title }}</h2>
  <p>{{ assessment.text }}</p>
  <a class="primary inline" [routerLink]="urgent ? '/clinics' : '/appointments'">{{ urgent ? 'Find a hospital' : 'Find a clinician' }}</a>
</section>`
})
export class SymptomCheckerComponent {
  readonly common = ['Fever', 'Headache', 'Cough', 'Fatigue', 'Sore throat', 'Nausea', 'Body pain', 'Diarrhea'];
  symptoms: string[] = [];
  notes = '';
  assessment?: { title: string; text: string };
  urgent = false;
  toggle(item: string) { this.symptoms = this.symptoms.includes(item) ? this.symptoms.filter(x => x !== item) : [...this.symptoms, item]; }
  review() {
    this.urgent = emergency.test(`${this.symptoms.join(' ')} ${this.notes}`);
    this.assessment = this.urgent
      ? { title: 'Urgent care now', text: 'Your description may need urgent in-person assessment. Call local emergency services or go to the nearest emergency department now.' }
      : { title: 'Arrange clinical care', text: 'We cannot determine a diagnosis. Consider booking a clinician visit, especially if symptoms are new, worsening, severe, or not improving.' };
  }
}

@Component({
  selector: 'app-appointments', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<div class="page-head"><div><p class="eyebrow">CARE SERVICES</p><h1>Appointments</h1><p class="description">Find a clinician and send an appointment request.</p></div></div>
<div class="appointment-layout">
  <section>
    <div class="filters">
      <label class="sr-only" for="doctor-search">Search doctors</label>
      <input id="doctor-search" [(ngModel)]="filter" placeholder="Search doctors or specialties">
      <label class="sr-only" for="department">Department</label>
      <select id="department" [(ngModel)]="department">
        <option>All</option>
        <option *ngFor="let item of specialties">{{ item }}</option>
      </select>
    </div>
    <div class="doctor-list" *ngIf="visible.length; else emptyDoctors">
      <article class="doctor-row" *ngFor="let doctor of visible">
        <span class="doctor-avatar">{{ initials(doctor.name) }}</span>
        <div>
          <h3>{{ doctor.name }}</h3>
          <p>{{ doctor.specialty }}</p>
          <small>{{ doctor.clinic }} · Rating {{ doctor.rating }} · {{ doctor.hours }}</small>
        </div>
        <button type="button" class="secondary" (click)="selected = doctor">Choose</button>
      </article>
    </div>
    <ng-template #emptyDoctors><div class="empty"><strong>Nothing to show</strong><p>No clinicians match that search.</p></div></ng-template>
  </section>
  <aside class="panel booking">
    <h2>{{ selected ? 'Request with ' + selected.name : 'Choose a clinician' }}</h2>
    <form *ngIf="selected; else pick" (ngSubmit)="request()">
      <p class="muted">{{ selected.specialty }} at {{ selected.clinic }}</p>
      <label for="visit-date">Preferred date</label>
      <input id="visit-date" type="date" [(ngModel)]="date" name="date" required>
      <label for="visit-time">Preferred time</label>
      <select id="visit-time" [(ngModel)]="time" name="time">
        <option>09:00</option><option>10:30</option><option>13:00</option><option>15:30</option>
      </select>
      <button type="submit" class="primary wide">Send request</button>
      <button type="button" class="text-button" (click)="selected = undefined">Cancel</button>
    </form>
    <ng-template #pick><p class="muted">Select a doctor from the list to choose a preferred date and time.</p></ng-template>
    <div class="saved-appointments">
      <h3>Saved requests</h3>
      <ng-container *ngIf="appointments.length; else noSaved">
        <p *ngFor="let item of appointments.slice(0, 3)"><strong>{{ dateLabel(item.date) }}, {{ item.time }}</strong><span>{{ item.doctor }} · {{ item.status ?? 'Requested' }}</span></p>
      </ng-container>
      <ng-template #noSaved><p class="muted">No appointment requests yet.</p></ng-template>
    </div>
    <p *ngIf="notice" class="success-message" role="status">{{ notice }}</p>
  </aside>
</div>`
})
export class AppointmentsComponent implements OnInit {
  private readonly api = inject(ApiService);
  doctors: Doctor[] = [];
  appointments: AppointmentRequest[] = [];
  selected?: Doctor;
  filter = readNavState<string>('query') ?? '';
  department = 'All';
  date = new Date().toISOString().slice(0, 10);
  time = '10:30';
  notice = '';
  readonly initials = initials;
  readonly dateLabel = dateLabel;
  ngOnInit() {
    this.api.getDoctors().subscribe(data => (this.doctors = data));
    this.api.getAppointments().subscribe(data => (this.appointments = data));
  }
  get specialties() { return [...new Set(this.doctors.map(d => d.specialty))]; }
  get visible() {
    const q = this.filter.toLowerCase();
    return this.doctors.filter(d => `${d.name} ${d.specialty} ${d.clinic}`.toLowerCase().includes(q) && (this.department === 'All' || d.specialty === this.department));
  }
  request() {
    if (!this.selected) return;
    const body: AppointmentRequest = { doctorId: this.selected.id, doctor: this.selected.name, specialty: this.selected.specialty, date: this.date, time: this.time };
    this.api.createAppointment(body).subscribe(saved => {
      this.appointments = [saved, ...this.appointments];
      this.notice = `Appointment request sent for ${dateLabel(this.date)} at ${this.time}.`;
      this.selected = undefined;
    });
  }
}

@Component({
  selector: 'app-clinics', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<div class="page-head">
  <div><p class="eyebrow">CARE NEAR YOU</p><h1>Nearby clinics</h1><p class="description">Browse local care facilities. Distances and availability come from the backend when connected.</p></div>
  <button type="button" class="secondary" (click)="useLocation()">Use my location</button>
</div>
<p *ngIf="locationMessage" class="notice" role="status">{{ locationMessage }}</p>
<div class="clinic-layout">
  <section class="map-placeholder" aria-label="Illustrative clinic area map">
    <span>Care locations</span>
    <p>Use the list to choose a facility.</p>
  </section>
  <section>
    <div class="filters">
      <label class="sr-only" for="clinic-search">Search clinics</label>
      <input id="clinic-search" [(ngModel)]="filter" placeholder="Search clinics">
      <label class="sr-only" for="clinic-sort">Sort clinics</label>
      <select id="clinic-sort" [(ngModel)]="sort">
        <option value="distance">Nearest first</option>
        <option value="name">Name</option>
      </select>
    </div>
    <ng-container *ngIf="visible.length; else emptyClinics">
      <article class="clinic-card" *ngFor="let clinic of visible">
        <div>
          <h3>{{ clinic.name }}</h3>
          <p>{{ clinic.type }} · {{ clinic.address }}</p>
          <small>{{ clinic.open }}</small>
        </div>
        <strong>{{ clinic.distance }} km</strong>
        <button type="button" class="secondary" (click)="selected = clinic">Details</button>
      </article>
    </ng-container>
    <ng-template #emptyClinics><div class="empty"><strong>Nothing to show</strong><p>No clinics match that search.</p></div></ng-template>
  </section>
</div>
<section *ngIf="selected" class="details panel" aria-live="polite">
  <h2>{{ selected.name }}</h2>
  <p>{{ selected.address }}</p>
  <p><strong>Phone:</strong> {{ selected.phone }}</p>
  <p><strong>Availability:</strong> {{ selected.open }}</p>
  <button type="button" class="secondary" (click)="selected = undefined">Close details</button>
</section>`
})
export class ClinicsComponent implements OnInit {
  private readonly api = inject(ApiService);
  clinics: Clinic[] = [];
  filter = readNavState<string>('query') ?? '';
  sort: 'distance' | 'name' = 'distance';
  selected?: Clinic;
  locationMessage = '';
  ngOnInit() { this.api.getClinics().subscribe(data => (this.clinics = data)); }
  get visible() {
    const q = this.filter.toLowerCase();
    return this.clinics
      .filter(c => `${c.name} ${c.type} ${c.address}`.toLowerCase().includes(q))
      .sort((a, b) => this.sort === 'name' ? a.name.localeCompare(b.name) : a.distance - b.distance);
  }
  useLocation() {
    this.locationMessage = 'Location sharing is not connected in this demo. Clinics are shown in a sample Zanzibar area list.';
  }
}

@Component({
  selector: 'app-history', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<div class="page-head">
  <div><p class="eyebrow">MY RECORDS</p><h1>Patient history</h1><p class="description">Your appointment requests from the connected account.</p></div>
  <button type="button" class="secondary" [disabled]="!appointments.length" (click)="exportHistory()">Export history</button>
</div>
<p *ngIf="notice" class="notice" role="status">{{ notice }}</p>
<section class="history-summary">
  <article class="summary"><span>Saved requests</span><strong>{{ appointments.length }}</strong><small>Available from your care account</small></article>
  <article class="summary"><span>Data sharing</span><strong>Controlled</strong><small>Your backend manages access and retention.</small></article>
</section>
<section class="panel records">
  <div class="record-header">
    <h2>Saved activity</h2>
    <label><span class="sr-only">Filter activity</span>
      <select [(ngModel)]="filter">
        <option>All</option><option>Requested</option><option>Confirmed</option><option>Cancelled</option>
      </select>
    </label>
  </div>
  <div class="record-list" *ngIf="visible.length; else empty">
    <article *ngFor="let item of visible">
      <time>{{ dateLabel(item.date) }}</time>
      <div><strong>Appointment request</strong><span>{{ item.specialty }} — {{ item.doctor }}</span></div>
      <b>{{ item.status ?? 'Requested' }}</b>
    </article>
  </div>
  <ng-template #empty><div class="empty"><strong>Nothing to show</strong><p>Appointment requests will appear here.</p></div></ng-template>
</section>`
})
export class HistoryComponent implements OnInit {
  private readonly api = inject(ApiService);
  appointments: AppointmentRequest[] = [];
  filter: 'All' | 'Requested' | 'Confirmed' | 'Cancelled' = 'All';
  notice = '';
  readonly dateLabel = dateLabel;
  ngOnInit() { this.api.getAppointments().subscribe(data => (this.appointments = data)); }
  get visible() { return this.filter === 'All' ? this.appointments : this.appointments.filter(a => (a.status ?? 'Requested') === this.filter); }
  exportHistory() {
    const data = new Blob([JSON.stringify(this.appointments, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url; link.download = 'afyaai-history.json'; link.click();
    URL.revokeObjectURL(url);
    this.notice = 'Your saved appointment history has been downloaded.';
  }
}

@Component({
  selector: 'app-chat', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<div class="page-head"><div><p class="eyebrow">AI HEALTH ASSISTANT</p><h1>Chat with AfyaAI</h1><p class="description">Get general health guidance. Do not use chat for an emergency.</p></div></div>
<section class="chat panel">
  <div class="chat-header"><strong>AfyaAI assistant</strong><span>General information only</span></div>
  <div class="messages" aria-live="polite">
    <div *ngFor="let message of messages" class="message" [class.user]="message.from === 'user'">
      <p>{{ message.text }}</p>
      <small>{{ message.from === 'ai' ? 'AfyaAI' : 'You' }}</small>
    </div>
  </div>
  <div class="suggestions">
    <button type="button" (click)="input = 'What should I do for a fever?'">Fever guidance</button>
    <button type="button" (click)="input = 'Which doctor should I see?'">Find a doctor</button>
    <button type="button" (click)="input = 'Where is the nearest clinic?'">Nearby clinics</button>
  </div>
  <form class="chat-form" (ngSubmit)="send()">
    <label class="sr-only" for="chat-input">Your health question</label>
    <input id="chat-input" [(ngModel)]="input" name="message" placeholder="Type a health question">
    <button type="submit" class="primary">Send</button>
  </form>
</section>`
})
export class ChatComponent {
  private readonly api = inject(ApiService);
  input = '';
  messages: ChatMessage[] = [{ from: 'ai', text: 'Hello. I can provide general health information and help you find care. I cannot diagnose conditions.' }];
  send() {
    const text = this.input.trim();
    if (!text) return;
    this.messages = [...this.messages, { from: 'user', text }];
    this.input = '';
    this.api.sendChat(text).subscribe(reply => (this.messages = [...this.messages, reply]));
  }
}
