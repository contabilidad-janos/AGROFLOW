
import React from 'react';
import { HistoricoProduccion } from '../types';

interface LogisticaProps {
  historico: HistoricoProduccion[];
  onBack: () => void;
  onDespacho: (id: string) => void;
}

const Logistica: React.FC<LogisticaProps> = ({ historico, onBack, onDespacho }) => {
  const enAlmacen = historico.filter(h => h.estado_logistico === 'almacen');
  const despachados = historico.filter(h => h.estado_logistico === 'despachado').slice(0, 10);

  const getDestinoIcon = (destino: string) => {
    switch(destino) {
      case 'tienda': return '🏪';
      case 'distribucion': return '🚚';
      case 'mermas': return '🗑️';
      default: return '📍';
    }
  };

  const getDestinoColor = (destino: string) => {
    switch(destino) {
      case 'tienda': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'distribucion': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'mermas': return 'text-[#D96C4D] bg-[#D96C4D]/5 border-[#D96C4D]/10';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#1A3C34]">Gestión Logística</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Pendientes de Despacho ({enAlmacen.length})</h3>
        {enAlmacen.length === 0 ? (
          <p className="text-center py-8 text-xs text-stone-400 italic">No hay producto pendiente en el almacén de Juntos Farm.</p>
        ) : (
          <div className="space-y-3">
            {enAlmacen.map(h => (
              <div key={h.id} className={`p-4 rounded-xl border-l-4 flex flex-col space-y-3 bg-white border border-stone-100 shadow-sm ${
                h.clasificacion === 'A' ? 'border-l-emerald-500' : h.clasificacion === 'B' ? 'border-l-blue-500' : 'border-l-[#D96C4D]'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-slate-800">Caja {h.caja_id} <span className="text-xs font-bold text-stone-400">• {h.peso} kg</span></p>
                    <div className="flex items-center mt-1 space-x-2">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getDestinoColor(h.destino)}`}>
                         {getDestinoIcon(h.destino)} {h.destino === 'tienda' ? 'A Tienda' : h.destino === 'distribucion' ? 'Distribución' : 'Merma/Proceso'}
                       </span>
                       <span className="text-[9px] text-stone-400 font-bold">Lote: {h.batch_id.slice(-8)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDespacho(h.id)}
                    className="bg-[#1A3C34] text-white px-3 py-2 rounded-lg text-[10px] font-bold active:scale-95 transition-all shadow-md"
                  >
                    Confirmar Envío
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">Despachos Recientes</h3>
        {despachados.map(h => (
          <div key={h.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex justify-between items-center opacity-70">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getDestinoIcon(h.destino)}</span>
              <div>
                <p className="font-bold text-slate-700 text-sm">Caja {h.caja_id} - {h.destino.toUpperCase()}</p>
                <p className="text-[10px] text-stone-400">Enviado: {new Date(h.fecha_despacho!).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 text-xs">{h.peso} kg</p>
              <p className="text-[9px] font-bold text-emerald-600 uppercase">ENTREGADO</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logistica;
