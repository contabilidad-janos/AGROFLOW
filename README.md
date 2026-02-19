<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AGROFLOW - Juntos Farm

Sistema de gestión agrícola integral para Juntos Farm. Permite el control de siembras, cosecha, calidad y logística desde una aplicación web progresiva y eficiente.

## 🚀 Características

- **Gestión de Cultivos:** Registro de siembras por fila, control de variedades y tratamientos.
- **Trazabilidad de Cajas:** Vinculación de cajas a lotes de producción mediante códigos QR.
- **Control de Calidad:** Clasificación de cosecha (A, B, C) y pesaje digital.
- **Logística:** Gestión de despachos a tienda, distribución o mermas con historial completo.
- **Inteligencia Artificial:** Análisis de imágenes de cultivos mediante Google Gemini para detección temprana de plagas.
- **Base de Datos en Tiempo Real:** Backend potenciado por Supabase para sincronización instantánea entre operarios.

## 🛠️ Tecnologías

- **Frontend:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS
- **Base de Datos:** Supabase (PostgreSQL + Realtime)
- **IA:** Google Gemini API
- **Contenedores:** Docker

## 📦 Instalación y Despliegue

### Requisitos Previos

- Node.js 20+
- Docker (Opcional)

### Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/contabilidad-janos/AGROFLOW.git
   cd AGROFLOW
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Renombra `.env.example` a `.env` y añade tus claves API.
   ```
   VITE_GEMINI_API_KEY=tu_clave_aquí
   ```

4. Ejecutar entorno de desarrollo:
   ```bash
   npm run dev
   ```

### Despliegue con Docker

1. Construir la imagen:
   ```bash
   docker build -t agroflow .
   ```

2. Correr el contenedor:
   ```bash
   docker run -p 3000:3000 agroflow
   ```

## 📱 Uso de la Aplicación

1. **Dashboard:** Vista general de KPIs y accesos directos.
2. **Escáner:** Escanea códigos QR de filas o cajas para acciones rápidas.
3. **Siembra:** Registra nuevos ciclos de cultivo en filas vacías.
4. **Cosecha:** Vincula cajas vacías a filas activas.
5. **Calidad:** Pesa y clasifica las cajas llenas.
6. **Logística:** Despacha cajas a su destino final.

---
Desarrollado con ❤️ para Juntos Farm
