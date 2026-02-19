
import React from 'react';
import { Fila, CicloCultivo } from '../types';

interface BoxFormProps {
  cajaId: string;
  filas: Fila[];
  activeCiclos: CicloCultivo[];
  onBack: () => void;
  onLink: (filaId: number) => void;
}

const BoxForm: React.FC<BoxFormProps> = ({ cajaId, filas, activeCiclos, onBack, onLink }) => {
  const isRowActive = (filaId: number) => activeCiclos.some(c => c.fila_id === filaId);
  const getVariety = (filaId: number) => activeCiclos.find(c => c.fila_id === filaId)?.variedad_planta || 'Sin Siembra';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-black text-[#1A3C34]">Vincular Caja: {cajaId}</h2>
      </div>

      <div className="bg-[#1A3C34]/5 p-5 rounded-2xl border border-[#1A3C34]/10">
        <p className="text-xs font-bold text-[#1A3C34] leading-relaxed">
          Selecciona la fila de origen. <span className="text-[#D96C4D]">Solo las filas resaltadas</span> tienen una siembra activa para recolectar hoy.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filas.map(f => {
          const active = isRowActive(f.id);
          const variety = getVariety(f.id);

          return (
            <button
              key={f.id}
              onClick={() => active ? onLink(f.id) : null}
              className={`relative p-5 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 border-2 text-center group ${
                active 
                ? 'bg-white border-emerald-500 shadow-md shadow-emerald-100 active:scale-95 cursor-pointer' 
                : 'bg-stone-50 border-stone-200 border-dashed opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-1">
                <span className={`text-2xl font-black ${active ? 'text-[#1A3C34]' : 'text-stone-300'}`}>#{f.id}</span>
                {active && (
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <div className="space-y-0.5">
                <span className={`text-[10px] font-black uppercase tracking-widest block ${active ? 'text-[#D96C4D]' : 'text-stone-400'}`}>
                  {active ? '🌱 En Cosecha' : '🚫 Vacío'}
                </span>
                <span className={`text-[9px] font-bold block truncate max-w-[120px] ${active ? 'text-slate-600' : 'text-stone-400'}`}>
                  {variety}
                </span>
              </div>

              {active && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BoxForm;
