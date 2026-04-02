export type View = 'dashboard' | 'reception' | 'active-reception' | 'task-in-progress' | 'supplies' | 'calendar';

export interface Appointment {
  id: string;
  date: string; // ISO string
  customerPhone: string;
  service?: string;
  status: 'confirmed' | 'unconfirmed';
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  bay: string;
  status: 'active' | 'idle' | 'delayed';
  avatar: string;
  currentTask?: string;
  timer?: string;
}

export interface Bay {
  id: string;
  name: string;
  status: 'active' | 'waiting-parts' | 'full' | 'delayed' | 'cleaning';
  efficiency: number | string;
}

export interface Alert {
  id: string;
  type: 'qc' | 'parts' | 'delay';
  title: string;
  description: string;
  vehicle: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  vin: string;
  status: string;
  specs?: string[];
}
