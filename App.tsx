
import React, { useState, useEffect } from 'react';
import { View, Fila, CicloCultivo, Caja, AppConfig, HistoricoProduccion } from './types';
import { fetchFilas, fetchCiclos, fetchCajas, fetchHistorico, supabase } from './services/supabase';
import Scanner from './components/Scanner';
import ManualEntry from './components/ManualEntry';
import RowForm from './components/RowForm';
import BoxForm from './components/BoxForm';
import ControlCenter from './components/ControlCenter';
import QRGenerator from './components/QRGenerator';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ActiveCrops from './components/ActiveCrops';
import Logistica from './components/Logistica';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [filas, setFilas] = useState<Fila[]>([]);
  const [ciclos, setCiclos] = useState<CicloCultivo[]>([]);
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [historico, setHistorico] = useState<HistoricoProduccion[]>([]);
  const [selectedFilaId, setSelectedFilaId] = useState<number | null>(null);
  const [selectedCajaId, setSelectedCajaId] = useState<string | null>(null);
  
  const [config, setConfig] = useState<AppConfig>({
    webhookUrl: '',
    nombreFinca: 'Juntos Farm - Sede Principal',
    operario: 'Invitado'
  });

  const loadData = async () => {
    try {
        const [f, c, k, h] = await Promise.all([
            fetchFilas(),
            fetchCiclos(),
            fetchCajas(),
            fetchHistorico()
        ]);
        setFilas(f);
        setCiclos(c);
        setCajas(k);
        setHistorico(h);
    } catch (e) {
        console.error("Error loading data:", e);
    }
  };

  useEffect(() => {
    loadData();

    const channel = supabase.channel('realtime_updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          loadData();
      })
      .subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
  }, []);

  const handleScan = (decodedText: string) => {
    if (decodedText.includes('/fila/')) {
        const id = parseInt(decodedText.split('/fila/')[1]);
        if (!isNaN(id)) {
            setSelectedFilaId(id);
            setCurrentView(View.FILA_FORM);
        }
    } else if (decodedText.includes('/caja/')) {
        const id = decodedText.split('/caja/')[1];
        if (id) {
            setSelectedCajaId(id);
            const existingCaja = cajas.find(c => c.id === id);
            
            if (existingCaja) { 
               if(existingCaja.estado === 'disponible') {
                  setCurrentView(View.CAJA_FORM);
               } else if (existingCaja.estado === 'vinculada') {
                  setCurrentView(View.CONTROL_CENTER);
               } else {
                  alert("Esta caja ya ha sido procesada.");
                  setCurrentView(View.DASHBOARD);
               }
            } else {
               // Create temp local caja if not exists in DB yet (or handle error)
               // For now assuming we just use the ID to create a new one
               setCurrentView(View.CAJA_FORM);
            }
        }
    } else {
        alert("Código QR no reconocido: " + decodedText);
    }
  };

  const handleManualSubmit = (type: 'fila' | 'caja', id: string) => {
      if (type === 'fila') {
          setSelectedFilaId(parseInt(id));
          setCurrentView(View.FILA_FORM);
      } else {
          setSelectedCajaId(id);
          const existingCaja = cajas.find(c => c.id === id);
          if(existingCaja && existingCaja.estado !== 'disponible') {
             if(existingCaja.estado === 'vinculada') setCurrentView(View.CONTROL_CENTER);
             else alert("Caja ya procesada");
          } else {
             setCurrentView(View.CAJA_FORM);
          }
      }
  };

  const activeCiclos = ciclos.filter(c => c.estado === 'activo');

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#F9F5F0] shadow-xl overflow-hidden relative">
      
      {/* Header */}
      <header className="bg-[#1A3C34] text-white p-4 shadow-md sticky top-0 z-50 no-print flex justify-between items-center">
        <div>
           <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
             <span className="text-[#D96C4D]">●</span> AgroFlow
           </h1>
           <p className="text-[10px] text-emerald-100 font-medium tracking-wide uppercase">{config.nombreFinca}</p>
        </div>
        <button onClick={() => setCurrentView(View.SETTINGS)} className="p-2 bg-[#1A3C34] hover:bg-emerald-900 rounded-full transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32">
        {currentView === View.DASHBOARD && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div onClick={() => setCurrentView(View.ACTIVE_CROPS)} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer group hover:border-emerald-300 transition-all">
                  <div className="absolute right-[-10px] top-[-10px] bg-emerald-50 rounded-full w-20 h-20 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Siembras Activas</p>
                     <p className="text-4xl font-black text-[#1A3C34] mt-1">{activeCiclos.length}</p>
                  </div>
                  <div className="relative z-10 flex items-center text-xs font-bold text-emerald-600 mt-2">
                     <span>Ver detalles</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </div>
               </div>

               <div onClick={() => setCurrentView(View.REPORTS)} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer group hover:border-[#D96C4D]/30 transition-all">
                  <div className="absolute right-[-10px] top-[-10px] bg-[#D96C4D]/5 rounded-full w-20 h-20 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Producción Hoy</p>
                     <p className="text-4xl font-black text-[#1A3C34] mt-1">
                        {historico.filter(h => new Date(h.fecha).toDateString() === new Date().toDateString())
                                  .reduce((acc, curr) => acc + curr.peso, 0).toFixed(1)} <span className="text-base text-stone-400">kg</span>
                     </p>
                  </div>
                  <div className="relative z-10 flex items-center text-xs font-bold text-[#D96C4D] mt-2">
                     <span>Ver reportes</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setCurrentView(View.SCANNER)} className="bg-[#1A3C34] text-white p-5 rounded-2xl shadow-lg active:scale-95 transition-all text-left group relative overflow-hidden h-40 flex flex-col justify-end">
                  <div className="absolute top-4 left-4 bg-white/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  </div>
                  <span className="font-bold text-lg leading-tight">Escanear QR</span>
                  <span className="text-xs text-emerald-200 mt-1 font-medium">Fila o Caja</span>
               </button>

               <button onClick={() => setCurrentView(View.MANUAL_ENTRY)} className="bg-white text-[#1A3C34] border border-stone-200 p-5 rounded-2xl shadow-sm active:scale-95 transition-all text-left h-40 flex flex-col justify-end">
                  <div className="absolute top-4 left-4 bg-stone-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <span className="font-bold text-lg leading-tight">Entrada Manual</span>
                  <span className="text-xs text-stone-500 mt-1 font-medium">Problemas de cámara</span>
               </button>
            </div>

            <button onClick={() => setCurrentView(View.LOGISTICA)} className="w-full bg-[#D96C4D] text-white p-4 rounded-xl shadow-md flex items-center justify-between px-6 active:scale-95 transition-all">
                <span className="font-bold">Gestión Logística y Envíos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>
            </button>

            <div className="pt-4 border-t border-stone-200">
               <button onClick={() => setCurrentView(View.QR_GENERATOR)} className="w-full py-3 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-[#1A3C34] transition-colors flex items-center justify-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                 <span>Imprimir Etiquetas</span>
               </button>
            </div>
          </div>
        )}

        {currentView === View.SCANNER && <Scanner onScan={handleScan} />}
        
        {currentView === View.MANUAL_ENTRY && (
           <ManualEntry onBack={() => setCurrentView(View.DASHBOARD)} onSubmit={handleManualSubmit} />
        )}

        {currentView === View.FILA_FORM && selectedFilaId && (
            <RowForm 
              filaId={selectedFilaId} 
              onBack={() => setCurrentView(View.DASHBOARD)} 
              onSubmit={async (data) => {
                  try {
                      await supabase.from('agroflow_ciclos').insert([
                        { id: crypto.randomUUID(), fila_id: selectedFilaId, ...data, estado: 'activo' }
                      ]);
                      alert("Siembra Registrada Correctamente");
                      setCurrentView(View.DASHBOARD);
                  } catch(e) { console.error(e); alert("Error al guardar"); }
              }} 
            />
        )}

        {currentView === View.CAJA_FORM && selectedCajaId && (
            <BoxForm 
              cajaId={selectedCajaId}
              filas={filas}
              activeCiclos={activeCiclos}
              onBack={() => setCurrentView(View.DASHBOARD)}
              onLink={async (filaId) => {
                  const ciclo = activeCiclos.find(c => c.fila_id === filaId);
                  if(!ciclo) return;
                  try {
                      const { data: existing } = await supabase.from('agroflow_cajas').select('*').eq('id', selectedCajaId).single();
                      if(!existing) {
                          await supabase.from('agroflow_cajas').insert([{
                              id: selectedCajaId, fila_id: filaId, batch_id: ciclo.batch_id, estado: 'vinculada'
                          }]);
                      } else {
                          await supabase.from('agroflow_cajas').update({
                              fila_id: filaId, batch_id: ciclo.batch_id, estado: 'vinculada'
                          }).eq('id', selectedCajaId);
                      }
                      setCurrentView(View.CONTROL_CENTER);
                  } catch(e) { console.error(e); alert("Error al vincular"); }
              }}
            />
        )}

        {currentView === View.CONTROL_CENTER && selectedCajaId && (
            <ControlCenter 
               caja={cajas.find(c => c.id === selectedCajaId) || { id: selectedCajaId, fila_id: 0, batch_id: 'UNKNOWN', estado: 'vinculada' } as Caja}
               onBack={() => setCurrentView(View.DASHBOARD)}
               onFinalize={async (peso, clasificacion) => {
                  const caja = cajas.find(c => c.id === selectedCajaId);
                  if(!caja) return;

                   try {
                       // 1. Update Caja status
                       await supabase.from('agroflow_cajas').update({ 
                           peso, clasificacion, estado: 'pesada' 
                       }).eq('id', selectedCajaId);

                       // 2. Add to History
                       await supabase.from('agroflow_historico').insert([{
                           id: crypto.randomUUID(),
                           caja_id: selectedCajaId,
                           batch_id: caja.batch_id!, // Non-null assertion if logic holds
                           peso,
                           clasificacion,
                           fecha: new Date().toISOString(),
                           fila_id: caja.fila_id!,
                           estado_logistico: 'almacen',
                           destino: clasificacion === 'A' ? 'tienda' : clasificacion === 'B' ? 'distribucion' : 'mermas'
                       }]);
                       
                       // 3. Reset Caja for reuse (Optional, depends on flow. Here we keep it pesada until dispatch?) 
                       // Actually, let's keep it 'pesada' so logistica can pick it up.

                       alert("Calidad Registrada. Caja lista para logística.");
                       setCurrentView(View.DASHBOARD);
                   } catch(e) { console.error(e); alert("Error al finalizar"); }
               }}
            />
        )}

        {currentView === View.QR_GENERATOR && <QRGenerator onBack={() => setCurrentView(View.DASHBOARD)} />}
        
        {currentView === View.REPORTS && <Reports historico={historico.filter(h => new Date(h.fecha).toDateString() === new Date().toDateString())} />}

        {currentView === View.SETTINGS && (
           <Settings 
             config={config} 
             onBack={() => setCurrentView(View.DASHBOARD)} 
             onSave={(newConfig) => {
                 setConfig(newConfig);
                 setCurrentView(View.DASHBOARD);
             }}
             onReset={() => {
                 if(confirm("Reiniciar todo?")) {
                     localStorage.clear();
                     window.location.reload();
                 }
             }}
           />
        )}

        {currentView === View.ACTIVE_CROPS && (
            <ActiveCrops 
              ciclos={activeCiclos} 
              onBack={() => setCurrentView(View.DASHBOARD)}
              onFinalize={async (id) => {
                  await supabase.from('agroflow_ciclos').update({ estado: 'finalizado' }).eq('id', id);
              }}
            />
        )}

        {currentView === View.LOGISTICA && (
            <Logistica 
              historico={historico} 
              onBack={() => setCurrentView(View.DASHBOARD)} 
              onDespacho={async (historicoId) => {
                  await supabase.from('agroflow_historico').update({
                      estado_logistico: 'despachado',
                      fecha_despacho: new Date().toISOString()
                  }).eq('id', historicoId);
                  
                  // Release box also?
                  const h = historico.find(x => x.id === historicoId);
                  if(h) {
                      await supabase.from('agroflow_cajas').update({
                          estado: 'disponible', peso: null, clasificacion: null, batch_id: null, fila_id: null
                      }).eq('id', h.caja_id);
                  }
                  alert("Despacho Confirmado");
              }}
            />
        )}

      </main>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-stone-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 safe-bottom no-print">
        <div className="flex justify-around items-center p-3">
           <button onClick={() => setCurrentView(View.DASHBOARD)} className={`flex flex-col items-center space-y-1 ${currentView === View.DASHBOARD ? 'text-[#1A3C34]' : 'text-stone-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={currentView === View.DASHBOARD ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="text-[10px] font-bold">Inicio</span>
           </button>
           
           <button onClick={() => setCurrentView(View.SCANNER)} className="relative bottom-5 bg-[#1A3C34] text-white p-4 rounded-full shadow-lg border-4 border-[#F9F5F0] active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
           </button>

           <button onClick={() => setCurrentView(View.REPORTS)} className={`flex flex-col items-center space-y-1 ${currentView === View.REPORTS ? 'text-[#1A3C34]' : 'text-stone-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={currentView === View.REPORTS ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-[10px] font-bold">Reportes</span>
           </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
