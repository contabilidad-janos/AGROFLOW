
import React from 'react';
import { AppConfig } from '../types';

interface SettingsProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onReset: () => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave, onReset, onBack }) => {
  const [localConfig, setLocalConfig] = React.useState(config);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-[#1A3C34]">Configuración</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Nombre de la Finca / Sede</label>
          <input 
            type="text" 
            className="w-full p-4 bg-white border border-stone-200 rounded-xl"
            value={localConfig.nombreFinca}
            onChange={e => setLocalConfig({...localConfig, nombreFinca: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Operario Predeterminado</label>
          <input 
            type="text" 
            className="w-full p-4 bg-white border border-stone-200 rounded-xl"
            value={localConfig.operario}
            onChange={e => setLocalConfig({...localConfig, operario: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Vite API URL (Solo lectura)</label>
          <input 
            type="text" 
            disabled
            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 text-xs font-mono"
            value={import.meta.env.VITE_API_URL || 'http://localhost:3000'}
          />
        </div>

        <button 
          onClick={() => onSave(localConfig)}
          className="w-full bg-[#1A3C34] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          Guardar Cambios
        </button>

        <hr className="border-stone-200 my-6" />

        <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
          <h3 className="text-red-800 font-bold text-sm">Zona de Peligro</h3>
          <p className="text-xs text-red-600">
            Esta acción borrará todos los datos locales de prueba y reiniciará la aplicación a su estado de fábrica.
          </p>
          <button 
            onClick={() => {
                if(confirm("¿Estás seguro de borrar TODOS los datos locales? Esta acción es irreversible.")) {
                    onReset();
                }
            }}
            className="w-full bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 text-xs transition-colors"
          >
            Borrar Datos y Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
