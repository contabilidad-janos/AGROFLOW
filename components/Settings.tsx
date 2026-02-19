
import React from 'react';
import { AppConfig } from '../types';

interface SettingsProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, onReset }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-slate-800">Ajustes</h2>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Información General</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre de la Finca</label>
            <input 
              type="text" 
              value={config.nombreFinca}
              onChange={(e) => setConfig({...config, nombreFinca: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Operario por Defecto</label>
            <input 
              type="text" 
              value={config.operario}
              onChange={(e) => setConfig({...config, operario: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Integraciones</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Webhook URL (n8n)</label>
            <input 
              type="text" 
              placeholder="https://n8n.tuempresa.com/..."
              value={config.webhookUrl}
              onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
            />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
          <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">Zona Peligrosa</h3>
          <p className="text-xs text-red-600">Al resetear se borrarán todos los datos guardados en este dispositivo de forma permanente.</p>
          <button 
            onClick={onReset}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
          >
            Borrar Todo y Reiniciar
          </button>
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AgroFlow PWA v1.2.0</p>
        <p className="text-[8px] text-slate-300 mt-1">Desarrollado para gestión agrícola de precisión</p>
      </div>
    </div>
  );
};

export default Settings;
