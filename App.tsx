
import React, { useState, useEffect } from 'react';
import { View, Fila, CicloCultivo, Caja, AppConfig, HistoricoProduccion } from './types';
import Scanner from './components/Scanner';
import RowForm from './components/RowForm';
import BoxForm from './components/BoxForm';
import ControlCenter from './components/ControlCenter';
import QRGenerator from './components/QRGenerator';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ManualEntry from './components/ManualEntry';
import ActiveCrops from './components/ActiveCrops';
import Logistica from './components/Logistica';

const INITIAL_FILAS: Fila[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Fila ${i + 1}`
}));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [activeFilaId, setActiveFilaId] = useState<number | null>(null);
  const [activeCajaId, setActiveCajaId] = useState<string | null>(null);
  
  const [ciclos, setCiclos] = useState<CicloCultivo[]>(() => JSON.parse(localStorage.getItem('af_ciclos') || '[]'));
  const [cajas, setCajas] = useState<Caja[]>(() => JSON.parse(localStorage.getItem('af_cajas') || '[]'));
  const [historico, setHistorico] = useState<HistoricoProduccion[]>(() => JSON.parse(localStorage.getItem('af_historico') || '[]'));
  const [config, setConfig] = useState<AppConfig>(() => JSON.parse(localStorage.getItem('af_config') || '{"webhookUrl":"","nombreFinca":"Juntos Farm","operario":"Admin"}'));

  useEffect(() => {
    localStorage.setItem('af_ciclos', JSON.stringify(ciclos));
    localStorage.setItem('af_cajas', JSON.stringify(cajas));
    localStorage.setItem('af_historico', JSON.stringify(historico));
    localStorage.setItem('af_config', JSON.stringify(config));
  }, [ciclos, cajas, historico, config]);

  const getActiveCiclo = (filaId: number) => ciclos.find(c => c.fila_id === filaId && c.estado === 'activo');
  
  const getCaja = (cajaId: string) => cajas.find(c => c.id === cajaId) || {
    id: cajaId,
    fila_id: null,
    batch_id: null,
    peso: null,
    clasificacion: null,
    estado: 'disponible'
  } as Caja;

  const handleScan = (decodedText: string) => {
    if (decodedText.includes('/fila/')) {
      const parts = decodedText.split('/fila/');
      const id = parseInt(parts[parts.length - 1]);
      if (!isNaN(id)) {
        setActiveFilaId(id);
        setCurrentView(View.FILA_FORM);
      }
    } else if (decodedText.includes('/caja/')) {
      const parts = decodedText.split('/caja/');
      const id = parts[parts.length - 1];
      processCajaInput(id);
    }
  };

  const handleManualInput = (type: 'fila' | 'caja', value: string) => {
    if (type === 'fila') {
      const id = parseInt(value);
      if (!isNaN(id)) {
        setActiveFilaId(id);
        setCurrentView(View.FILA_FORM);
      }
    } else {
      processCajaInput(value);
    }
  };

  const processCajaInput = (id: string) => {
    setActiveCajaId(id);
    const caja = getCaja(id);
    setCurrentView(caja.estado === 'vinculada' ? View.CONTROL_CENTER : View.CAJA_FORM);
  };

  const handleCreateCiclo = (data: Partial<CicloCultivo>) => {
    const oldCiclo = getActiveCiclo(activeFilaId!);
    if (oldCiclo) {
        handleFinalizeCiclo(oldCiclo.id);
    }

    const newCiclo: CicloCultivo = {
      id: Math.random().toString(36).substr(2, 9),
      fila_id: activeFilaId!,
      batch_id: `LOTE-${activeFilaId}-${new Date().toISOString().slice(0,10).replace(/-/g, '')}`,
      metodo_labrado: data.metodo_labrado || '',
      abono: data.abono || '',
      variedad_planta: data.variedad_planta || '',
      tratamientos: data.tratamientos || '',
      fecha_inicio: new Date().toISOString(),
      estado: 'activo'
    };
    setCiclos(prev => [...prev, newCiclo]);
    setCurrentView(View.DASHBOARD);
  };

  const handleFinalizeCiclo = (cicloId: string) => {
    setCiclos(prev => prev.map(c => c.id === cicloId ? { ...c, estado: 'finalizado' } : c));
  };

  const handleLinkCaja = (filaId: number) => {
    const activeCiclo = getActiveCiclo(filaId);
    if (!activeCiclo) {
      alert("Error: Esta fila no tiene una siembra activa.");
      return;
    }

    const newCajaData: Caja = {
      id: activeCajaId!,
      fila_id: filaId,
      batch_id: activeCiclo.batch_id,
      peso: null,
      clasificacion: null,
      estado: 'vinculada'
    };

    setCajas(prev => {
      const filtered = prev.filter(c => c.id !== activeCajaId);
      return [...filtered, newCajaData];
    });

    setCurrentView(View.CONTROL_CENTER);
  };

  const handleFinalizeCaja = async (peso: number, clasificacion: 'A' | 'B' | 'C') => {
    const caja = getCaja(activeCajaId!);
    
    let destino: 'tienda' | 'distribucion' | 'mermas' = 'distribucion';
    if (clasificacion === 'A') destino = 'tienda';
    if (clasificacion === 'C') destino = 'mermas';

    const registro: HistoricoProduccion = {
      id: Math.random().toString(36).substr(2, 9),
      caja_id: caja.id,
      batch_id: caja.batch_id!,
      peso,
      clasificacion,
      fecha: new Date().toISOString(),
      fila_id: caja.fila_id!,
      estado_logistico: 'almacen',
      destino: destino
    };

    setHistorico(prev => [registro, ...prev]);

    setCajas(prev => prev.map(c => c.id === activeCajaId ? { ...c, estado: 'disponible', fila_id: null, batch_id: null } : c));
    setCurrentView(View.DASHBOARD);
  };

  const handleDespacho = (id: string) => {
    setHistorico(prev => prev.map(h => 
      h.id === id ? { ...h, estado_logistico: 'despachado', fecha_despacho: new Date().toISOString() } : h
    ));
  };

  const resetAllData = () => {
    if(confirm("¿Estás seguro? Se borrarán todos los datos.")) {
      setCiclos([]);
      setCajas([]);
      setHistorico([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#F9F5F0] shadow-xl overflow-hidden relative">
      <header className="bg-[#1A3C34] text-white p-4 shadow-md sticky top-0 z-50 no-print flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AgroFlow</h1>
          <p className="text-[10px] text-stone-300 opacity-80 uppercase font-bold tracking-widest">{config.nombreFinca}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#D96C4D] flex items-center justify-center text-xs font-bold border border-stone-600">
          {config.operario[0]}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32">
        {currentView === View.DASHBOARD && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Monitor Juntos Farm</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentView(View.ACTIVE_CROPS)}
                  className="bg-[#1A3C34]/5 p-4 rounded-xl border border-[#1A3C34]/10 text-left transition-transform active:scale-95"
                >
                  <p className="text-[10px] text-[#1A3C34] font-black uppercase">Siembras Activas</p>
                  <p className="text-3xl font-black text-[#1A3C34]">{ciclos.filter(c => c.estado === 'activo').length}</p>
                  <p className="text-[9px] text-[#1A3C34]/60 mt-1 font-bold italic">Ver campo →</p>
                </button>
                <button 
                  onClick={() => setCurrentView(View.LOGISTICA)}
                  className="bg-[#D96C4D]/5 p-4 rounded-xl border border-[#D96C4D]/10 text-left transition-transform active:scale-95"
                >
                  <p className="text-[10px] text-[#D96C4D] font-black uppercase">En Almacén</p>
                  <p className="text-3xl font-black text-[#D96C4D]">{historico.filter(h => h.estado_logistico === 'almacen').length}</p>
                  <p className="text-[9px] text-[#D96C4D]/60 mt-1 font-bold italic">Logística →</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setCurrentView(View.SCANNER)} className="w-full bg-[#1A3C34] text-white py-6 rounded-2xl shadow-lg flex flex-col items-center space-y-2 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#D96C4D]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                <span className="font-bold text-lg">Escanear QR de Campo</span>
              </button>

              <button onClick={() => setCurrentView(View.MANUAL_ENTRY)} className="w-full bg-white border border-stone-200 text-[#1A3C34] py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 active:bg-stone-50 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span>Entrada Manual de Datos</span>
              </button>
            </div>

            <div className="space-y-3 pb-4">
              <h3 className="font-black text-stone-400 uppercase text-[10px] tracking-widest">Cajas siendo llenadas hoy</h3>
              {cajas.filter(c => c.estado === 'vinculada').map(c => (
                <div key={c.id} onClick={() => { setActiveCajaId(c.id); setCurrentView(View.CONTROL_CENTER); }} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-[#D96C4D] flex justify-between items-center cursor-pointer active:bg-stone-50">
                   <div>
                     <p className="font-black text-slate-800">Caja {c.id}</p>
                     <p className="text-xs text-slate-500">Fila {c.fila_id} • Lote: {c.batch_id?.slice(-8)}</p>
                   </div>
                   <div className="bg-[#D96C4D]/10 text-[#D96C4D] px-3 py-1 rounded-full text-[10px] font-bold">PESAJE...</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === View.SCANNER && <Scanner onScan={handleScan} />}
        {currentView === View.MANUAL_ENTRY && <ManualEntry onBack={() => setCurrentView(View.DASHBOARD)} onSubmit={handleManualInput} />}
        {currentView === View.FILA_FORM && <RowForm filaId={activeFilaId!} onBack={() => setCurrentView(View.DASHBOARD)} onSubmit={handleCreateCiclo} />}
        {currentView === View.CAJA_FORM && <BoxForm cajaId={activeCajaId!} filas={INITIAL_FILAS} activeCiclos={ciclos.filter(c => c.estado === 'activo')} onBack={() => setCurrentView(View.DASHBOARD)} onLink={handleLinkCaja} />}
        {currentView === View.CONTROL_CENTER && <ControlCenter caja={getCaja(activeCajaId!)} onBack={() => setCurrentView(View.DASHBOARD)} onFinalize={handleFinalizeCaja} />}
        {currentView === View.QR_GENERATOR && <QRGenerator onBack={() => setCurrentView(View.DASHBOARD)} />}
        {currentView === View.REPORTS && <Reports historico={historico} />}
        {currentView === View.SETTINGS && <Settings config={config} setConfig={setConfig} onReset={resetAllData} />}
        {currentView === View.ACTIVE_CROPS && <ActiveCrops ciclos={ciclos.filter(c => c.estado === 'activo')} onBack={() => setCurrentView(View.DASHBOARD)} onFinalize={handleFinalizeCiclo} />}
        {currentView === View.LOGISTICA && <Logistica historico={historico} onBack={() => setCurrentView(View.DASHBOARD)} onDespacho={handleDespacho} />}
      </main>

      <nav className="bg-white border-t border-stone-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 safe-bottom no-print">
        <div className="grid grid-cols-5 h-20">
          {[
            { v: View.DASHBOARD, label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { v: View.LOGISTICA, label: 'Logística', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
            { v: View.REPORTS, label: 'Reportes', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { v: View.QR_GENERATOR, label: 'QR', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
            { v: View.SETTINGS, label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
          ].map(item => (
            <button key={item.v} onClick={() => setCurrentView(item.v)} className={`flex flex-col items-center justify-center ${currentView === item.v ? 'text-[#1A3C34]' : 'text-stone-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
              {currentView === item.v && <div className="h-0.5 w-3 bg-[#D96C4D] rounded-full mt-1"></div>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
