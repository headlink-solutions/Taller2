import React, { useState } from 'react';
import { 
  Car, 
  Gauge, 
  Package, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Check, 
  Verified, 
  ArrowRight,
  Info,
  History,
  Settings,
  Wrench,
  TrendingUp,
  ChevronLeft,
  Search,
  Shield,
  Sparkles,
  Disc,
  Target,
  FlaskConical,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  CarFront,
  User,
  Phone,
  Search as SearchIcon
} from 'lucide-react';
import { Button } from './ui/Base';
import { cn } from '@/src/lib/utils';

// Mock local database for demonstration since Firebase was declined
const MOCK_CUSTOMERS: Record<string, { fullName: string; lastService: string; lastServiceDate: string }> = {
  '6641234567': {
    fullName: 'JUAN PEREZ',
    lastService: 'PAINT CORRECTION',
    lastServiceDate: '2024-03-15'
  },
  '6649876543': {
    fullName: 'MARIA GARCIA',
    lastService: 'DETAIL FULL RESTORE',
    lastServiceDate: '2024-02-20'
  }
};

const VEHICLE_CATALOG = {
  'BMW': ['M4 Competition', 'X5 M-Sport', '330i Sedan', 'i4 Electric'],
  'Ford': ['F-150 Lightning', 'Mustang GT', 'Explorer ST', 'Bronco Raptor'],
  'Porsche': ['911 GT3', 'Cayenne Turbo', 'Taycan GTS', 'Macan S'],
  'Tesla': ['Model 3 Performance', 'Model Y Long Range', 'Model S Plaid', 'Model X'],
  'Toyota': ['Tacoma TRD Pro', 'Camry XSE', 'RAV4 Hybrid', 'Supra GR'],
  'Audi': ['RS6 Avant', 'Q8 e-tron', 'A4 S-Line', 'R8 V10'],
  'Mercedes-Benz': ['AMG G63', 'S-Class 580', 'EQS Sedan', 'C-Class Coupe']
};

const CarFrontIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 13.5c0-.3-.1-.6-.2-.9l-1.5-4.5c-.3-.7-1-1.1-1.8-1.1H6.5c-.8 0-1.5.4-1.8 1.1l-1.5 4.5c-.1.3-.2.6-.2.9v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h10v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4zM6.5 15c-.8 0-1.5-.7-1.5-1.5S5.7 12 6.5 12 8 12.7 8 13.5 7.3 15 6.5 15zm11 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5,1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM5.2 11l1-3h11.6l1 3H5.2z" />
  </svg>
);

