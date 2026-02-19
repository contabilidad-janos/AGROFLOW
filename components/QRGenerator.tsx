
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  onBack: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onBack }) => {
  const [type, setType] = useState<'fila' | 'caja'>('caja');
  const [startId, setStartId] = useState<number>(1);
  const [endId, setEndId] = useState<number>(12);

  const labels = [];
  if (type === 'fila') {
    for (let i = 1; i <= 10; i++) {
      labels.push({ id: i.toString(), url: `${window.location.origin}/fila/${i}`, label: `Fila ${i}` });
    }
  } else {
    for (let i = startId; i <= endId; i++) {
      const boxId = `C${i.toString().padStart(4, '0')}`;
      labels.push({ id: boxId, url: `${window.location.origin}/caja/${boxId}`, label: `Caja ${boxId}` });
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print-container animate-in fade-in duration-500">
      {/* Header y Controles - No se imprimen */}
      <div className="no-print space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-black text-[#1A3C34]">Generar Etiquetas</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-6">
          <div className="flex bg-stone-100 p-1.5 rounded-xl">
            <button 
              onClick={() => setType('fila')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${type === 'fila' ? 'bg-white shadow-md text-[#1A3C34]' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Maestro de Filas
            </button>
            <button 
              onClick={() => setType('caja')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${type === 'caja' ? 'bg-white shadow-md text-[#1A3C34]' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Lote de Cajas
            </button>
          </div>

          {type === 'caja' && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div>
                <label className="text-[10px] uppercase font-black text-stone-400 block mb-2 tracking-widest ml-1">ID Inicial</label>
                <input 
                  type="number" 
                  value={startId} 
                  onChange={(e) => setStartId(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D96C4D] outline-none font-black text-lg text-[#1A3C34]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-stone-400 block mb-2 tracking-widest ml-1">ID Final</label>
                <input 
                  type="number" 
                  value={endId} 
                  onChange={(e) => setEndId(Math.max(startId, parseInt(e.target.value) || startId))}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D96C4D] outline-none font-black text-lg text-[#1A3C34]"
                />
              </div>
            </div>
          )}
          
          <button 
            onClick={handlePrint}
            className="w-full bg-[#D96C4D] hover:bg-[#D96C4D]/90 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-[#D96C4D]/20 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Imprimir {labels.length} Etiquetas</span>
          </button>
          
          <p className="text-[10px] text-stone-400 text-center font-bold italic">
            * Se recomienda usar papel adhesivo A4 para facilitar la aplicación en campo.
          </p>
        </div>
        
        <div className="px-2">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Vista Previa de Impresión</h3>
        </div>
      </div>

      {/* Grid de Etiquetas - Se ajusta en impresión */}
      <div className="print-grid grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
        {labels.map((item) => (
          <div 
            key={item.id} 
            className="label-card bg-white p-6 rounded-2xl border border-stone-200 flex flex-col items-center justify-center space-y-4 text-center transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="text-[9px] font-black text-[#1A3C34] uppercase tracking-[0.2em]">AgroFlow • Juntos Farm</div>
              <div className="h-0.5 w-12 bg-[#D96C4D] rounded-full"></div>
            </div>
            
            <div className="p-2 bg-white rounded-lg border border-stone-100 shadow-sm">
              <QRCodeSVG 
                value={item.url} 
                size={140} 
                level="H"
                includeMargin={false}
              />
            </div>
            
            <div className="space-y-0.5">
              <div className="font-black text-xl text-[#1A3C34] tracking-tight leading-none">{item.label}</div>
              <div className="text-[8px] font-black text-stone-400 font-mono uppercase tracking-widest">{type.toUpperCase()} ID: {item.id}</div>
            </div>
            
            <div className="text-[6px] text-stone-300 w-full truncate px-4 no-print opacity-50">
              {item.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRGenerator;
