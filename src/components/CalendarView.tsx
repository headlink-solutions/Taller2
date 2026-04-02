import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Phone, Wrench, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Appointment } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: new Date(2026, 3, 5).toISOString(), customerPhone: '5512345678', service: 'Afinación', status: 'confirmed' },
    { id: '2', date: new Date(2026, 3, 10).toISOString(), customerPhone: '5587654321', service: 'Frenos', status: 'unconfirmed' },
    { id: '3', date: new Date(2026, 3, 10).toISOString(), customerPhone: '5599887766', service: 'Aceite', status: 'confirmed' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    phone: '',
    service: '',
    date: new Date().toISOString().split('T')[0]
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.phone || !newAppointment.date) return;

    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(newAppointment.date).toISOString(),
      customerPhone: newAppointment.phone,
      service: newAppointment.service || undefined,
      status: 'unconfirmed'
    };

    setAppointments([...appointments, appointment]);
    setShowAddModal(false);
    setNewAppointment({ phone: '', service: '', date: new Date().toISOString().split('T')[0] });
  };

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate.getDate() === day && 
             appDate.getMonth() === month && 
             appDate.getFullYear() === year;
    });
  };

  return (
    <div className="flex flex-col h-full bg-surface-low p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Calendario <span className="text-primary">SOS</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Gestión de Citas y Disponibilidad
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface p-1 rounded-lg border border-white/5">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-high rounded-md transition-colors text-zinc-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-black uppercase tracking-widest min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-surface-high rounded-md transition-colors text-zinc-400">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-md font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Agendar Cita
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-surface border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-surface-high">
          {DAYS.map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 flex-1">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-surface-low/30" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;

            return (
              <div 
                key={day} 
                className={cn(
                  "border-r border-b border-white/5 p-2 min-h-[80px] md:min-h-[120px] transition-colors hover:bg-white/[0.02] flex flex-col",
                  isToday && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "text-xs font-black mb-2",
                  isToday ? "text-primary" : "text-zinc-500"
                )}>
                  {day}
                </span>
                
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                  {dayAppointments.map(app => (
                    <div 
                      key={app.id}
                      className={cn(
                        "text-[8px] md:text-[9px] p-1 rounded font-bold uppercase truncate border",
                        app.status === 'confirmed' 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      )}
                    >
                      {app.customerPhone.slice(-4)} - {app.service || 'Servicio'}
                    </div>
                  ))}
                </div>

                {dayAppointments.length === 0 && (
                  <div className="flex-1 flex items-center justify-center opacity-10">
                    <Check className="w-6 h-6 text-zinc-500" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty cells for next month */}
          {Array.from({ length: (7 - (firstDayOfMonth + daysInMonth) % 7) % 7 }).map((_, i) => (
            <div key={`empty-next-${i}`} className="border-r border-b border-white/5 bg-surface-low/30" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-3 h-3 text-zinc-500 opacity-30" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Libre</span>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tighter">Nueva Cita</h2>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Teléfono del Cliente *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input 
                      type="tel"
                      required
                      placeholder="Ej: 5512345678"
                      value={newAppointment.phone}
                      onChange={e => setNewAppointment({...newAppointment, phone: e.target.value})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Fecha de la Cita *
                  </label>
                  <input 
                    type="date"
                    required
                    value={newAppointment.date}
                    onChange={e => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Servicio (Opcional)
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <select 
                      value={newAppointment.service}
                      onChange={e => setNewAppointment({...newAppointment, service: e.target.value})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none text-white"
                    >
                      <option value="" className="bg-surface-high">Seleccionar paquete...</option>
                      <option value="DETAIL ESSENTIAL" className="bg-surface-high">DETAIL ESSENTIAL</option>
                      <option value="DETAIL FULL RESTORE" className="bg-surface-high">DETAIL FULL RESTORE</option>
                      <option value="PAINT CORRECTION" className="bg-surface-high">PAINT CORRECTION</option>
                      <option value="PAINT CORRECTION PRO" className="bg-surface-high">PAINT CORRECTION PRO</option>
                      <option value="DETAIL CUSTOM" className="bg-surface-high">DETAIL CUSTOM</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-zinc-500 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-lg border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-lg bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Confirmar Cita
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
