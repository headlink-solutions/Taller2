import React from 'react';
import { Card } from './ui/Base';
import { Plus, Clock, CreditCard, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { Technician, Alert, Bay } from '@/src/types';
import { cn } from '@/src/lib/utils';

const TECHNICIANS: Technician[] = [
  { id: '1', name: 'MARCUS RUIZ', specialty: 'Especialista Senior', bay: 'Bahía 04', status: 'active', avatar: 'https://picsum.photos/seed/tech1/200', currentTask: 'Revisión de Transmisión', timer: '02:14:45' },
  { id: '2', name: 'ELENA VANCE', specialty: 'Sistemas Eléctricos', bay: 'Bahía 01', status: 'active', avatar: 'https://picsum.photos/seed/tech2/200', currentTask: 'Escaneo y Reset de Diagnóstico', timer: '00:42:12' },
  { id: '3', name: 'CHEN WEI', specialty: 'Experto en Suspensión', bay: 'Bahía 07', status: 'active', avatar: 'https://picsum.photos/seed/tech3/200', currentTask: 'Reemplazo de Discos de Freno', timer: '01:05:22' },
];

const ALERTS: Alert[] = [
  { id: '1', type: 'qc', title: 'QC DEMORADO', description: 'Control de calidad pendiente por 180+ minutos. El técnico ya salió.', vehicle: 'BMW X5 / JX-902', urgency: 'high' },
  { id: '2', type: 'parts', title: 'LLEGADA DE REFACCIONES', description: 'Brazo de control delantero entregado. Bahía 02 lista para reanudar reparación.', vehicle: 'TESLA MODEL 3', urgency: 'medium' },
];

const BAYS: Bay[] = [
  { id: '1', name: 'Bahía 01', status: 'active', efficiency: '88%' },
  { id: '2', name: 'Bahía 02', status: 'waiting-parts', efficiency: 'TEP' },
  { id: '3', name: 'Bahía 03', status: 'full', efficiency: '100%' },
  { id: '4', name: 'Bahía 04', status: 'delayed', efficiency: '92%' },
  { id: '5', name: 'Bahía 05', status: 'cleaning', efficiency: 'LIBRE' },
  { id: '6', name: 'Bahía 06', status: 'active', efficiency: '75%' },
];

export const Dashboard = ({ onStartReception }: { onStartReception: () => void }) => {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Centro de Mando / v4.2.0-estable</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            14 Vehículos<br />
            <span className="text-zinc-600">En Servicio</span>
          </h1>
        </div>
        <button 
          onClick={onStartReception}
          className="bg-primary text-on-primary flex items-center gap-3 px-8 py-5 rounded-md font-bold uppercase tracking-tight active:scale-95 transition-all shadow-lg shadow-primary/10 group"
        >
          <Plus className="w-5 h-5" />
          <span>Recepción</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* KPIs */}
        <Card className="md:col-span-4 h-48" title="Eficiencia Técnica" icon={<TrendingUp className="w-5 h-5" />}>
          <div>
            <div className="text-4xl font-black">92.4%</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1.5 w-full bg-surface-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92.4%]" />
              </div>
              <span className="text-[10px] text-primary font-bold whitespace-nowrap">OBJETIVO &gt;85%</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-4 h-48" title="Trabajo en Progreso" icon={<Clock className="w-5 h-5 text-secondary" />}>
          <div>
            <div className="text-4xl font-black">2.8 <span className="text-xl font-medium text-zinc-500 uppercase">Días</span></div>
            <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-tighter">+0.4 respecto al promedio semanal</p>
          </div>
        </Card>

        <Card className="md:col-span-4 h-48" title="Ticket Promedio" icon={<CreditCard className="w-5 h-5 text-tertiary" />}>
          <div>
            <div className="text-4xl font-black">$1,482</div>
            <p className="text-[10px] text-tertiary font-bold mt-1 uppercase tracking-tighter">Máximo: $2,100 (Bahía 04)</p>
          </div>
        </Card>

        {/* Technicians */}
        <div className="md:col-span-8 space-y-4">
          <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Rendimiento de Técnicos en Vivo</h2>
          {TECHNICIANS.map(tech => (
            <div key={tech.id} className="bg-surface-high p-4 flex items-center justify-between rounded-lg group hover:bg-surface-highest transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-md object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-surface rounded-full" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{tech.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">{tech.specialty} / {tech.bay}</p>
                </div>
              </div>
              <div className="flex gap-12 items-center">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Tarea Actual</p>
                  <p className="text-xs font-medium">{tech.currentTask}</p>
                </div>
                <div className="bg-surface-highest px-4 py-2 rounded flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xl font-bold text-primary">{tech.timer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Alertas Críticas</h2>
          {ALERTS.map(alert => (
            <div key={alert.id} className={cn(
              "p-5 rounded-lg border-l-4",
              alert.type === 'qc' ? "bg-surface-low urgency-glow" : "bg-surface-low border-secondary"
            )}>
              <div className={cn("flex items-center gap-2 mb-2", alert.type === 'qc' ? "text-error" : "text-secondary")}>
                {alert.type === 'qc' ? <AlertTriangle className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{alert.title}</span>
              </div>
              <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">{alert.vehicle}</h3>
              <p className="text-xs text-zinc-400 mb-4">{alert.description}</p>
              {alert.type === 'qc' && (
                <button className="w-full py-2 bg-error/10 text-error text-[10px] font-bold uppercase rounded border border-error/20 hover:bg-error/20 transition-colors">
                  Asignar Inspector QC
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bays */}
      <section>
        <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Uso de Bahías 360</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {BAYS.map(bay => (
            <div key={bay.id} className="bg-surface-low p-4 rounded-lg flex flex-col items-center text-center gap-2 border border-white/5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{bay.name}</span>
              <div className={cn(
                "w-12 h-12 rounded-full border-4 flex items-center justify-center",
                bay.status === 'active' || bay.status === 'full' ? "border-primary/20" : 
                bay.status === 'waiting-parts' ? "border-secondary" :
                bay.status === 'delayed' ? "border-error" : "border-zinc-700"
              )}>
                <span className={cn(
                  "font-bold text-[10px]",
                  bay.status === 'active' || bay.status === 'full' ? "text-primary" : 
                  bay.status === 'waiting-parts' ? "text-secondary" :
                  bay.status === 'delayed' ? "text-error" : "text-zinc-500"
                )}>{bay.efficiency}</span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400 uppercase">
                {bay.status === 'active' ? 'Activa' : 
                 bay.status === 'waiting-parts' ? 'Esperando Partes' :
                 bay.status === 'full' ? 'Llena' :
                 bay.status === 'delayed' ? 'Demorada' : 'Limpieza'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
