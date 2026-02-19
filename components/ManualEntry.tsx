
import React, { useState } from 'react';

interface ManualEntryProps {
  onBack: () => void;
  onSubmit: (type: 'fila' | 'caja', id: string) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onBack, onSubmit }) => {
  const [type, setType] = useState<'fila' | 'caja'>('fila');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmit(type, inputValue.trim());
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-stone-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#1A3C34]">Entrada Manual</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        <div className="flex bg-stone-100 p-1.5 rounded-xl">
          <button 
            onClick={() => { setType('fila'); setInputValue(''); }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${type === 'fila' ? 'bg-white shadow-md text-[#D96C4D]' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Identificar Fila
          </button>
          <button 
            onClick={() => { setType('caja'); setInputValue(''); }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${type === 'caja' ? 'bg-white shadow-md text-[#D96C4D]' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Identificar Caja
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-bold text-stone-400 mb-2 tracking-widest">
              {type === 'fila' ? 'Número de Fila (Ej: 5)' : 'Código de Caja (Ej: C0001)'}
            </label>
            <input 
              type={type === 'fila' ? 'number' : 'text'}
              autoFocus
              className="w-full p-5 text-2xl font-black bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-[#D96C4D]/10 focus:border-[#D96C4D] outline-none transition-all placeholder:text-stone-300"
              placeholder={type === 'fila' ? "0" : "C0000"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="w-full bg-[#1A3C34] hover:bg-[#D96C4D] disabled:bg-stone-300 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Acceder al Registro</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>

      <div className="bg-[#D96C4D]/5 p-4 rounded-xl border border-[#D96C4D]/20">
        <p className="text-xs text-[#1A3C34]/70 leading-relaxed">
          <span className="font-bold">Nota:</span> Use esta opción si el código QR está dañado o no hay suficiente luz para el escaneo en Juntos Farm.
        </p>
      </div>
    </div>
  );
};

export default ManualEntry;
