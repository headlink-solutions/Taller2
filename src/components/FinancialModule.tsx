import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  ShoppingBag, 
  Box, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  ChevronRight, 
  DollarSign, 
  PieChart, 
  History,
  X,
  CreditCard,
  FileText,
  AlertCircle,
  CalendarDays,
  Target,
  Zap,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  Partner, 
  Purchase, 
  Asset,
  Appointment
} from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Appointments for Viability
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), customerPhone: '555-0101', service: 'Ceramic Coating Gold', status: 'confirmed' },
  { id: '2', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), customerPhone: '555-0102', service: 'Full Paint Correction', status: 'confirmed' },
  { id: '3', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), customerPhone: '555-0103', service: 'Interior Detail Premium', status: 'confirmed' },
  { id: '4', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), customerPhone: '555-0104', service: 'Ceramic Coating Silver', status: 'confirmed' },
];

const SERVICE_PRICES: Record<string, number> = {
  'Ceramic Coating Gold': 15000,
  'Full Paint Correction': 8000,
  'Interior Detail Premium': 3500,
  'Ceramic Coating Silver': 9500,
};

// Mock Initial Data
const INITIAL_PARTNERS: Partner[] = [
  { 
    id: '1', 
    name: 'Socio A', 
    type: 'investor', 
    participationPercentage: 25, 
    status: 'active', 
    entryDate: '2024-01-01', 
    totalCashContribution: 5000, 
    totalReinvestmentContribution: 2000, 
    totalWithdrawals: 500, 
    accumulatedCapital: 6500 
  },
  { 
    id: '2', 
    name: 'Socio B', 
    type: 'investor', 
    participationPercentage: 25, 
    status: 'active', 
    entryDate: '2024-01-01', 
    totalCashContribution: 5000, 
    totalReinvestmentContribution: 2000, 
    totalWithdrawals: 500, 
    accumulatedCapital: 6500 
  },
  { 
    id: '3', 
    name: 'Socio C', 
    type: 'investor', 
    participationPercentage: 25, 
    status: 'active', 
    entryDate: '2024-01-01', 
    totalCashContribution: 5000, 
    totalReinvestmentContribution: 2000, 
    totalWithdrawals: 500, 
    accumulatedCapital: 6500 
  },
  { 
    id: '4', 
    name: 'Socio D', 
    type: 'investor', 
    participationPercentage: 25, 
    status: 'active', 
    entryDate: '2024-01-01', 
    totalCashContribution: 5000, 
    totalReinvestmentContribution: 2000, 
    totalWithdrawals: 500, 
    accumulatedCapital: 6500 
  }
];

const INITIAL_PURCHASES: Purchase[] = [
  { id: 'p1', date: '2024-02-15', concept: 'Pulidora Rotativa Rupes', category: 'equipo', movementType: 'activo', amount: 8500, paidWith: 'reinversion', responsibleId: '1' },
  { id: 'p2', date: '2024-03-01', concept: 'Químicos Gyeon Q2', category: 'químico', movementType: 'consumible', amount: 2400, paidWith: 'efectivo_caja', responsibleId: '2' },
];

const INITIAL_ASSETS: Asset[] = [
  { id: 'a1', purchaseId: 'p1', name: 'Pulidora Rotativa Rupes', category: 'Equipo Pulido', purchaseDate: '2024-02-15', originalValue: 8500, currentEstimatedValue: 7800, status: 'active', location: 'Bahía 1', responsibleId: '1' },
];

type FinanceSubView = 'dashboard' | 'partners' | 'purchases' | 'assets' | 'partner-detail' | 'liquidation' | 'viability' | 'expenses';

