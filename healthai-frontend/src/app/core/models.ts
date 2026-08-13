export interface Doctor { id: number; name: string; specialty: string; clinic: string; rating: string; hours: string; }
export interface Clinic { id: number; name: string; distance: number; open: string; type: string; address: string; phone: string; }
export interface AppointmentRequest { id?: string; doctorId: number; doctor?: string; specialty?: string; date: string; time: string; status?: 'Requested' | 'Confirmed' | 'Cancelled'; createdAt?: string; }
export interface ChatMessage { id?: string; from: 'user' | 'ai'; text: string; createdAt?: string; }
