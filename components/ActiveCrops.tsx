
import React from 'react';
import { CicloCultivo } from '../types';

interface ActiveCropsProps {
  ciclos: CicloCultivo[];
  onBack: () => void;
  onFinalize: (id: string) => void;
}

const ActiveCrops: React.FC<ActiveCropsProps> = ({ ciclos, onBack, onFinalize }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Cultivos en Curso</h2>
      </div>

      {ciclos.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center space-y-4">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
          </div>
          <p className="text-slate-500 font-medium">No hay siembras activas.</p>
          <p className="text-xs text-slate-400">Escanea un código QR de Fila para iniciar un nuevo ciclo de cultivo.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ciclos.map((ciclo) => (
            <div key={ciclo.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Fila {ciclo.fila_id}</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{ciclo.variedad_planta || 'Variedad no especificada'}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    Activo
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-tighter">Fecha Inicio</p>
                    <p className="text-slate-700 font-semibold">{new Date(ciclo.fecha_inicio).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-tighter">ID Lote (Batch)</p>
                    <p className="text-slate-700 font-mono font-bold">{ciclo.batch_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-tighter">Abono</p>
                    <p className="text-slate-700 font-semibold">{ciclo.abono || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-tighter">Tratamientos</p>
                    <p className="text-slate-700 font-semibold truncate">{ciclo.tratamientos || 'Sin tratar'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex space-x-2">
                  <button 
                    onClick={() => {
                        if(confirm(`¿Deseas finalizar el ciclo de la Fila ${ciclo.fila_id}? Esto liberará la fila para una nueva siembra.`)) {
                            onFinalize(ciclo.id);
                        }
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Finalizar Ciclo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveCrops;
