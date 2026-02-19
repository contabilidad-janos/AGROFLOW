
import { createClient } from '@supabase/supabase-js';
import { CicloCultivo, Caja, HistoricoProduccion, Fila } from '../types';

// Environment variables for Vercel/Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase credentials missing! Check your .env setup.');
}

// Removed explicit schema selection to default to 'public'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper functions (optional wrapper for type safety if needed, 
// but using supabase directly in components is also fine for simple apps)
export const fetchFilas = async () => {
    const { data, error } = await supabase.from('agroflow_filas').select('*').order('id');
    if (error) throw error;
    return data as Fila[];
};

export const fetchCiclos = async () => {
    const { data, error } = await supabase.from('agroflow_ciclos').select('*');
    if (error) throw error;
    return data as CicloCultivo[];
};

export const fetchCajas = async () => {
    const { data, error } = await supabase.from('agroflow_cajas').select('*');
    if (error) throw error;
    return data as Caja[];
};

export const fetchHistorico = async () => {
    const { data, error } = await supabase.from('agroflow_historico').select('*').order('fecha', { ascending: false });
    if (error) throw error;
    return data as HistoricoProduccion[];
};
