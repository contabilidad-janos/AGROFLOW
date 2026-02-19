-- Supabase Schema for AGROFLOW
-- Tables are prefixed with 'agroflow_' to separate them from other projects in the shared 'public' schema.

-- 1. Filas (Rows) - Static definitions of crop rows
CREATE TABLE IF NOT EXISTS public.agroflow_filas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- 2. Ciclos (Crop Cycles) - Active and historical planting cycles
CREATE TABLE IF NOT EXISTS public.agroflow_ciclos (
  id TEXT PRIMARY KEY,
  fila_id INTEGER REFERENCES public.agroflow_filas(id),
  batch_id TEXT NOT NULL,
  metodo_labrado TEXT,
  abono TEXT,
  variedad_planta TEXT,
  tratamientos TEXT,
  fecha_inicio TIMESTAMPTZ,
  estado TEXT CHECK (estado IN ('activo', 'finalizado'))
);

-- 3. Cajas (Boxes) - Tracking boxes during harvest
CREATE TABLE IF NOT EXISTS public.agroflow_cajas (
  id TEXT PRIMARY KEY,
  fila_id INTEGER REFERENCES public.agroflow_filas(id),
  batch_id TEXT,
  peso NUMERIC,
  clasificacion TEXT CHECK (clasificacion IN ('A', 'B', 'C')),
  estado TEXT CHECK (estado IN ('disponible', 'vinculada', 'pesada'))
);

-- 4. Historico (History) - Permanent record of production
CREATE TABLE IF NOT EXISTS public.agroflow_historico (
  id TEXT PRIMARY KEY,
  caja_id TEXT REFERENCES public.agroflow_cajas(id),
  batch_id TEXT,
  peso NUMERIC,
  clasificacion TEXT,
  fecha TIMESTAMPTZ,
  fila_id INTEGER,
  estado_logistico TEXT CHECK (estado_logistico IN ('almacen', 'despachado')),
  destino TEXT CHECK (destino IN ('tienda', 'distribucion', 'mermas')),
  fecha_despacho TIMESTAMPTZ
);

-- Permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
