import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppointmentRequest, ChatMessage, Clinic, Doctor } from './models';

const doctors: Doctor[] = [
  { id: 1, name: 'Dr. Amina Salim', specialty: 'General Medicine', clinic: 'Mwanakwerekwe Health Centre', rating: '4.9', hours: '09:00–16:00' },
  { id: 2, name: 'Dr. Hassan Omar', specialty: 'Internal Medicine', clinic: 'Zanzibar Medical Center', rating: '4.8', hours: '10:00–17:00' },
  { id: 3, name: 'Dr. Fatma Ali', specialty: 'Pediatrics', clinic: 'Mnazi Mmoja Hospital', rating: '4.9', hours: '08:00–15:00' }
];
const clinics: Clinic[] = [
  { id: 1, name: 'Zanzibar Medical Center', distance: 1.2, open: 'Open now', type: 'Private clinic', address: 'Vuga, Zanzibar', phone: '+255 24 223 3322' },
  { id: 2, name: 'Mwanakwerekwe Health Centre', distance: 2.8, open: 'Open now', type: 'Health centre', address: 'Mwanakwerekwe, Zanzibar', phone: '+255 24 223 1111' },
  { id: 3, name: 'Mnazi Mmoja Hospital', distance: 4.1, open: 'Open 24 hours', type: 'Hospital', address: 'Mkunazini, Zanzibar', phone: '+255 24 223 4000' }
];

/** Single boundary between the UI and REST API. Demo data is used only if the API is unavailable. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  getDoctors(): Observable<Doctor[]> { return this.http.get<Doctor[]>(`${this.url}/doctors`).pipe(catchError(() => of(doctors))); }
  getClinics(): Observable<Clinic[]> { return this.http.get<Clinic[]>(`${this.url}/clinics`).pipe(catchError(() => of(clinics))); }
  getAppointments(): Observable<AppointmentRequest[]> { return this.http.get<AppointmentRequest[]>(`${this.url}/appointments`).pipe(catchError(() => of(this.localAppointments()))); }
  createAppointment(body: AppointmentRequest): Observable<AppointmentRequest> {
    const demo = { ...body, id: crypto.randomUUID(), status: 'Requested' as const, createdAt: new Date().toISOString() };
    return this.http.post<AppointmentRequest>(`${this.url}/appointments`, body).pipe(catchError(() => { this.saveLocalAppointment(demo); return of(demo); }));
  }
  sendChat(message: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.url}/chat/messages`, { message }).pipe(catchError(() => of<ChatMessage>({ from: 'ai', text: this.demoReply(message) })));
  }
  private localAppointments(): AppointmentRequest[] { try { return JSON.parse(localStorage.getItem('afya-appointments') ?? '[]'); } catch { return []; } }
  private saveLocalAppointment(item: AppointmentRequest) { localStorage.setItem('afya-appointments', JSON.stringify([item, ...this.localAppointments()])); }
  private demoReply(text: string) { return /chest pain|breath|bleeding|faint|seizure/i.test(text) ? 'This may be urgent. Call local emergency services or go to the nearest emergency department now.' : 'I can provide general health information, but I cannot diagnose conditions. If symptoms are severe, worsening, or persistent, please contact a qualified clinician.'; }
}
