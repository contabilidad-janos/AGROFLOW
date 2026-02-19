
import { createClient } from '@supabase/supabase-js';
import { Fila, CicloCultivo, Caja, HistoricoProduccion } from '../types';

const SUPABASE_URL = 'https://agjvhvjhrmwkvszyjitl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanZodmpocm13a3ZzenlqaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTA1MDAsImV4cCI6MjA4MDI2NjUwMH0.8FPklsr58Z7MxWU7Pr7zttABgUNX6Q8J48OKmuVhGyo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
