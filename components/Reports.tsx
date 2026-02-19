
import React from 'react';
import { HistoricoProduccion } from '../types';

interface ReportsProps {
  historico: HistoricoProduccion[];
}

const Reports: React.FC<ReportsProps> = ({ historico }) => {
  const totalPeso = historico.reduce((acc, curr) => acc + curr.peso, 0);
  
  const destTienda = historico.filter(h => h.destino === 'tienda').reduce((acc, h) => acc + h.peso, 0);
  const destDist = historico.filter(h => h.destino === 'distribucion').reduce((acc, h) => acc + h.peso, 0);
  const destMermas = historico.filter(h => h.destino === 'mermas').reduce((acc, h) => acc + h.peso, 0);

  const countA = historico.filter(h => h.clasificacion === 'A').length;
  const countB = historico.filter(h => h.clasificacion === 'B').length;
  const countC = historico.filter(h => h.clasificacion === 'C').length;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-[#1A3C34]">Producción y Destinos</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Peso Total Cosechado (KG)</p>
            <p className="text-4xl font-black text-[#1A3C34]">{totalPeso.toFixed(2)}</p>
          </div>
          <div className="bg-[#D96C4D]/10 p-3 rounded-xl text-[#D96C4D]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
           <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest">Distribución por Destino</h4>
           <div className="space-y-4">
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-bold uppercase">
                 <span>🏪 Tienda (Calidad A)</span>
                 <span>{destTienda.toFixed(1)} kg</span>
               </div>
               <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(destTienda / (totalPeso || 1)) * 100}%` }}></div>
               </div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-bold uppercase">
                 <span>🚚 Distribución (Calidad B)</span>
                 <span>{destDist.toFixed(1)} kg</span>
               </div>
               <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(destDist / (totalPeso || 1)) * 100}%` }}></div>
               </div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-bold uppercase">
                 <span>🗑️ Mermas / Proceso (Calidad C)</span>
                 <span>{destMermas.toFixed(1)} kg</span>
               </div>
               <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                 <div className="h-full bg-[#D96C4D] transition-all duration-1000" style={{ width: `${(destMermas / (totalPeso || 1)) * 100}%` }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-stone-400 uppercase text-[10px] tracking-widest">Historial de Salidas</h3>
        {historico.slice(0, 8).map((h) => (
          <div key={h.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center">
             <div>
               <p className="font-bold text-slate-700 text-sm">
                 {h.destino === 'tienda' ? '🏪 Tienda' : h.destino === 'distribucion' ? '🚚 Distribución' : '🗑️ Mermas'}
               </p>
               <p className="text-[10px] text-stone-400">
                 {h.estado_logistico === 'despachado' ? `Enviado el ${new Date(h.fecha_despacho!).toLocaleDateString()}` : 'En Almacén Central'}
               </p>
             </div>
             <div className="text-right">
                <p className="font-black text-[#1A3C34]">{h.peso} kg</p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                  h.estado_logistico === 'despachado' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-stone-200 text-stone-400 bg-stone-50'
                }`}>
                  {h.estado_logistico === 'despachado' ? 'DESPACHADO' : 'PENDIENTE'}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
