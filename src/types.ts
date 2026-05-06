export type View = 'dashboard' | 'reception' | 'active-reception' | 'task-in-progress' | 'supplies' | 'calendar' | 'finance';

export interface Appointment {
  id: string;
  date: string; // ISO string
  customerPhone: string;
  service?: string;
  status: 'confirmed' | 'unconfirmed';
}

export interface Partner {
  id: string;
  name: string;
  type: 'investor' | 'collaborator';
  participationPercentage: number;
  status: 'active' | 'inactive';
  entryDate: string;
  exitDate?: string;
  totalCashContribution: number;
  totalReinvestmentContribution: number;
  totalWithdrawals: number;
  accumulatedCapital: number;
  notes?: string;
}

export type PurchaseCategory = 'herramienta' | 'equipo' | 'químico' | 'consumible' | 'marketing' | 'renta' | 'mantenimiento' | 'sueldo_colaborador' | 'piezas' | 'extras' | 'otro';
export type MovementType = 'activo' | 'gasto_operativo' | 'consumible';
export type PaymentMethod = 'reinversion' | 'aportacion_directa' | 'efectivo_caja' | 'credito' | 'otro';

export interface Purchase {
  id: string;
  date: string;
  concept: string;
  category: PurchaseCategory;
  movementType: MovementType;
  amount: number;
  paidWith: PaymentMethod;
  responsibleId: string;
  provider?: string;
  receiptUrl?: string;
  notes?: string;
  isInstallments?: boolean;
  installmentsCount?: number;
  installmentsPaid?: number;
  installmentAmount?: number;
  dueDate?: string; // Next payment date for credit or general due date
  partnerContributions?: Record<string, number>;
  startDate?: string;
  endDate?: string;
}

export interface Asset {
  id: string;
  purchaseId: string;
  name: string;
  category: string;
  purchaseDate: string;
  originalValue: number;
  currentEstimatedValue: number;
  status: 'active' | 'sold' | 'damaged' | 'lost';
  location: string;
  responsibleId: string;
  notes?: string;
}

export interface ReinvestmentDistribution {
  id: string;
  serviceId: string;
  partnerId: string;
  percentageAtMoment: number;
  amountAssigned: number;
  date: string;
}

export interface DirectContribution {
  id: string;
  partnerId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  concept: string;
  receiptUrl?: string;
}

export interface Withdrawal {
  id: string;
  partnerId: string;
  date: string;
  amount: number;
  concept: string;
  origin: 'reparto_utilidad' | 'liquidacion' | 'retiro_extraordinario';
  paymentMethod: string;
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
