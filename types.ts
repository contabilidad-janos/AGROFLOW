
export interface Fila {
  id: number;
  nombre: string;
}

export interface CicloCultivo {
  id: string;
  fila_id: number;
  batch_id: string;
  metodo_labrado: string;
  abono: string;
  variedad_planta: string;
  tratamientos: string;
  fecha_inicio: string;
  estado: 'activo' | 'finalizado';
}

export interface Caja {
  id: string;
  fila_id: number | null;
  batch_id: string | null;
  peso: number | null;
  clasificacion: 'A' | 'B' | 'C' | null;
  estado: 'disponible' | 'vinculada' | 'pesada';
}

export interface AppConfig {
  webhookUrl: string;
  nombreFinca: string;
  operario: string;
}

export interface HistoricoProduccion {
  id: string;
  caja_id: string;
  batch_id: string;
  peso: number;
  clasificacion: 'A' | 'B' | 'C';
  fecha: string;
  fila_id: number;
  estado_logistico: 'almacen' | 'despachado';
  destino: 'tienda' | 'distribucion' | 'mermas';
  fecha_despacho?: string;
}

export enum View {
  DASHBOARD = 'dashboard',
  SCANNER = 'scanner',
  MANUAL_ENTRY = 'manual_entry',
  FILA_FORM = 'fila_form',
  CAJA_FORM = 'caja_form',
  CONTROL_CENTER = 'control_center',
  QR_GENERATOR = 'qr_generator',
  REPORTS = 'reports',
  SETTINGS = 'settings',
  ACTIVE_CROPS = 'active_crops',
  LOGISTICA = 'logistica'
}