export const FinancialModule: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<FinanceSubView>('dashboard');
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showPurchaseDetailModal, setShowPurchaseDetailModal] = useState(false);
  const [showInvestmentFundModal, setShowInvestmentFundModal] = useState(false);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState<number>(0);
  const [investmentFundAmount, setInvestmentFundAmount] = useState<number>(0);
  const [partnerPayments, setPartnerPayments] = useState<Record<string, number>>({});
  const [newPurchasePartnerContributions, setNewPurchasePartnerContributions] = useState<Record<string, number>>({});
  const [investmentFundContributions, setInvestmentFundContributions] = useState<Record<string, number>>({});
  
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '',
    type: 'investor',
    participationPercentage: 0,
    status: 'active',
    entryDate: new Date().toISOString().split('T')[0],
    totalCashContribution: 0,
    totalReinvestmentContribution: 0,
    totalWithdrawals: 0,
    accumulatedCapital: 0
  });

  const [newPurchase, setNewPurchase] = useState<Partial<Purchase>>({
    date: new Date().toISOString().split('T')[0],
    category: 'herramienta',
    movementType: 'gasto_operativo',
    paidWith: 'efectivo_caja',
    isInstallments: false,
    installmentsCount: 1,
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const partner: Partner = {
      ...newPartner as Partner,
      id: Math.random().toString(36).substr(2, 9),
      accumulatedCapital: newPartner.type === 'investor' ? (newPartner.totalCashContribution || 0) : 0,
      totalCashContribution: newPartner.type === 'investor' ? (newPartner.totalCashContribution || 0) : 0,
      participationPercentage: newPartner.type === 'investor' ? (newPartner.participationPercentage || 0) : 0
    };
    setPartners([...partners, partner]);
    setShowPartnerModal(false);
    setNewPartner({
      name: '',
      type: 'investor',
      participationPercentage: 0,
      status: 'active',
      entryDate: new Date().toISOString().split('T')[0],
      totalCashContribution: 0,
      totalReinvestmentContribution: 0,
      totalWithdrawals: 0,
      accumulatedCapital: 0
    });
  };

  const handleDeletePurchase = () => {
    if (itemToDeleteId) {
      setPurchases(purchases.filter(p => p.id !== itemToDeleteId));
      setAssets(assets.filter(a => a.purchaseId !== itemToDeleteId));
      setItemToDeleteId(null);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleRegisterPayment = (purchaseId: string, customAmount?: number, partnerContributions?: Record<string, number>) => {
    // If we have partner contributions, update partner capital
    if (partnerContributions) {
      setPartners(partners.map(p => {
        const contribution = partnerContributions[p.id] || 0;
        if (contribution > 0) {
          return {
            ...p,
            totalCashContribution: (p.totalCashContribution || 0) + contribution,
            accumulatedCapital: (p.accumulatedCapital || 0) + contribution
          };
        }
        return p;
      }));
    }

    setPurchases(purchases.map(p => {
      if (p.id === purchaseId) {
        const amountToPay = customAmount || (p.isInstallments ? (p.installmentAmount || (p.amount / (p.installmentsCount || 1))) : p.amount);
        
        // Merge contributions into the purchase record
        const mergedContributions = { ...p.partnerContributions };
        if (partnerContributions) {
          Object.entries(partnerContributions).forEach(([id, val]) => {
            mergedContributions[id] = (mergedContributions[id] || 0) + val;
          });
        }

        if (p.isInstallments) {
          const installmentVal = p.installmentAmount || (p.amount / (p.installmentsCount || 1));
          const monthsCovered = Math.floor(amountToPay / installmentVal);
          const installmentsPaid = (p.installmentsPaid || 0) + monthsCovered;
          const isFullyPaid = installmentsPaid >= (p.installmentsCount || 1);
          
          // Generate next due date (jump by months covered)
          const currentDueDate = new Date(p.dueDate || p.date);
          const nextDueDate = new Date(currentDueDate.setMonth(currentDueDate.getMonth() + monthsCovered)).toISOString().split('T')[0];

          return {
            ...p,
            installmentsPaid,
            dueDate: isFullyPaid ? undefined : nextDueDate,
            paidWith: isFullyPaid ? 'efectivo_caja' : p.paidWith,
            partnerContributions: mergedContributions
          };
        } else {
          // Regular credit purchase
          return {
            ...p,
            paidWith: 'efectivo_caja',
            dueDate: undefined,
            partnerContributions: mergedContributions
          };
        }
      }
      return p;
    }));
    setAdvancePaymentAmount(0);
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const purchase: Purchase = {
      ...newPurchase as Purchase,
      id: Math.random().toString(36).substr(2, 9),
      responsibleId: '1', // Current user
      partnerContributions: newPurchase.paidWith === 'aportacion_directa' ? newPurchasePartnerContributions : undefined
    };

    if (purchase.isInstallments) {
      purchase.installmentAmount = purchase.amount / (purchase.installmentsCount || 1);
      purchase.installmentsPaid = 0;
    }

    // Handle Direct Partner Contribution logic
    if (purchase.paidWith === 'aportacion_directa') {
      setPartners(prev => prev.map(p => {
        const contribution = newPurchasePartnerContributions[p.id] || 0;
        if (contribution > 0) {
          return {
            ...p,
            totalCashContribution: (p.totalCashContribution || 0) + contribution,
            accumulatedCapital: (p.accumulatedCapital || 0) + contribution
          };
        }
        return p;
      }));
    }

    setPurchases([purchase, ...purchases]);
    
    if (purchase.movementType === 'activo') {
      const asset: Asset = {
        id: 'a-' + purchase.id,
        purchaseId: purchase.id,
        name: purchase.concept,
        category: purchase.category,
        purchaseDate: purchase.date,
        originalValue: purchase.amount,
        currentEstimatedValue: purchase.amount,
        status: 'active',
        location: 'Taller SOS',
        responsibleId: purchase.responsibleId
      };
      setAssets([asset, ...assets]);
    }

    setShowPurchaseModal(false);
    setNewPurchase({
      date: new Date().toISOString().split('T')[0],
      category: 'herramienta',
      movementType: 'gasto_operativo',
      paidWith: 'efectivo_caja',
      isInstallments: false,
      installmentsCount: 1,
    });
    setNewPurchasePartnerContributions({});
  };

  const handleAddToInvestmentFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (investmentFundAmount <= 0) return;

    setPartners(prev => prev.map(p => {
      const contribution = investmentFundContributions[p.id] || 0;
      if (contribution > 0) {
        return {
          ...p,
          totalCashContribution: (p.totalCashContribution || 0) + contribution,
          accumulatedCapital: (p.accumulatedCapital || 0) + contribution
        };
      }
      return p;
    }));

    // In a real system, we would track this "Bolsa" movement somewhere
    // For now, it will reflect in the partners' capital and the general fund logic
    setShowInvestmentFundModal(false);
    setInvestmentFundAmount(0);
    setInvestmentFundContributions({});
  };

  const totals = useMemo(() => {
    const totalAssetsValue = assets.reduce((sum, a) => sum + a.currentEstimatedValue, 0);
    const totalInvested = partners.reduce((sum, p) => sum + p.totalReinvestmentContribution, 0);
    const totalCash = partners.reduce((sum, p) => sum + p.totalCashContribution, 0);
    const totalCapital = partners.reduce((sum, p) => sum + p.accumulatedCapital, 0);
    const totalExpenses = purchases.filter(p => p.movementType === 'gasto_operativo').reduce((sum, p) => sum + p.amount, 0);
    const totalDistributed = 5200; // Mocked

    // Calculate total debt from credit purchases
    const totalDebt = purchases.reduce((sum, p) => {
      if (p.paidWith !== 'credito') return sum;
      const remainingInstallments = (p.installmentsCount || 1) - (p.installmentsPaid || 0);
      const balance = p.isInstallments 
        ? (p.installmentAmount || (p.amount / (p.installmentsCount || 1))) * remainingInstallments
        : p.amount;
      return sum + balance;
    }, 0);

    const generalInvestmentFund = totalDebt === 0 ? 25000 : 0; // Mock general fund if no debt

    return {
      totalAssetsValue,
      totalInvested,
      totalCash,
      totalCapital,
      totalExpenses,
      totalDistributed,
      totalDebt,
      generalInvestmentFund,
      ingresosTotales: 125000, 
      utilidadNetaTotal: 45000,   
    };
  }, [partners, assets, purchases]);

  const partnersWithParticipation = useMemo(() => {
    const investors = partners.filter(p => p.type === 'investor');
    const totalInvestorCapital = investors.reduce((sum, p) => sum + p.accumulatedCapital, 0);
    
    return partners.map(p => ({
      ...p,
      calculatedParticipation: p.type === 'investor' && totalInvestorCapital > 0 
        ? (p.accumulatedCapital / totalInvestorCapital) * 100 
        : 0
    }));
  }, [partners]);

  const selectedPartner = useMemo(() => 
    partners.find(p => p.id === selectedPartnerId)
  , [partners, selectedPartnerId]);

  const renderSubView = () => {
    switch (activeSubView) {
      case 'dashboard':
        return <FinancialDashboard totals={totals} partners={partnersWithParticipation as any} purchases={purchases} />;
      case 'partners':
        return (
          <PartnersList 
            partners={partnersWithParticipation as any} 
            onSelect={(id) => {
              setSelectedPartnerId(id);
              setActiveSubView('partner-detail');
            }} 
            onAdd={() => setShowPartnerModal(true)}
          />
        );
      case 'partner-detail':
        const selectedP = partnersWithParticipation.find(p => p.id === selectedPartnerId);
        return selectedP ? (
          <PartnerDetail 
            partner={selectedP as any} 
            totalAssetsValue={totals.totalAssetsValue}
            onBack={() => setActiveSubView('partners')} 
            onLiquidation={() => setActiveSubView('liquidation')}
          />
        ) : null;
      case 'purchases':
        return (
          <PurchasesView 
            purchases={purchases} 
            totalDebt={totals.totalDebt}
            investmentFund={totals.generalInvestmentFund}
            onAdd={() => setShowPurchaseModal(true)} 
            onAddToBolsa={() => setShowInvestmentFundModal(true)}
            onDelete={confirmDelete}
            onSelect={(purchase) => {
              setSelectedPurchaseId(purchase.id);
              setShowPurchaseDetailModal(true);
            }}
          />
        );
      case 'assets':
        return <AssetsInventory assets={assets} purchases={purchases} partners={partners} onSelect={(id) => {
          setSelectedAssetId(id);
          setShowAssetDetailModal(true);
        }} />;
      case 'expenses':
        return <ExpensesView purchases={purchases} onDelete={confirmDelete} onAdd={() => setShowPurchaseModal(true)} />;
      case 'liquidation':
        return selectedPartner ? (
          <LiquidationSimulator 
            partner={selectedPartner} 
            totalAssetsValue={totals.totalAssetsValue}
            onBack={() => setActiveSubView('partner-detail')} 
          />
        ) : null;
      case 'viability':
        return (
          <InvestmentViability 
            appointments={MOCK_APPOINTMENTS}
            onBack={() => setActiveSubView('dashboard')}
            onAddCapital={() => setShowPartnerModal(true)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-low p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            GESTIÓN <span className="text-primary">FINANCIERA</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            SOCIOS • REINVERSIÓN • ACTIVOS
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-surface p-1 rounded-lg border border-white/5">
          <NavButton 
            active={activeSubView === 'dashboard'} 
            onClick={() => setActiveSubView('dashboard')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="Dashboard"
          />
          <NavButton 
            active={activeSubView === 'partners' || activeSubView === 'partner-detail' || activeSubView === 'liquidation'} 
            onClick={() => setActiveSubView('partners')}
            icon={<Users className="w-4 h-4" />}
            label="Socios"
          />
          <NavButton 
            active={activeSubView === 'purchases'} 
            onClick={() => setActiveSubView('purchases')}
            icon={<ShoppingBag className="w-4 h-4" />}
            label="Compras"
          />
          <NavButton 
            active={activeSubView === 'assets'} 
            onClick={() => setActiveSubView('assets')}
            icon={<Box className="w-4 h-4" />}
            label="Activos"
          />
          <NavButton 
            active={activeSubView === 'expenses'} 
            onClick={() => setActiveSubView('expenses')}
            icon={<History className="w-4 h-4" />}
            label="Gastos"
          />
          <NavButton 
            active={activeSubView === 'viability'} 
            onClick={() => setActiveSubView('viability')}
            icon={<Target className="w-4 h-4" />}
            label="Viabilidad"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderSubView()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPurchaseModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPurchaseModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                <h2 className="text-xl font-black uppercase tracking-tighter">Registrar Compra / Gasto</h2>
                <button onClick={() => setShowPurchaseModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

                  <form onSubmit={handleAddPurchase} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Proveedor / Tienda</label>
                  <input 
                    type="text" 
                    placeholder="Ej: AutoZone, Mercado Libre"
                    value={newPurchase.provider || ''}
                    onChange={(e) => setNewPurchase({...newPurchase, provider: e.target.value})}
                    className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Concepto</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Pulidora Rupes"
                      value={newPurchase.concept || ''}
                      onChange={(e) => setNewPurchase({...newPurchase, concept: e.target.value})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monto Total ($)</label>
                    <input 
                      type="text" 
                      required
                      inputMode="decimal"
                      placeholder="0.00"
                      value={newPurchase.amount || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setNewPurchase({...newPurchase, amount: Number(val)});
                        }
                      }}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoría</label>
                    <select 
                      value={newPurchase.category}
                      onChange={(e) => setNewPurchase({...newPurchase, category: e.target.value as any})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans appearance-none text-white"
                    >
                      <option value="herramienta">Herramienta</option>
                      <option value="equipo">Equipo</option>
                      <option value="químico">Químico</option>
                      <option value="consumible">Consumible</option>
                      <option value="marketing">Marketing</option>
                      <option value="renta">Renta</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="sueldo_colaborador">Sueldo Colaborador</option>
                      <option value="piezas">Piezas</option>
                      <option value="extras">Extras</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo de Movimiento</label>
                    <select 
                      value={newPurchase.movementType}
                      onChange={(e) => setNewPurchase({...newPurchase, movementType: e.target.value as any})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans appearance-none text-white"
                    >
                      <option value="gasto_operativo">Gasto Operativo</option>
                      <option value="activo">Activo (Equipo/Inmueble)</option>
                      <option value="consumible">Consumible Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pagado con</label>
                    <select 
                      value={newPurchase.paidWith}
                      onChange={(e) => setNewPurchase({...newPurchase, paidWith: e.target.value as any})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans appearance-none text-white"
                    >
                      <option value="efectivo_caja">Efectivo en Caja</option>
                      <option value="reinversion">Reinversión Acumulada</option>
                      <option value="aportacion_directa">Aportación Directa Socio</option>
                      <option value="credito">Crédito / Cuentas por Pagar</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha Compra</label>
                    <input 
                      type="date" 
                      required
                      value={newPurchase.date}
                      onChange={(e) => setNewPurchase({...newPurchase, date: e.target.value})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white px-2"
                    />
                  </div>
                </div>

                {newPurchase.paidWith === 'aportacion_directa' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="w-3 h-3" />
                      <label className="text-[10px] font-black uppercase tracking-widest">Desglose de Aportación Directa</label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {partners.map(p => (
                        <div key={p.id} className="space-y-1">
                          <label className="text-[8px] font-black text-zinc-500 uppercase truncate block">{p.name}</label>
                          <input 
                            type="text" 
                            inputMode="decimal"
                            placeholder="0"
                            value={newPurchasePartnerContributions[p.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                const numVal = Number(val);
                                setNewPurchasePartnerContributions({
                                  ...newPurchasePartnerContributions,
                                  [p.id]: numVal
                                });
                              }
                            }}
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-[10px] font-black text-white focus:border-primary outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-zinc-400">
                      <span>TOTAL APORTADO:</span>
                      <span className="text-primary">${Object.values(newPurchasePartnerContributions).reduce((s: number, v: number) => s + (v || 0), 0).toLocaleString()}</span>
                    </div>
                  </motion.div>
                )}

                {newPurchase.paidWith === 'credito' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> Día de Pago
                      </label>
                      <input 
                        type="date" 
                        required
                        value={newPurchase.dueDate}
                        onChange={(e) => setNewPurchase({...newPurchase, dueDate: e.target.value})}
                        className="w-full bg-surface-high border border-primary/20 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input 
                        type="checkbox" 
                        id="isInstallments"
                        checked={newPurchase.isInstallments}
                        onChange={(e) => setNewPurchase({...newPurchase, isInstallments: e.target.checked})}
                        className="w-4 h-4 rounded border-white/10 bg-surface-high text-primary focus:ring-primary"
                      />
                      <label htmlFor="isInstallments" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pointer-events-none">
                        A Meses (MSI)
                      </label>
                    </div>

                    {newPurchase.isInstallments && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Número de Meses</label>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={newPurchase.installmentsCount || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d*$/.test(val)) {
                                setNewPurchase({...newPurchase, installmentsCount: Number(val)});
                              }
                            }}
                            className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary transition-all font-sans text-white uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pago Mensual Est.</label>
                          <div className="w-full bg-surface-high/50 border border-white/5 rounded-lg py-3 px-4 text-sm font-black text-zinc-400 italic">
                            ${((newPurchase.amount || 0) / (newPurchase.installmentsCount || 1)).toLocaleString()}
                          </div>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">
                            Finaliza: {new Date(new Date(newPurchase.dueDate || new Date()).setMonth(new Date(newPurchase.dueDate || new Date()).getMonth() + (newPurchase.installmentsCount || 1))).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 py-3 rounded-xl border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Registrar Movimiento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvestmentFundModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvestmentFundModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Aportar a Bolsa de Inversión</h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Fondo general para activos y expansión</p>
                </div>
                <button onClick={() => setShowInvestmentFundModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddToInvestmentFund} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {partners.map(p => (
                    <div key={p.id} className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate block">{p.name}</label>
                      <input 
                        type="text" 
                        inputMode="decimal"
                        placeholder="0"
                        value={investmentFundContributions[p.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d*$/.test(val)) {
                            const numVal = Number(val);
                            const newContribs = { ...investmentFundContributions, [p.id]: numVal };
                            setInvestmentFundContributions(newContribs);
                            const total = (Object.values(newContribs) as number[]).reduce((s, v) => s + (v || 0), 0);
                            setInvestmentFundAmount(total);
                          }
                        }}
                        className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-black text-white focus:border-primary outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex justify-between items-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Aportación</span>
                  <span className="text-xl font-black text-primary">${investmentFundAmount.toLocaleString()}</span>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowInvestmentFundModal(false)}
                    className="flex-1 py-3 rounded-xl border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={investmentFundAmount <= 0}
                    className="flex-1 py-3 rounded-xl bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    Confirmar Aportación
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPurchaseDetailModal && selectedPurchaseId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPurchaseDetailModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {(() => {
              const purchase = purchases.find(p => p.id === selectedPurchaseId);
              if (!purchase) return null;

              const isFullyPaid = purchase.paidWith !== 'credito' || 
                (purchase.isInstallments && (purchase.installmentsPaid || 0) >= (purchase.installmentsCount || 1));
              
              const remainingInstallments = (purchase.installmentsCount || 1) - (purchase.installmentsPaid || 0);
              const remainingBalance = purchase.isInstallments 
                ? (purchase.installmentAmount || (purchase.amount / (purchase.installmentsCount || 1))) * remainingInstallments
                : (purchase.paidWith === 'credito' ? purchase.amount : 0);

              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isFullyPaid ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                      )}>
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black uppercase tracking-tighter">{purchase.concept}</h2>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{purchase.date}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowPurchaseDetailModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Monto Total</p>
                        <p className="text-xl font-black text-white">${purchase.amount.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Método Pago</p>
                        <p className="text-xs font-black text-primary uppercase">{purchase.paidWith.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estatus de Pago</h3>
                      {purchase.paidWith === 'credito' ? (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-primary">
                              <Clock className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase">Pendiente de Pago</span>
                            </div>
                            <span className="text-xs font-black text-white">${remainingBalance.toLocaleString()}</span>
                          </div>

                          {purchase.isInstallments ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                                  <span>PROGRESO MSI</span>
                                  <span>{purchase.installmentsPaid} / {purchase.installmentsCount} MESES</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${((purchase.installmentsPaid || 0) / (purchase.installmentsCount || 1)) * 100}%` }} 
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[9px] text-zinc-500 italic">
                                  <span>Quedan {remainingInstallments} meses</span>
                                  <span>Próximo pago: {purchase.dueDate || 'No definida'}</span>
                                </div>
                              </div>

                                <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-4">
                                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Desglose por Socio</label>
                                  
                                  <div className="space-y-3">
                                    {partners.map(p => (
                                      <div key={p.id} className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase w-20 truncate">{p.name}</span>
                                        <input 
                                          type="text" 
                                          inputMode="decimal"
                                          placeholder="0"
                                          value={partnerPayments[p.id] || ''}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                              const numVal = Number(val);
                                              const newPayments = {...partnerPayments, [p.id]: numVal};
                                              setPartnerPayments(newPayments);
                                              const total = (Object.values(newPayments) as number[]).reduce((s: number, v: number) => s + (v || 0), 0);
                                              setAdvancePaymentAmount(total);
                                            }
                                          }}
                                          className="flex-1 bg-surface-high border border-white/5 rounded-lg py-1.5 px-3 text-[10px] font-black text-white focus:border-primary outline-none"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="pt-2 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[9px] font-black text-zinc-500 uppercase">Total a Pagar</span>
                                      <span className="text-sm font-black text-primary">${advancePaymentAmount.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => {
                                          handleRegisterPayment(purchase.id, advancePaymentAmount, partnerPayments);
                                          setPartnerPayments({});
                                        }}
                                        disabled={advancePaymentAmount <= 0}
                                        className="flex-1 py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                                      >
                                        Registrar Pago desglosado
                                      </button>
                                    </div>

                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => {
                                          const installment = purchase.installmentAmount || (purchase.amount / (purchase.installmentsCount || 1));
                                          handleRegisterPayment(purchase.id, installment);
                                        }}
                                        className="flex-1 py-2 bg-white/5 text-white/50 border border-white/5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-white/10 transition-all"
                                      >
                                        Caja (1 Mes)
                                      </button>
                                      <button 
                                        onClick={() => {
                                          handleRegisterPayment(purchase.id, remainingBalance);
                                        }}
                                        className="flex-1 py-2 bg-white/5 text-primary border border-primary/20 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-primary/10 transition-all"
                                      >
                                        Caja (Liquidar)
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Fecha Límite</p>
                                <p className="text-xs font-black text-white">{purchase.dueDate || 'No definida'}</p>
                              </div>
                              <button 
                                onClick={() => handleRegisterPayment(purchase.id)}
                                className="w-full py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                              >
                                Liquidar Pago Total
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Totalmente Pagado</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Proveedor</p>
                          <p className="text-xs font-bold text-white uppercase">{purchase.provider || 'No especificado'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Responsable</p>
                          <p className="text-xs font-bold text-white uppercase italic">Usuario Principal (ID: {purchase.responsibleId})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssetDetailModal && selectedAssetId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssetDetailModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {(() => {
              const asset = assets.find(a => a.id === selectedAssetId);
              const purchase = purchases.find(p => p.id === asset?.purchaseId);
              if (!asset || !purchase) return null;

              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10 text-secondary">
                        <Box className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black uppercase tracking-tighter">{asset.name}</h2>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{asset.category}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowAssetDetailModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Costo Original</p>
                        <p className="text-xl font-black text-white">${asset.originalValue.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fecha Adquisición</p>
                        <p className="text-xs font-black text-secondary uppercase">{asset.purchaseDate}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Desglose de Aportaciones</h3>
                      <div className="space-y-3">
                        {partners.map(p => {
                          const contribution = purchase.partnerContributions?.[p.id] || 0;
                          return (
                            <div key={p.id} className="flex justify-between items-center py-1">
                              <div>
                                <p className="text-xs font-bold text-white uppercase">{p.name}</p>
                                <p className="text-[8px] font-black text-zinc-500 uppercase">{p.status === 'active' ? 'Socio Actual' : 'Ex-Socio'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-primary">${contribution.toLocaleString()}</p>
                                <p className="text-[8px] font-bold text-zinc-600 uppercase">
                                  {contribution > 0 ? ((contribution / purchase.amount) * 100).toFixed(1) + '%' : '0%'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {purchase.paidWith === 'efectivo_caja' && (
                          <div className="flex justify-between items-center py-1 border-t border-white/5 pt-3">
                             <div>
                                <p className="text-xs font-bold text-emerald-400 uppercase">Fondo de Caja (SOS)</p>
                                <p className="text-[8px] font-black text-zinc-500 uppercase">Utilidades Reinvertidas</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-emerald-400">${purchase.amount.toLocaleString()}</p>
                                <p className="text-[8px] font-bold text-zinc-600 uppercase">100%</p>
                              </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
                       <p className="text-[9px] text-zinc-400 font-medium uppercase leading-relaxed font-sans">
                         Este desglose refleja las aportaciones directas realizadas al momento de la compra o pagos de crédito posteriores.
                       </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white">¿Confirmar Eliminación?</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    Esta acción no se puede deshacer. Si es un activo, se eliminará del inventario.
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-2">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all text-zinc-400"
                  >
                    No, Cancelar
                  </button>
                  <button 
                    onClick={handleDeletePurchase}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPartnerModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPartnerModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-high">
                <h2 className="text-xl font-black uppercase tracking-tighter">Registrar Nuevo Socio</h2>
                <button onClick={() => setShowPartnerModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddPartner} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Pérez"
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo de Partner</label>
                    <select 
                      value={newPartner.type}
                      onChange={(e) => setNewPartner({...newPartner, type: e.target.value as any})}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans appearance-none text-white"
                    >
                      <option value="investor">Socio Inversionista</option>
                      <option value="collaborator">Socio Colaborador</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className={cn("text-[10px] font-black uppercase tracking-widest", newPartner.type === 'investor' ? "text-zinc-500" : "text-zinc-700")}>
                      {newPartner.type === 'investor' ? "Aportación Inicial ($)" : "Aportación (No aplica)"}
                    </label>
                    <input 
                      type="text" 
                      disabled={newPartner.type === 'collaborator'}
                      required={newPartner.type === 'investor'}
                      inputMode="decimal"
                      placeholder="0.00"
                      value={newPartner.type === 'collaborator' ? '' : (newPartner.totalCashContribution || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setNewPartner({...newPartner, totalCashContribution: Number(val)});
                        }
                      }}
                      className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white uppercase disabled:opacity-20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha de Ingreso</label>
                  <input 
                    type="date" 
                    required
                    value={newPartner.entryDate}
                    onChange={(e) => setNewPartner({...newPartner, entryDate: e.target.value})}
                    className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all font-sans text-white px-2"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPartnerModal(false)}
                    className="flex-1 py-3 rounded-xl border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Registrar Socio
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

// --- SUB-COMPONENTS ---

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
      active ? "bg-primary text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const FinancialDashboard = ({ totals, partners, purchases }: { totals: any, partners: Partner[], purchases: Purchase[] }) => {
  const upcomingPayments = useMemo(() => {
    const projections: Record<string, { total: number, items: string[] }> = {};
    const now = new Date();
    
    // Initialize next 6 months with $0
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = d.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
      projections[key] = { total: 0, items: [] };
    }

    purchases.forEach(p => {
      if (p.paidWith !== 'credito') return;
      
      const remainingInstallments = (p.installmentsCount || 1) - (p.installmentsPaid || 0);
      if (remainingInstallments <= 0) return;
      
      const installmentAmount = p.isInstallments 
        ? (p.installmentAmount || (p.amount / (p.installmentsCount || 1)))
        : p.amount;
        
      const startDate = new Date(p.dueDate || p.date);
      
      for (let i = 0; i < (p.isInstallments ? remainingInstallments : 1); i++) {
        const payDate = new Date(startDate);
        payDate.setMonth(startDate.getMonth() + i);
        
        const monthDiff = (payDate.getFullYear() - now.getFullYear()) * 12 + (payDate.getMonth() - now.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          const monthKey = payDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
          if (projections[monthKey]) {
            projections[monthKey].total += installmentAmount;
            projections[monthKey].items.push(`${p.concept} ($${installmentAmount.toLocaleString()})`);
          }
        }
      }
    });
    
    return Object.entries(projections).sort((a, b) => {
      const [mA, yA] = a[0].split(' de ');
      const [mB, yB] = b[0].split(' de ');
      const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const dateA = new Date(parseInt(yA), months.indexOf(mA.toLowerCase()));
      const dateB = new Date(parseInt(yB), months.indexOf(mB.toLowerCase()));
      return dateA.getTime() - dateB.getTime();
    });
  }, [purchases]);

  const currentMonthProgress = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return (now.getDate() / daysInMonth) * 100;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Ingresos Totales" value={totals.ingresosTotales} icon={<DollarSign className="w-4 h-4" />} color="primary" />
        <StatsCard label="Deuda Pendiente" value={totals.totalDebt} icon={<CreditCard className="w-4 h-4" />} color={totals.totalDebt > 0 ? "red-400" : "zinc-500"} />
        <StatsCard 
          label={totals.totalDebt === 0 ? "Fondo Inversión (Bolsa)" : "Reinversión Total"} 
          value={totals.totalDebt === 0 ? totals.generalInvestmentFund : totals.totalInvested} 
          icon={<PieChart className="w-4 h-4" />} 
          color={totals.totalDebt === 0 ? "primary" : "blue-400"} 
        />
        <StatsCard label="Valor Activos" value={totals.totalAssetsValue} icon={<Box className="w-4 h-4" />} color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-white/5 rounded-xl p-6 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-8">Flujo de Pagos a Corto Plazo</h3>
            
            <div className="relative pt-8 pb-4">
              {/* Dotted Line Background */}
              <div className="absolute top-[4.5rem] left-0 right-0 h-px border-t-[3px] border-dashed border-white/5" />
              
              {/* Animated Progress Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentMonthProgress / 6}%` }} // Simplified for first month
                className="absolute top-[4.5rem] left-0 h-px border-t-[3px] border-emerald-500 z-10"
              />

              <div className="flex justify-between relative px-2">
                {upcomingPayments.map(([month, data], idx) => (
                  <div key={month} className="flex flex-col items-center gap-4 relative group">
                    <div className="flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "w-3 h-3 rounded-full bg-surface-high border-2 z-10 transition-all duration-500",
                          idx === 0 ? (currentMonthProgress > 5 ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-primary ring-4 ring-primary/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]") : "border-white/20"
                        )}
                      />
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-white">${data.total.toLocaleString()}</span>
                        <p className={cn(
                          "text-[7px] font-black uppercase tracking-tighter opacity-50",
                          idx === 0 ? "text-primary" : "text-zinc-500"
                        )}>{month.split(' ')[0]}</p>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-14 left-1/2 -translate-x-1/2 w-40 bg-surface-high border border-white/10 p-2 rounded-lg z-20 pointer-events-none shadow-2xl">
                      <p className="text-[8px] font-black text-zinc-500 uppercase border-b border-white/5 pb-1 mb-1">{month}</p>
                      {data.items.length > 0 ? (
                        <ul className="space-y-1">
                          {data.items.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-[8px] font-bold text-zinc-400 truncate tracking-tight">{item}</li>
                          ))}
                          {data.items.length > 3 && <li className="text-[7px] font-black text-primary">+{data.items.length - 3} MÁS</li>}
                        </ul>
                      ) : (
                        <p className="text-[8px] font-bold text-zinc-600 italic">Sin pagos</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border border-white/5 rounded-xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Resumen de Operación</h3>
            <div className="space-y-3">
              <SummaryItem label="Gastos Totales" value={totals.totalExpenses} />
              <SummaryItem label="Monto Repartido" value={totals.totalDistributed} />
              <SummaryItem label="Aportaciones Directas" value={totals.totalCash} />
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nota Importante</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-medium uppercase leading-relaxed font-sans">
              Los valores de activos son estimados según depreciación sugerida. La reinversión se distribuye automáticamente al cerrar cada orden de servicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnersList = ({ partners, onSelect, onAdd }: { partners: Partner[], onSelect: (id: string) => void, onAdd: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Listado de Socios</h3>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-md font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Registrar Socio
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-surface-high">
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Socio</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans text-center">% Part.</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans text-right">Cap. Neto</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans text-right">Acción</div>
        </div>
        <div className="divide-y divide-white/5">
          {partners.map(partner => (
            <div key={partner.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-4">
                <span className="text-sm font-bold text-white uppercase">{(partner as any).name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", partner.status === 'active' ? "bg-green-500" : "bg-red-500")} />
                  <span className="text-[8px] font-black text-zinc-500 uppercase">{partner.status} • {partner.type === 'investor' ? 'Inversionista' : 'Colaborador'}</span>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded">{(partner as any).calculatedParticipation?.toFixed(1) || 0}%</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="text-sm font-black text-white">${(partner as any).accumulatedCapital.toLocaleString()}</span>
              </div>
              <div className="col-span-3 text-right">
                <button 
                  onClick={() => onSelect(partner.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary flex items-center justify-end gap-1 ml-auto"
                >
                  Detalles
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PartnerDetail = ({ partner, totalAssetsValue, onBack, onLiquidation }: { partner: Partner, totalAssetsValue: number, onBack: () => void, onLiquidation: () => void }) => (
  <div className="space-y-6">
    <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
      <History className="rotate-180 w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">Volver a Socios</span>
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-surface border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
            <span className="text-2xl font-black text-primary">{partner.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{partner.name}</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase mt-1">
              <Wallet className="w-3 h-3" />
              Socio Activo • {partner.participationPercentage}% Participación
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/5">
          <div className="space-y-1 text-center">
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Cap. Acumulado</p>
            <p className="text-lg font-black text-white">${partner.accumulatedCapital.toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Reinversión</p>
            <p className="text-lg font-black text-primary">${partner.totalReinvestmentContribution.toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resumen Financiero</h4>
          <DetailRow label="Aportación Efectivo" value={partner.totalCashContribution} />
          <DetailRow label="Aportación Reinversión" value={partner.totalReinvestmentContribution} />
          <DetailRow label="Retiros / Repartos" value={partner.totalWithdrawals} color="text-red-400" />
          <div className="pt-2">
            <DetailRow label="Capital Neto Histórico" value={partner.accumulatedCapital} highlighted />
          </div>
        </div>

        <button 
          onClick={onLiquidation}
          className="w-full mt-8 py-4 bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 transition-all"
        >
          Simular Liquidación de Salida
        </button>
      </div>

      <div className="lg:col-span-7 bg-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Historial Reciente</h3>
        <div className="space-y-3">
          {[
            { date: '2024-03-25', concept: 'Reinversión OT #1204', amount: 450, type: 'plus' },
            { date: '2024-03-20', concept: 'Retiro Utilidad Feb', amount: 300, type: 'minus' },
            { date: '2024-03-15', concept: 'Reinversión OT #1198', amount: 280, type: 'plus' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="flex items-center gap-4">
                {item.type === 'plus' ? <ArrowUpRight className="text-emerald-400 opacity-50 w-4 h-4" /> : <ArrowDownRight className="text-red-400 opacity-50 w-4 h-4" />}
                <div>
                  <p className="text-xs font-bold text-white uppercase">{item.concept}</p>
                  <p className="text-[9px] text-zinc-500">{item.date}</p>
                </div>
              </div>
              <span className={cn("text-xs font-black", item.type === 'plus' ? "text-emerald-400" : "text-red-400")}>
                {item.type === 'plus' ? '+' : '-'}${item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PurchasesView = ({ purchases, totalDebt, investmentFund, onAdd, onAddToBolsa, onDelete, onSelect }: { purchases: Purchase[], totalDebt: number, investmentFund: number, onAdd: () => void, onAddToBolsa: () => void, onDelete: (id: string) => void, onSelect: (p: Purchase) => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-surface border border-white/5 p-4 rounded-xl">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Deuda Total Acumulada</p>
        <p className={cn("text-xl font-black", totalDebt > 0 ? "text-red-400" : "text-white")}>${totalDebt.toLocaleString()}</p>
      </div>
      <div className="bg-surface border border-white/5 p-4 rounded-xl">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Bolsa de Inversión (Fondo)</p>
        <p className="text-xl font-black text-emerald-400">${investmentFund.toLocaleString()}</p>
      </div>
      <div className="md:col-span-2 flex items-center justify-end gap-3 flex-wrap">
        <button 
          onClick={onAddToBolsa}
          className="flex items-center gap-2 bg-white/5 text-emerald-400 border border-emerald-400/20 px-4 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400/5 transition-all active:scale-95 shadow-lg shadow-emerald-400/10"
        >
          <PieChart className="w-4 h-4" />
          Aportar a Bolsa
        </button>
        <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-lg px-4 py-3 w-full max-w-xs">
          <Search className="w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="BUSCAR COMPRA..." className="bg-transparent border-none text-[10px] font-black uppercase w-full focus:outline-none text-white font-sans" />
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Nueva Compra
        </button>
      </div>
    </div>

    <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-surface-high">
        <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">Concepto / Fecha</div>
        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">Categoría</div>
        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">Estatus / Restante</div>
        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">Próximo Pago</div>
        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Total</div>
        <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right"></div>
      </div>
      <div className="divide-y divide-white/5">
        {purchases.map(purchase => {
          const isCredit = purchase.paidWith === 'credito';
          const remainingInstallments = isCredit ? ((purchase.installmentsCount || 1) - (purchase.installmentsPaid || 0)) : 0;
          const remainingBalance = isCredit ? (purchase.isInstallments 
            ? (purchase.installmentAmount || (purchase.amount / (purchase.installmentsCount || 1))) * remainingInstallments
            : purchase.amount) : 0;
          const isPaid = !isCredit || (isCredit && remainingBalance <= 0);

          return (
            <div 
              key={purchase.id} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] group cursor-pointer"
              onClick={() => onSelect(purchase)}
            >
              <div className="col-span-3">
                <p className="text-xs font-bold text-white uppercase truncate">{purchase.concept}</p>
                <p className="text-[9px] text-zinc-500 uppercase">{purchase.date}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] font-black text-zinc-400 bg-white/5 px-2 py-0.5 rounded uppercase">{purchase.category}</span>
              </div>
              <div className="col-span-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isPaid ? "bg-emerald-500" : "bg-red-500")} />
                    <span className={cn("text-[8px] font-black uppercase tracking-widest", isPaid ? "text-emerald-500" : "text-red-500")}>
                      {isPaid ? 'PAGADO' : 'PENDIENTE'}
                    </span>
                  </div>
                  {isCredit && remainingBalance > 0 && (
                    <span className="text-[9px] font-bold text-white/50">${remainingBalance.toLocaleString()} Rest.</span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                  {purchase.dueDate || '-'}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-black text-white">${purchase.amount.toLocaleString()}</span>
              </div>
              <div className="col-span-1 text-right">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(purchase.id);
                  }}
                  className="p-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const AssetsInventory = ({ assets, purchases, partners, onSelect }: { assets: Asset[], purchases: Purchase[], partners: Partner[], onSelect: (id: string) => void }) => {
  const paidAssets = useMemo(() => {
    return assets.filter(asset => {
      const purchase = purchases.find(p => p.id === asset.purchaseId);
      if (!purchase) return true;
      if (purchase.paidWith !== 'credito') return true;
      const remainingInstallments = (purchase.installmentsCount || 1) - (purchase.installmentsPaid || 0);
      return remainingInstallments <= 0;
    });
  }, [assets, purchases]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paidAssets.map(asset => (
        <div 
          key={asset.id} 
          className="bg-surface border border-white/5 rounded-xl overflow-hidden group hover:border-primary/30 transition-all cursor-pointer"
          onClick={() => onSelect(asset.id)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-[8px] font-black uppercase text-zinc-500 bg-white/5 px-2 py-1 rounded">ACTIVO PAGADO</span>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-1 text-white">{asset.name}</h3>
            <p className="text-[9px] font-bold text-zinc-500 uppercase mb-6">{asset.category} • {asset.location}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1 tracking-widest text-center">Inversión</p>
                <p className="text-sm font-black text-white text-center">${asset.originalValue.toLocaleString()}</p>
              </div>
              <div className="bg-secondary/5 p-3 rounded-lg border border-secondary/10">
                <p className="text-[8px] font-black text-secondary uppercase mb-1 tracking-widest text-center">Valor Estimado</p>
                <p className="text-sm font-black text-secondary text-center">${asset.currentEstimatedValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-surface-high border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Estado: {asset.status}</span>
            <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase">
              Ver Desglose
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ExpensesView = ({ purchases, onDelete, onAdd }: { purchases: Purchase[], onDelete: (id: string) => void, onAdd: () => void }) => {
  const expenses = useMemo(() => {
    return purchases.filter(p => !['herramienta', 'equipo', 'renta'].includes(p.category)); // Simplified logic for what counts as operational expense
  }, [purchases]);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">Historial de Gastos Operativos</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Sueldos • Piezas • Extras • Consumibles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface border border-white/5 py-2 px-6 rounded-xl text-center">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Gastado</p>
            <p className="text-lg font-black text-primary">${totalExpenseAmount.toLocaleString()}</p>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </button>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-surface-high">
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Concepto / Fecha</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">Categoría</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Monto</div>
          <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Acción</div>
        </div>
        <div className="divide-y divide-white/5">
          {expenses.length > 0 ? (
            expenses.map(expense => (
              <div key={expense.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                <div className="col-span-4">
                  <p className="text-sm font-bold text-white uppercase">{expense.concept}</p>
                  <p className="text-[9px] text-zinc-500 uppercase">{expense.date}</p>
                </div>
                <div className="col-span-3">
                  <span className="text-[9px] font-black text-zinc-400 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">
                    {expense.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-sm font-black text-red-400">-${expense.amount.toLocaleString()}</span>
                </div>
                <div className="col-span-2 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(expense.id);
                    }}
                    className="p-2 text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest italic">No hay gastos registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LiquidationSimulator = ({ partner, totalAssetsValue, onBack }: { partner: Partner, totalAssetsValue: number, onBack: () => void }) => {
  const assetShare = (totalAssetsValue * partner.participationPercentage) / 100;
  const suggestedAmount = partner.accumulatedCapital + assetShare;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
        <ArrowUpRight className="rotate-[225deg] w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Volver al Perfil</span>
      </button>

      <div className="max-w-2xl mx-auto bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 bg-zinc-900 border-b border-white/5">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Simulador de Liquidación</h2>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Calculando participación recuperable para: <span className="text-white">{partner.name}</span>
          </p>
        </div>

        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Basado en Capital Histórico</h4>
              <div className="space-y-3">
                <SummaryItem label="Inv. Directa" value={partner.totalCashContribution} small />
                <SummaryItem label="Reinversión" value={partner.totalReinvestmentContribution} small />
                <SummaryItem label="Retiros Realizados" value={partner.totalWithdrawals} color="text-red-400" small />
                <div className="pt-2">
                  <SummaryItem label="Capital Neto" value={partner.accumulatedCapital} large />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Basado en Valor de Mercado</h4>
              <div className="space-y-3">
                <SummaryItem label="Valor Activos Total" value={totalAssetsValue} small />
                <SummaryItem label="Porcentaje de Participación" value={partner.participationPercentage + "%"} small />
                <div className="pt-2">
                  <SummaryItem label="Valor Recuperable" value={assetShare} color="text-blue-400" large />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Monto Sugerido para Liquidación</h3>
            <p className="text-5xl font-black text-white tracking-tighter">${suggestedAmount.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Suma de Capital Neto + Valor Proporcional de Activos</p>
          </div>

          <div className="flex flex-col gap-4">
            <button className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Generar Documento de Acuerdo
            </button>
            <button className="w-full py-4 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">
              Descargar Reporte Detallado (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPERS ---

const StatsCard = ({ label, value, icon, color }: { label: string, value: any, icon: React.ReactNode, color: string }) => (
  <div className="bg-surface border border-white/5 p-5 rounded-xl hover:bg-white/[0.02] transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg bg-opacity-10", color.startsWith('bg-') ? color : `bg-${color}`, color.startsWith('text-') ? color : `text-${color}`)}>
        {icon}
      </div>
      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded">Actual</span>
    </div>
    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</h4>
    <p className="text-2xl font-black text-white tracking-tighter">
      {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
    </p>
  </div>
);

const DetailRow = ({ label, value, color, highlighted }: { label: string, value: number, color?: string, highlighted?: boolean }) => (
  <div className={cn("flex justify-between items-center", highlighted && "pt-2 border-t border-white/5")}>
    <span className={cn("text-[10px] font-bold uppercase", highlighted ? "text-white" : "text-zinc-500")}>{label}</span>
    <span className={cn("text-sm font-black", color, highlighted ? "text-primary" : "text-white")}>
      ${value.toLocaleString()}
    </span>
  </div>
);

const SummaryItem = ({ label, value, color, small, large }: { label: string, value: any, color?: string, small?: boolean, large?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className={cn("font-bold uppercase leading-none", small ? "text-[9px] text-zinc-500" : "text-[10px] text-zinc-400")}>{label}</span>
    <span className={cn("font-black", color || "text-white", small ? "text-xs" : large ? "text-lg" : "text-sm")}>
      {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
    </span>
  </div>
);

const InvestmentViability = ({ appointments, onBack, onAddCapital }: { appointments: Appointment[], onBack: () => void, onAddCapital: () => void }) => {
  const [investmentAmount, setInvestmentAmount] = useState(15000);
  const [dueDays, setDueDays] = useState(30);

  const projectedRevenue = useMemo(() => {
    return appointments.reduce((sum, appt) => {
      const price = SERVICE_PRICES[appt.service || ''] || 2000;
      return sum + price;
    }, 0);
  }, [appointments]);

  const expensesProjected = 12000; // Mock fixed expenses
  const cashFlowSurplus = projectedRevenue - expensesProjected;
  const isViable = cashFlowSurplus >= investmentAmount;
  const gap = investmentAmount - cashFlowSurplus;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
        <History className="rotate-180 w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Volver a Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface border border-white/5 rounded-xl p-6 h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Parámetros de Inversión</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monto a Invertir ($)</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={investmentAmount === 0 ? '' : investmentAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setInvestmentAmount(Number(val));
                  }
                }}
                className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-black text-white focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Días para el Pago</label>
              <input 
                type="text" 
                inputMode="numeric"
                value={dueDays === 0 ? '' : dueDays}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*$/.test(val)) {
                    setDueDays(Number(val));
                  }
                }}
                className="w-full bg-surface-high border border-white/5 rounded-lg py-3 px-4 text-sm font-black text-white focus:border-primary transition-all"
              />
            </div>

            <div className="pt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Zap className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Análisis Orgánico</span>
              </div>
              <p className="text-[12px] font-sans text-zinc-400">
                Basado en {appointments.length} servicios confirmados para los próximos {dueDays} días.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className={cn(
            "p-8 rounded-2xl border flex flex-col items-center text-center space-y-4 shadow-2xl transition-all",
            isViable ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-2",
              isViable ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            )}>
              {isViable ? <TrendingUp className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {isViable ? "Inversión Viable" : "Inversión No Recomendada"}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">
                {isViable 
                  ? "El flujo de caja proyectado cubre la inversión orgánicamente" 
                  : `Faltan $${gap.toLocaleString()} para cubrir la inversión con el flujo actual`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-md pt-4">
              <div className="text-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Ingresos Proyectados</p>
                <p className="text-xl font-black text-white">${projectedRevenue.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Caja Libre (Est.)</p>
                <p className="text-xl font-black text-primary">${cashFlowSurplus.toLocaleString()}</p>
              </div>
            </div>

            {!isViable && (
              <div className="w-full pt-6 ">
                <div className="bg-surface p-6 rounded-xl border border-white/5 space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recursos de Contingencia</p>
                  <button 
                    onClick={onAddCapital}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-white">Inyección de Capital Directa</span>
                  </button>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    * Al inyectar capital manual, la inversión se vuelve viable instantáneamente registrando la aportación como capital del socio.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface border border-white/5 rounded-xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Agenda de Respaldo</h3>
            <div className="space-y-2">
              {appointments.map(appt => (
                <div key={appt.id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[50px]">
                      <p className="text-[10px] font-black text-white">{new Date(appt.date).getDate()}</p>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{appt.service}</p>
                      <p className="text-[8px] text-zinc-500">CLIENTE: {appt.customerPhone}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">+${(SERVICE_PRICES[appt.service || ''] || 2000).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
