import React from 'react';
import { Camera, Flashlight, Badge, Pin, ChevronRight, Car, Truck, Settings2 } from 'lucide-react';
import { Button } from './ui/Base';
import { cn } from '@/src/lib/utils';

const RECENT_HISTORY = [
  { id: '1', vehicle: '2021 Porsche 911 GT3', plate: 'PSH-9110', time: 'Hace 12 min', icon: <Car className="text-secondary" /> },
  { id: '2', vehicle: '2023 Ford F-150 Raptor', plate: 'RPT-450X', time: 'Hace 45 min', icon: <Truck className="text-primary" /> },
  { id: '3', vehicle: 'Vehículo Desconocido', plate: 'VIN Parcial Detectado', time: 'Hace 1 h', icon: <Settings2 className="text-error" />, opacity: true },
];

export const Reception = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-7 space-y-8">
        <div className="space-y-2">
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase">Recepción Digital</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">Entrada de Vehículo</h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Placa (Opcional)</label>
            <div className="bg-surface-highest flex items-center px-4 py-4 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
              <input 
                className="bg-transparent border-none focus:ring-0 text-xl font-black uppercase tracking-widest w-full placeholder:text-zinc-700" 
                placeholder="ABC-1234"
              />
              <Badge className="w-5 h-5 text-zinc-700" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">VIN Completo (Opcional)</label>
            <div className="bg-surface-highest flex items-center px-4 py-4 rounded-lg border-b-2 border-transparent focus-within:border-primary transition-all">
              <input 
                className="bg-transparent border-none focus:ring-0 text-xl font-black uppercase tracking-widest w-full placeholder:text-zinc-700" 
                placeholder="CÓDIGO DE 17 DÍGITOS"
              />
              <Pin className="w-5 h-5 text-zinc-700" />
            </div>
          </div>
        </div>

        <Button 
          onClick={onStart}
          className="w-full py-6 rounded-lg font-black uppercase text-lg tracking-widest shadow-xl shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
        >
          Iniciar Recepción
          <ChevronRight className="w-6 h-6" />
        </Button>
      </section>

      <aside className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Identificaciones Recientes</h3>
            <button className="text-[10px] font-bold uppercase text-primary border-b border-primary/30">Ver Registro</button>
          </div>
          <div className="space-y-3">
            {RECENT_HISTORY.map(item => (
              <div key={item.id} className={cn(
                "bg-surface-high p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-surface-highest transition-colors",
                item.opacity && "opacity-60"
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-highest rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase">{item.vehicle}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Placa: {item.plate} • {item.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
