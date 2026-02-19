
import React, { useState } from 'react';
import { Caja } from '../types';

interface ControlCenterProps {
  caja: Caja;
  onBack: () => void;
  onFinalize: (peso: number, clasificacion: 'A' | 'B' | 'C') => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ caja, onBack, onFinalize }) => {
  const [peso, setPeso] = useState<string>('');
  const [clasificacion, setClasificacion] = useState<'A' | 'B' | 'C'>('A');

  const handleFinish = () => {
    const p = parseFloat(peso);
    if (isNaN(p) || p <= 0) {
      alert("Por favor, ingresa un peso válido.");
      return;
    }
    onFinalize(p, clasificacion);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">Control de Calidad</h2>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16"></div>
        <p className="text-xs font-bold uppercase text-emerald-400 mb-1">Caja en Procesamiento</p>
        <h3 className="text-3xl font-bold mb-4">{caja.id}</h3>
        <div className="flex justify-between text-sm opacity-80 border-t border-white/10 pt-4">
          <span>Fila: {caja.fila_id}</span>
          <span>Lote: {caja.batch_id}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Peso de la Caja (kg)</label>
          <div className="relative">
            <input 
              type="number"
              step="0.01"
              className="w-full p-6 text-3xl font-bold bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all pr-16"
              placeholder="0.00"
              value={peso}
              onChange={e => setPeso(e.target.value)}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">KG</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Clasificación de Calidad</label>
          <div className="grid grid-cols-3 gap-3">
            {(['A', 'B', 'C'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setClasificacion(cat)}
                className={`py-6 rounded-2xl font-bold text-xl border-2 transition-all ${
                  clasificacion === cat 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105' 
                  : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-slate-500">
              {clasificacion === 'A' && 'Premium - Exportación'}
              {clasificacion === 'B' && 'Estándar - Mercado Local'}
              {clasificacion === 'C' && 'Industrial - Procesados'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Finalizar y Resetear Caja</span>
        </button>
        
        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Los datos se enviarán a N8N para su vectorización
        </p>
      </div>
    </div>
  );
};

export default ControlCenter;
