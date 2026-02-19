
import React, { useState } from 'react';
import { CicloCultivo } from '../types';
import { analyzeCropImage } from '../services/geminiService';

interface RowFormProps {
  filaId: number;
  onBack: () => void;
  onSubmit: (data: Partial<CicloCultivo>) => void;
}

const METODOS_LABRADO = [
  "Manual con Azadón",
  "Motocultor Ligero",
  "Labranza Mínima",
  "Surcado Tradicional",
  "Sin Labranza (Siembra Directa)"
];

const ABONOS = [
  "Orgánico (Composta)",
  "Humus de Lombriz",
  "NPK 15-15-15",
  "Urea",
  "Foliar Multivitamínico",
  "Sin Abono Inicial"
];

const VARIEDADES = [
  "Tomate Cherry",
  "Tomate Manzano",
  "Pimiento Bell",
  "Lechuga Romana",
  "Albahaca Italiana",
  "Cilantro Criollo",
  "Cebolla Larga",
  "Chile Jalapeño"
];

const TRATAMIENTOS_INICIALES = [
  "Preventivo de Hongos",
  "Control de Plagas (Orgánico)",
  "Riego de Asiento",
  "Fortalecedor de Raíz",
  "Poda de Limpieza",
  "Ninguno"
];

const RowForm: React.FC<RowFormProps> = ({ filaId, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    metodo_labrado: METODOS_LABRADO[0],
    abono: ABONOS[0],
    variedad_planta: VARIEDADES[0],
    tratamientos: TRATAMIENTOS_INICIALES[0]
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleGeminiAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAiAnalysis(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const result = await analyzeCropImage(base64);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const selectClasses = "w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1A3C34] focus:outline-none transition-all appearance-none font-medium text-slate-700 cursor-pointer shadow-sm";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#1A3C34]">Nueva Siembra: Fila {filaId}</h2>
      </div>

      <div className="space-y-5">
        <div className="relative">
          <label className="block text-[10px] font-black text-stone-400 uppercase mb-2 tracking-widest ml-1">Variedad de Planta</label>
          <select 
            className={selectClasses}
            value={formData.variedad_planta}
            onChange={e => setFormData({...formData, variedad_planta: e.target.value})}
          >
            {VARIEDADES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[10px] font-black text-stone-400 uppercase mb-2 tracking-widest ml-1">Método de Labrado</label>
          <select 
            className={selectClasses}
            value={formData.metodo_labrado}
            onChange={e => setFormData({...formData, metodo_labrado: e.target.value})}
          >
            {METODOS_LABRADO.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[10px] font-black text-stone-400 uppercase mb-2 tracking-widest ml-1">Abono Utilizado</label>
          <select 
            className={selectClasses}
            value={formData.abono}
            onChange={e => setFormData({...formData, abono: e.target.value})}
          >
            {ABONOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[10px] font-black text-stone-400 uppercase mb-2 tracking-widest ml-1">Tratamiento Inicial</label>
          <select 
            className={selectClasses}
            value={formData.tratamientos}
            onChange={e => setFormData({...formData, tratamientos: e.target.value})}
          >
            {TRATAMIENTOS_INICIALES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </div>

        {/* Gemini Integration */}
        <div className="p-4 bg-[#1A3C34]/5 border border-[#1A3C34]/10 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-black text-[#1A3C34] uppercase tracking-wider">Asistente IA Juntos</h3>
              <p className="text-[9px] text-stone-500 font-bold">Analizar estado de la tierra o plántula</p>
            </div>
            <label className="cursor-pointer bg-[#D96C4D] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#D96C4D]/90 shadow-md transition-all active:scale-95">
              {isAnalyzing ? 'Analizando...' : 'Tomar Foto'}
              <input type="file" className="hidden" accept="image/*" onChange={handleGeminiAnalysis} disabled={isAnalyzing} />
            </label>
          </div>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 animate-pulse mt-2">
               <div className="w-2 h-2 bg-[#D96C4D] rounded-full"></div>
               <p className="text-[10px] text-[#1A3C34] font-bold">Consultando a Gemini...</p>
            </div>
          )}
          {aiAnalysis && (
            <div className="mt-3 text-[11px] text-[#1A3C34] bg-white p-3 rounded-lg border border-[#1A3C34]/10 italic leading-relaxed">
              "{aiAnalysis}"
            </div>
          )}
        </div>

        <button 
          onClick={() => onSubmit(formData)}
          className="w-full bg-[#1A3C34] hover:bg-[#1A3C34]/90 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Registrar Siembra y Crear Lote</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default RowForm;