export const ActiveReception = ({ onConfirm }: { onConfirm: () => void }) => {
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [selectionStep, setSelectionStep] = useState<'start' | 'make' | 'custom-make' | 'model' | 'custom-model' | 'completed'>('start');
  const [photos, setPhotos] = useState<string[]>([
    'https://picsum.photos/seed/odometer/400/400',
    'https://picsum.photos/seed/engine/400/400'
  ]);

  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [lastServiceInfo, setLastServiceInfo] = useState<{ name: string; date: any } | null>(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value.replace(/\D/g, '');
    setCustomerPhone(phone);

    if (phone.length >= 10) {
      setIsSearchingCustomer(true);
      // Simulate network delay
      setTimeout(() => {
        const customer = MOCK_CUSTOMERS[phone];
        if (customer) {
          setCustomerName(customer.fullName);
          setLastServiceInfo({
            name: customer.lastService,
            date: { toDate: () => new Date(customer.lastServiceDate) }
          });
        } else {
          setLastServiceInfo(null);
        }
        setIsSearchingCustomer(false);
      }, 600);
    }
  };

  const saveCustomerData = () => {
    if (!customerPhone || !customerName) return;
    // In a real app without Firebase, this would go to a different backend
    // For now, we update our local mock for the current session
    MOCK_CUSTOMERS[customerPhone] = {
      fullName: customerName.toUpperCase(),
      lastService: selectedPackage ? selectedPackage.toUpperCase() : 'CONSULTA',
      lastServiceDate: new Date().toISOString().split('T')[0]
    };
    console.log("Customer data saved locally:", MOCK_CUSTOMERS[customerPhone]);
  };

  const handleConfirm = () => {
    saveCustomerData();
    const code = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(code);
    setShowOrderSummary(true);
  };

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [expandedAddOns, setExpandedAddOns] = useState<string | null>(null);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAddPhoto = () => {
    const newPhoto = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setPhotos([...photos, newPhoto]);
  };

  const handleStartSelection = () => {
    setSelectionStep('make');
  };

  const handleSelectMake = (make: string) => {
    if (make === 'OTRO') {
      setSelectionStep('custom-make');
    } else {
      setSelectedMake(make);
      setSelectionStep('model');
    }
  };

  const handleCustomMakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMake.trim()) {
      setSelectedMake(customMake.toUpperCase());
      setSelectionStep('custom-model');
    }
  };

  const handleSelectModel = (model: string) => {
    if (model === 'OTRO') {
      setSelectionStep('custom-model');
    } else {
      setSelectedModel(model);
      setSelectionStep('completed');
    }
  };

  const handleCustomModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customModel.trim()) {
      setSelectedModel(customModel.toUpperCase());
      setSelectionStep('completed');
    }
  };

  const resetSelection = () => {
    setSelectionStep('start');
    setSelectedMake(null);
    setSelectedModel(null);
    setCustomMake('');
    setCustomModel('');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-primary font-bold text-[10px] tracking-widest uppercase">RECEPCIÓN ACTIVA</span>
        </div>

        {selectionStep === 'start' && (
          <button 
            onClick={handleStartSelection}
            className="w-full bg-surface-high border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:bg-surface-highest transition-all active:scale-95 group"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <CarFrontIcon className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Seleccionar Marca</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Toque para abrir el catálogo</p>
            </div>
          </button>
        )}

        {selectionStep === 'make' && (
          <div className="bg-surface-high rounded-lg p-6 border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectionStep('start')} className="p-1 hover:bg-surface-highest rounded transition-colors">
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </button>
                <Search className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-tight">Todas las Marcas</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(VEHICLE_CATALOG).map(make => (
                  <button
                    key={make}
                    onClick={() => handleSelectMake(make)}
                    className="bg-surface-highest py-4 rounded-md text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                  >
                    {make}
                  </button>
                ))}
                <button
                  onClick={() => handleSelectMake('OTRO')}
                  className="bg-surface-highest py-4 rounded-md text-xs font-bold uppercase border border-dashed border-primary/30 text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                >
                  OTRO +
                </button>
              </div>
            </div>
          </div>
        )}

        {selectionStep === 'custom-make' && (
          <div className="bg-surface-high rounded-lg p-6 border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectionStep('make')} className="p-1 hover:bg-surface-highest rounded transition-colors">
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </button>
                <h3 className="text-sm font-black uppercase tracking-tight">Marca Personalizada</h3>
              </div>
              <form onSubmit={handleCustomMakeSubmit} className="space-y-4">
                <input 
                  autoFocus
                  type="text"
                  value={customMake}
                  onChange={(e) => setCustomMake(e.target.value)}
                  placeholder="ESCRIBA LA MARCA..."
                  className="w-full bg-surface-highest border-none rounded-md p-4 text-lg font-black uppercase placeholder:text-zinc-700 focus:ring-primary"
                />
                <Button type="submit" className="w-full py-4 font-black uppercase tracking-widest">
                  Continuar
                </Button>
              </form>
            </div>
          </div>
        )}

        {selectionStep === 'model' && selectedMake && (
          <div className="bg-surface-high rounded-lg p-6 border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectionStep('make')} className="p-1 hover:bg-surface-highest rounded transition-colors">
                    <ChevronLeft className="w-4 h-4 text-primary" />
                  </button>
                  <h3 className="text-sm font-black uppercase tracking-tight">Modelos {selectedMake}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {VEHICLE_CATALOG[selectedMake as keyof typeof VEHICLE_CATALOG]?.map(model => (
                  <button
                    key={model}
                    onClick={() => handleSelectModel(model)}
                    className="bg-surface-highest py-4 px-6 rounded-md text-sm font-bold uppercase text-left flex justify-between items-center hover:bg-primary hover:text-on-primary transition-all active:scale-95 group"
                  >
                    {model}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <button
                  onClick={() => handleSelectModel('OTRO')}
                  className="bg-surface-highest py-4 px-6 rounded-md text-sm font-bold uppercase text-left border border-dashed border-primary/30 text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 group"
                >
                  OTRO MODELO +
                </button>
              </div>
            </div>
          </div>
        )}

        {selectionStep === 'custom-model' && (
          <div className="bg-surface-high rounded-lg p-6 border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectionStep(VEHICLE_CATALOG[selectedMake as keyof typeof VEHICLE_CATALOG] ? 'model' : 'custom-make')} className="p-1 hover:bg-surface-highest rounded transition-colors">
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </button>
                <h3 className="text-sm font-black uppercase tracking-tight">Modelo para {selectedMake}</h3>
              </div>
              <form onSubmit={handleCustomModelSubmit} className="space-y-4">
                <input 
                  autoFocus
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="ESCRIBA EL MODELO..."
                  className="w-full bg-surface-highest border-none rounded-md p-4 text-lg font-black uppercase placeholder:text-zinc-700 focus:ring-primary"
                />
                <Button type="submit" className="w-full py-4 font-black uppercase tracking-widest">
                  Finalizar Selección
                </Button>
              </form>
            </div>
          </div>
        )}

        {selectionStep === 'completed' && (
          <div className="bg-surface-high rounded-lg p-6 relative overflow-hidden border-l-4 border-primary group animate-in zoom-in-95 duration-300">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-black text-white leading-none tracking-tighter uppercase">
                  {selectedMake} {selectedModel}
                </h2>
                <button 
                  onClick={resetSelection}
                  className="text-[10px] font-bold text-primary uppercase border-b border-primary/30 hover:border-primary transition-all"
                >
                  Cambiar
                </button>
              </div>
              <p className="text-zinc-400 font-medium mt-1 uppercase">CONFIGURACIÓN PERSONALIZADA • VERIFICADO</p>
              <div className="flex gap-2 mt-4">
                <span className="bg-surface-highest px-3 py-1 rounded-sm text-[10px] font-bold text-primary uppercase">Manual-Entry</span>
                <span className="bg-surface-highest px-3 py-1 rounded-sm text-[10px] font-bold text-secondary uppercase">Nuevo Registro</span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CarFrontIcon className="w-[120px] h-[120px]" />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">PAQUETES DE SERVICIO</h3>
        <div className="space-y-3">
          {/* Detail Essential */}
          <button 
            onClick={() => setSelectedPackage('essential')}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all group relative overflow-hidden",
              selectedPackage === 'essential' ? "bg-surface-highest border-primary" : "bg-surface-high border-transparent hover:border-white/10"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#3fff8b]" />
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white">DETAIL ESSENTIAL</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Mantenimiento Completo</p>
                </div>
              </div>
              {selectedPackage === 'essential' && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </div>
            <div className={cn("mt-4 space-y-2 overflow-hidden transition-all duration-500", selectedPackage === 'essential' ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              <div className="text-[10px] text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300">INCLUYE:</p>
                <ul className="list-disc list-inside pl-1">
                  <li>Limpieza interior básica (aspirado, plásticos, cristales)</li>
                  <li>Lavado exterior detallado (emblemas, rines sin desmontar)</li>
                  <li>Secado técnico</li>
                  <li>Protección básica (cera líquida)</li>
                </ul>
                <p className="mt-2 italic">Objetivo: Mantener el vehículo limpio y protegido periódicamente.</p>
              </div>
            </div>
          </button>

          {/* Detail Full Restore */}
          <button 
            onClick={() => setSelectedPackage('full-restore')}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all group relative overflow-hidden",
              selectedPackage === 'full-restore' ? "bg-surface-highest border-blue-500" : "bg-surface-high border-transparent hover:border-white/10"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white">DETAIL FULL RESTORE</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Detallado Completo</p>
                </div>
              </div>
              {selectedPackage === 'full-restore' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
            </div>
            <div className={cn("mt-4 space-y-2 overflow-hidden transition-all duration-500", selectedPackage === 'full-restore' ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              <div className="text-[10px] text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300">INCLUYE:</p>
                <ul className="list-disc list-inside pl-1">
                  <li>Limpieza interior profunda (desmontaje de asientos)</li>
                  <li>Limpieza de cielo y tapicerías</li>
                  <li>Detallado exterior profundo</li>
                  <li>Desmontaje y limpieza completa de rines</li>
                  <li>Limpieza de tolvas y calipers</li>
                  <li>Protección cerámica (duración media)</li>
                </ul>
                <p className="mt-2 italic">Objetivo: Restaurar la estética general del vehículo.</p>
              </div>
            </div>
          </button>

          {/* Paint Correction */}
          <button 
            onClick={() => setSelectedPackage('paint-correction')}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all group relative overflow-hidden",
              selectedPackage === 'paint-correction' ? "bg-surface-highest border-error" : "bg-surface-high border-transparent hover:border-white/10"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white">PAINT CORRECTION</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Corrección de Pintura</p>
                </div>
              </div>
              {selectedPackage === 'paint-correction' && <CheckCircle2 className="w-5 h-5 text-error" />}
            </div>
            <div className={cn("mt-4 space-y-2 overflow-hidden transition-all duration-500", selectedPackage === 'paint-correction' ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              <div className="text-[10px] text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300">INCLUYE:</p>
                <ul className="list-disc list-inside pl-1">
                  <li>Lavado y preparación de superficie</li>
                  <li>Descontaminación de pintura</li>
                  <li>Pulido de carrocería según diagnóstico</li>
                  <li>Pulido de superficies negro piano</li>
                  <li>Protección cerámica</li>
                </ul>
                <p className="mt-2 italic">Objetivo: Corregir defectos visuales y recuperar brillo.</p>
              </div>
            </div>
          </button>

          {/* Paint Correction Pro */}
          <button 
            onClick={() => setSelectedPackage('paint-correction-pro')}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 transition-all group relative overflow-hidden",
              selectedPackage === 'paint-correction-pro' ? "bg-surface-highest border-zinc-500" : "bg-surface-high border-transparent hover:border-white/10"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-black border border-white/20" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white">PAINT CORRECTION PRO</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Corrección Premium</p>
                </div>
              </div>
              {selectedPackage === 'paint-correction-pro' && <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <div className={cn("mt-4 space-y-2 overflow-hidden transition-all duration-500", selectedPackage === 'paint-correction-pro' ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              <div className="text-[10px] text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300">INCLUYE:</p>
                <ul className="list-disc list-inside pl-1">
                  <li>Todo lo del paquete anterior</li>
                  <li>Detallado profundo de rines</li>
                  <li>Pulido de rines (si aplica)</li>
                  <li>Máximo nivel de corrección estética</li>
                  <li>Protección cerámica de larga duración</li>
                </ul>
                <p className="mt-2 italic">Objetivo: Lograr el máximo nivel de corrección y acabado.</p>
              </div>
            </div>
          </button>

          {/* Detail Custom */}
          <button 
            onClick={() => setSelectedPackage('custom')}
            className={cn(
              "w-full text-left p-4 rounded-lg border-2 border-dashed transition-all group relative overflow-hidden",
              selectedPackage === 'custom' ? "bg-surface-highest border-secondary" : "bg-surface-high border-white/10 hover:border-secondary/50"
            )}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-md flex items-center justify-center">
                  <Settings className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white">DETAIL CUSTOM</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Servicio a Medida</p>
                </div>
              </div>
              {selectedPackage === 'custom' && <CheckCircle2 className="w-5 h-5 text-secondary" />}
            </div>
            <div className={cn("mt-4 space-y-2 overflow-hidden transition-all duration-500", selectedPackage === 'custom' ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              <div className="text-[10px] text-zinc-400 space-y-2">
                <p>Se construye el servicio según las necesidades específicas del cliente.</p>
                <div className="bg-black/20 p-2 rounded border border-white/5 space-y-1">
                  <p className="font-bold text-zinc-300">REGLAS:</p>
                  <p>• Cotización individual por proceso</p>
                  <p>• Transparencia total en costos</p>
                  <p>• No se duplican costos por combinación</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Add-ons Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 px-1">
            <PlusCircle className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">ADD-ONS (EXTRAS)</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { id: 'interior', label: 'INTERIOR', icon: <Target className="w-4 h-4" />, items: ['Pulido negro piano interior', 'Limpieza profunda tapicerías', 'Limpieza profunda alfombra', 'Restauración plásticos'] },
              { id: 'wheels', label: 'RINES Y ZONAS BAJAS', icon: <Disc className="w-4 h-4" />, items: ['Limpieza profunda rines', 'Pulido de rines', 'Detallado de tolvas'] },
              { id: 'exterior', label: 'EXTERIOR', icon: <Sparkles className="w-4 h-4" />, items: ['Restauración plásticos ext.', 'Restauración de faros', 'Pulido parrilla negro piano'] },
              { id: 'protection', label: 'PROTECCIÓN', icon: <FlaskConical className="w-4 h-4" />, items: ['Cerámica avanzada (Upgrade)', 'Protección de interiores'] },
              { id: 'physical', label: 'PROTECCIÓN FÍSICA', icon: <Shield className="w-4 h-4" />, items: ['Protección faros (Película)', 'Protección zonas desgaste'] },
              { id: 'functional', label: 'FUNCIONAL', icon: <Wrench className="w-4 h-4" />, items: ['Lavado de motor', 'Pulido de cristales', 'Ajuste de piezas'] },
            ].map((cat) => (
              <div key={cat.id} className="bg-surface-high rounded-lg overflow-hidden border border-white/5">
                <button 
                  onClick={() => setExpandedAddOns(expandedAddOns === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-surface-highest transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{cat.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                  </div>
                  {expandedAddOns === cat.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-300 bg-black/10",
                  expandedAddOns === cat.id ? "max-h-96" : "max-h-0"
                )}>
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleAddOn(item)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded text-left transition-all",
                          selectedAddOns.includes(item) ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-zinc-400"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase">{item}</span>
                        {selectedAddOns.includes(item) ? <Check className="w-3 h-3" /> : <PlusCircle className="w-3 h-3 opacity-30" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">DOCUMENTACIÓN VISUAL</h3>
          <span className="text-zinc-500 text-[10px] font-bold uppercase">{photos.length} FOTOS</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="bg-surface-highest aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden group animate-in zoom-in-95 duration-300">
              <img 
                src={photo} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                alt={`Photo ${index}`}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          ))}
          <button 
            onClick={handleAddPhoto}
            className="bg-surface-low aspect-square rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-surface-high active:scale-95 transition-all group"
          >
            <Camera className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold uppercase text-zinc-500 group-hover:text-primary transition-colors">AGREGAR FOTO</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">INFORMACIÓN DEL CLIENTE</h3>
        <div className="bg-surface-high p-6 rounded-lg border border-white/5 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="tel"
                value={customerPhone}
                onChange={handlePhoneChange}
                placeholder="664 000 0000"
                className="w-full bg-surface-highest border-none rounded-md py-4 pl-12 pr-4 text-sm font-bold focus:ring-primary placeholder:text-zinc-700"
              />
              {isSearchingCustomer && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="NOMBRE DEL CLIENTE"
                className="w-full bg-surface-highest border-none rounded-md py-4 pl-12 pr-4 text-sm font-bold uppercase focus:ring-primary placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button 
            onClick={() => setWantsInvoice(!wantsInvoice)}
            className="flex items-center gap-3 p-4 bg-surface-highest rounded-md border border-white/5 hover:bg-white/5 transition-all w-full"
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
              wantsInvoice ? "bg-primary border-primary" : "border-zinc-700"
            )}>
              {wantsInvoice && <Check className="w-3 h-3 text-black font-bold" />}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">¿REQUIERE FACTURA?</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase">SE AGREGARÁ A LOS DOCUMENTOS DE IMPRESIÓN</span>
            </div>
          </button>

          {lastServiceInfo && (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <History className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Último Servicio Detectado</p>
                  <p className="text-xs font-bold text-white mt-1 uppercase">{lastServiceInfo.name}</p>
                  <p className="text-[9px] text-zinc-500 font-medium mt-0.5 uppercase">
                    {lastServiceInfo.date?.toDate ? lastServiceInfo.date.toDate().toLocaleDateString() : 'FECHA RECIENTE'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="bg-surface-low h-32 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase text-zinc-600">FIRME AQUÍ</span>
          <div className="absolute bottom-2 right-4 flex items-center gap-1">
            <Verified className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-bold text-primary uppercase">FIRMA DIGITAL SEGURA</span>
          </div>
        </div>
      </section>

      <section className="pt-6">
        <Button 
          onClick={handleConfirm}
          className="w-full h-16 rounded-md font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(63,255,139,0.2)]"
        >
          CONCLUIR RECEPCIÓN
          <ArrowRight className="w-6 h-6" />
        </Button>
      </section>

      {showOrderSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-surface-low w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-primary p-8 text-center">
              <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">RECEPCIÓN CONCLUIDA</h2>
              <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest mt-1">ORDEN DE SERVICIO GENERADA</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">CÓDIGO DE PAGO</p>
                <p className="text-4xl font-black text-white tracking-tighter">{orderCode}</p>
                <p className="text-[9px] font-medium text-zinc-600 uppercase">Mencione este código en caja para proceder</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2">DOCUMENTOS A IMPRIMIR</h4>
                <div className="space-y-2">
                  {[
                    { id: 1, name: 'HOJA DE PROCESO', mandatory: true },
                    { id: 2, name: 'NOTA DE VENTA', mandatory: true },
                    { id: 3, name: 'HOJA DE CUIDADOS', mandatory: true },
                    { id: 4, name: 'FACTURA ELECTRÓNICA', mandatory: false, active: wantsInvoice },
                  ].map((doc) => (
                    <div 
                      key={doc.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        (doc.mandatory || doc.active) 
                          ? "bg-primary/5 border-primary/20 text-primary" 
                          : "bg-white/5 border-transparent text-zinc-600 opacity-40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black opacity-50">#{doc.id}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{doc.name}</span>
                      </div>
                      {(doc.mandatory || doc.active) && <Check className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={onConfirm}
                className="w-full py-6 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20"
              >
                FINALIZAR Y SALIR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TaskInProgress = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-surface-low p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">ASIGNACIÓN ACTUAL</span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-1">2023 FORD F-150 LIGHTNING</h2>
            <p className="text-zinc-500 text-sm mt-1">OT #88412 • Bahía 04 • Servicio: Inspección de Batería de Alto Voltaje</p>
          </div>
          <div className="bg-surface-highest px-4 py-2 rounded-md flex items-center gap-3">
            <Wrench className="w-5 h-5 text-secondary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">TÉCNICO</span>
              <span className="text-sm font-bold">MARCUS R.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-high p-8 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-4">CRONÓMETRO DE TAREA</span>
            <div className="text-7xl font-black tracking-tighter text-white tabular-nums mb-6">
              01:42:<span className="text-primary">18</span>
            </div>
            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1 py-4">PAUSA</Button>
              <Button variant="error" className="flex-1 py-4">DETENER</Button>
            </div>
          </div>

          <div className="bg-surface-high p-8 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">SEGUIMIENTO DE EFICIENCIA</span>
              <div className="mt-6 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">TIEMPO ESTIMADO</p>
                    <p className="text-2xl font-bold">02:30:00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-[10px] uppercase font-bold">TIEMPO RESTANTE</p>
                    <p className="text-2xl font-bold text-primary">00:47:42</p>
                  </div>
                </div>
                <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[68%]" />
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">NIVEL DE EFICIENCIA: 112% (OPTIMAL)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-low rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold uppercase tracking-tight">INSTRUCCIONES DE SERVICIO</h3>
            <Button className="px-4 py-2 rounded-md font-bold text-[10px]">
              ESCANEAR REFACCIONES
            </Button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm leading-relaxed">
                1. Desconecte la batería auxiliar de 12V antes de trabajar en el sistema de alto voltaje.<br />
                2. Inspeccione todas las conexiones de las mangueras de gestión térmica para detectar refrigerante cristalizado.<br />
                3. Verifique las especificaciones de torque en los pernos de montaje de la batería (18Nm).
              </p>
              <div className="flex items-start gap-4 p-4 bg-zinc-900 rounded-lg border-l-4 border-secondary">
                <Info className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-[10px] text-secondary font-medium uppercase leading-tight">Alerta de Seguridad: Asegúrese de usar herramientas aisladas para todos los pasos relacionados con la carcasa de la batería de HV.</p>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">ESTADO DE REFACCIONES</span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-highest rounded">
                  <span className="text-xs font-medium">Junta de Sellado HV (KT-99)</span>
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded">LISTO</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-highest rounded">
                  <span className="text-xs font-medium">Aditivo de Refrigerante Azul (1L)</span>
                  <span className="text-[10px] font-black text-secondary uppercase bg-secondary/10 px-2 py-1 rounded">EN CAMINO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-high p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold uppercase tracking-tight">LISTA DE VERIFICACIÓN</h3>
          </div>
          <div className="space-y-4">
            {['Inspección visual de carcasa HV', 'Prueba de resistencia (Fase A-B)', 'Registro de verificación de torque', 'Actualización firmware BMS v2.1'].map((item, i) => (
              <label key={i} className="flex items-center p-4 bg-surface-highest/50 rounded-lg cursor-pointer border border-transparent hover:border-primary/30 transition-colors">
                <input type="checkbox" defaultChecked={i === 0} className="w-5 h-5 rounded border-zinc-700 bg-surface text-primary focus:ring-primary" />
                <span className="ml-4 text-sm font-medium">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-surface-low p-6 rounded-xl border-t-4 border-secondary">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold uppercase tracking-tight">CARGA DE HALLAZGOS</h3>
            <span className="text-[10px] text-zinc-500 font-black">2 / 5 ESPACIOS</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="aspect-square bg-surface-highest rounded-lg overflow-hidden relative">
              <img src="https://picsum.photos/seed/ev1/400/400" className="w-full h-full object-cover" alt="Evidence 1" />
            </div>
            <div className="aspect-square bg-surface-highest rounded-lg overflow-hidden relative">
              <img src="https://picsum.photos/seed/ev2/400/400" className="w-full h-full object-cover" alt="Evidence 2" />
            </div>
            <button className="aspect-square border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-surface-highest transition-colors">
              <Camera className="w-5 h-5 text-secondary" />
              <span className="text-[10px] font-bold uppercase">FOTO</span>
            </button>
            <button className="aspect-square border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-surface-highest transition-colors">
              <History className="w-5 h-5 text-secondary" />
              <span className="text-[10px] font-bold uppercase">VIDEO</span>
            </button>
          </div>
          <textarea 
            className="w-full bg-surface-highest border-none rounded-md p-4 text-sm placeholder:text-zinc-600 focus:ring-primary min-h-[100px]" 
            placeholder="Agregar notas del técnico..."
          />
        </div>
      </div>
    </div>
  );
};
