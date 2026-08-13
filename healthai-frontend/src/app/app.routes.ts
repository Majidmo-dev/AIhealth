import { Routes } from '@angular/router';
import { DashboardComponent, SymptomCheckerComponent, AppointmentsComponent, ClinicsComponent, HistoryComponent, ChatComponent } from './pages/pages.component';
export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'AfyaAI | Dashboard' },
  { path: 'symptom-checker', component: SymptomCheckerComponent, title: 'Symptom check | AfyaAI' },
  { path: 'appointments', component: AppointmentsComponent, title: 'Appointments | AfyaAI' },
  { path: 'clinics', component: ClinicsComponent, title: 'Nearby clinics | AfyaAI' },
  { path: 'history', component: HistoryComponent, title: 'Patient history | AfyaAI' },
  { path: 'chat', component: ChatComponent, title: 'AI assistant | AfyaAI' },
  { path: '**', redirectTo: '' }
];
