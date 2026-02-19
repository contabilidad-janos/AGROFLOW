
import React, { useState, useRef } from 'react';
import { Fila, CicloCultivo } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RowFormProps {
  filaId: number;
  onBack: () => void;
  onSubmit: (data: Omit<CicloCultivo, 'id' | 'fila_id' | 'estado'>) => void;
}

const RowForm: React.FC<RowFormProps> = ({ filaId, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    batch_id: `LOTE-${new Date().getFullYear()}-${filaId}-${Math.floor(Math.random() * 1000)}`,
    metodo_labrado: 'Tradicional',
    abono: 'Orgánico - Compost',
    variedad_planta: 'Tomate Cherry',
    tratamientos: 'Ninguno',
    fecha_inicio: new Date().toISOString().split('T')[0]
  });

  const [analyzingIds, setAnalyzingIds] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGeminiAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingIds(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const base64Data = base64Image.split(',')[1];

      try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = client.models.getModel('gemini-2.0-flash-001');

        const result = await model.generateContent({
             contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "Analiza esta imagen del cultivo. Identifica posibles plagas, estado de crecimiento y sugiere un tratamiento breve si es necesario. Responde en español, muy conciso (máx 3 lineas)." },
                        { inlineData: { mimeType: file.type, data: base64Data } }
                    ]
                }
             ]
        });

        const responseText = result.response.text();
        setAnalysisResult(responseText);
        setFormData(prev => ({ ...prev, tratamientos: `Análisis IA: ${responseText.slice(0, 50)}...` }));
      } catch (error) {
        console.error("Gemini Error:", error);
        setAnalysisResult("Error al analizar la imagen. Verifica tu conexión o intenta de nuevo.");
      } finally {
        setAnalyzingIds(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Nueva Siembra: Fila {filaId}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ID de Lote (Automático)</label>
          <input 
            type="text" 
            disabled 
            value={formData.batch_id}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm text-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Variedad</label>
             <select 
               className="w-full bg-white border border-slate-200 rounded-lg p-3 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
               value={formData.variedad_planta}
               onChange={e => setFormData({...formData, variedad_planta: e.target.value})}
             >
               <option>Tomate Cherry</option>
               <option>Lechuga Romana</option>
               <option>Pimiento Rojo</option>
               <option>Zanahoria Baby</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Método Labrado</label>
             <select 
               className="w-full bg-white border border-slate-200 rounded-lg p-3 font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
               value={formData.metodo_labrado}
               onChange={e => setFormData({...formData, metodo_labrado: e.target.value})}
             >
               <option>Tradicional</option>
               <option>Hidropónico</option>
               <option>Cama Elevada</option>
             </select>
           </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Abono Inicial</label>
           <input 
             type="text" 
             className="w-full bg-white border border-slate-200 rounded-lg p-3 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
             value={formData.abono}
             onChange={e => setFormData({...formData, abono: e.target.value})}
           />
        </div>

        <div className="pt-2 border-t border-slate-100">
           <label className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>Analizar Terreno con IA (Gemini)</span>
           </label>
           <input 
             type="file" 
             accept="image/*" 
             className="hidden" 
             ref={fileInputRef}
             onChange={handleGeminiAnalysis}
           />
           
           {analyzingIds && (
             <div className="text-xs text-emerald-500 animate-pulse font-medium">✨ Analizando imagen del cultivo...</div>
           )}

           {analysisResult && (
             <div className="bg-emerald-50 p-3 rounded-lg text-xs text-emerald-800 border border-emerald-100 mt-2">
               <strong>Análisis Gemini:</strong> {analysisResult}
             </div>
           )}

           <textarea 
             className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm mt-2 focus:ring-2 focus:ring-emerald-500 outline-none"
             rows={2}
             placeholder="Observaciones o Tratamientos..."
             value={formData.tratamientos}
             onChange={e => setFormData({...formData, tratamientos: e.target.value})}
           ></textarea>
        </div>

        <button 
          onClick={() => onSubmit(formData)}
          className="w-full bg-[#1A3C34] hover:bg-[#1A3C34]/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 mt-4"
        >
           <span>Registrar Siembra y Crear Lote</span>
        </button>
      </div>
    </div>
  );
};

export default RowForm;
