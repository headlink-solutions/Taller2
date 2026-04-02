import React, { useState } from 'react';
import { Menu, Bell, LayoutGrid, Search, SlidersHorizontal, Calendar, Package, CarFront, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from './components/Dashboard';
import { Reception } from './components/Reception';
import { ActiveReception, TaskInProgress } from './components/Task';
import { CalendarView } from './components/CalendarView';
import { View } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartReception={() => setCurrentView('active-reception')} />;
      case 'reception':
        return <Reception onStart={() => setCurrentView('active-reception')} />;
      case 'active-reception':
        return <ActiveReception onConfirm={() => setCurrentView('task-in-progress')} />;
      case 'task-in-progress':
        return <TaskInProgress />;
      case 'calendar':
        return <CalendarView />;
      case 'supplies':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
            <Package className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-black uppercase tracking-widest">Suministros</h2>
            <p className="text-sm font-bold uppercase mt-2">Módulo en Desarrollo</p>
          </div>
        );
      default:
        return <Dashboard onStartReception={() => setCurrentView('active-reception')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-on-primary">
      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[200] flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[280px] bg-surface h-full shadow-2xl border-r border-white/5 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter text-primary uppercase">SOS</span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Automotriz</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 mb-4">Navegación Principal</p>
                
                {[ 
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
                  { id: 'active-reception', label: 'Recepción', icon: <CarFront className="w-5 h-5" /> },
                  { id: 'calendar', label: 'Calendario', icon: <Calendar className="w-5 h-5" /> },
                  { id: 'supplies', label: 'Suministros', icon: <Package className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as View);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all",
                      currentView === item.id 
                        ? "bg-primary text-black shadow-[0_0_20px_rgba(63,255,139,0.2)]" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <div className="pt-8">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 mb-4">Avanzado</p>
                  <div className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-widest text-zinc-600 border border-dashed border-white/5 cursor-not-allowed">
                    <Lock className="w-5 h-5 opacity-30" />
                    <span>Próximamente</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-surface-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-black">VB</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white">Victor B.</span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Administrador</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className="bg-background flex justify-between items-center w-full px-6 py-4 sticky top-0 z-[100] border-b border-white/5">
        <div className="flex items-center gap-4">
          <Menu 
            onClick={() => setIsMenuOpen(true)}
            className="w-6 h-6 text-primary cursor-pointer active:scale-95 transition-all" 
          />
          <span className="text-lg font-black tracking-tighter text-primary uppercase font-sans">
            SOS AUTOMOTRIZ
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={cn(
                "font-sans tracking-tight font-bold uppercase text-[10px] transition-all px-2 py-1 rounded",
                currentView === 'dashboard' ? "text-primary" : "text-zinc-500 hover:bg-surface-high"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('active-reception')}
              className={cn(
                "font-sans tracking-tight font-bold uppercase text-[10px] transition-all px-2 py-1 rounded",
                currentView === 'active-reception' ? "text-primary" : "text-zinc-500 hover:bg-surface-high"
              )}
            >
              Recepción
            </button>
            <button 
              onClick={() => setCurrentView('calendar')}
              className={cn(
                "font-sans tracking-tight font-bold uppercase text-[10px] transition-all px-2 py-1 rounded",
                currentView === 'calendar' ? "text-primary" : "text-zinc-500 hover:bg-surface-high"
              )}
            >
              Calendario
            </button>
            <button 
              onClick={() => setCurrentView('supplies')}
              className={cn(
                "font-sans tracking-tight font-bold uppercase text-[10px] transition-all px-2 py-1 rounded",
                currentView === 'supplies' ? "text-primary" : "text-zinc-500 hover:bg-surface-high"
              )}
            >
              Suministros
            </button>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-primary active:scale-95 transition-all cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-background animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {renderView()}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={cn(
            "flex flex-col items-center justify-center rounded-md py-2 px-4 active:opacity-80 transition-all",
            currentView === 'dashboard' ? "text-primary bg-surface-highest" : "text-zinc-500"
          )}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Dashboard</span>
        </button>
        <button 
          onClick={() => setCurrentView('active-reception')}
          className={cn(
            "flex flex-col items-center justify-center rounded-md py-2 px-4 active:opacity-80 transition-all",
            currentView === 'active-reception' ? "text-primary bg-surface-highest" : "text-zinc-500"
          )}
        >
          <CarFront className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Recepción</span>
        </button>
        <button 
          onClick={() => setCurrentView('calendar')}
          className={cn(
            "flex flex-col items-center justify-center rounded-md py-2 px-4 active:opacity-80 transition-all",
            currentView === 'calendar' ? "text-primary bg-surface-highest" : "text-zinc-500"
          )}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Calendario</span>
        </button>
        <button 
          onClick={() => setCurrentView('supplies')}
          className={cn(
            "flex flex-col items-center justify-center rounded-md py-2 px-4 active:opacity-80 transition-all",
            currentView === 'supplies' ? "text-primary bg-surface-highest" : "text-zinc-500"
          )}
        >
          <Package className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Suministros</span>
        </button>
      </nav>

      {/* Floating Bay Switcher (Signature Component) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 p-1.5 rounded-full glass-effect border border-white/10 shadow-2xl z-[90]">
        <button className="px-4 py-2 bg-primary text-on-primary font-bold text-[10px] uppercase rounded-full">Todas las Bahías</button>
        <button className="px-4 py-2 text-zinc-400 hover:text-white font-bold text-[10px] uppercase transition-colors">Reparación General</button>
        <button className="px-4 py-2 text-zinc-400 hover:text-white font-bold text-[10px] uppercase transition-colors">Hojalatería y Pintura</button>
        <button className="px-4 py-2 text-zinc-400 hover:text-white font-bold text-[10px] uppercase transition-colors">Carril Rápido</button>
      </div>
    </div>
  );
}
