
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://agjvhvjhrmwkvszyjitl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanZodmpocm13a3ZzenlqaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTA1MDAsImV4cCI6MjA4MDI2NjUwMH0.8FPklsr58Z7MxWU7Pr7zttABgUNX6Q8J48OKmuVhGyo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    console.log("Verifying Supabase Connection (Public Schema)...");

    // 1. Fetch Filas (should be seeded)
    const { data: filas, error: filasError } = await supabase.from('agroflow_filas').select('*');
    if (filasError) {
        console.error("Error fetching filas:", filasError);
        process.exit(1);
    }
    console.log(`✅ Fetched ${filas.length} filas.`);

    // 2. Insert Test Ciclo
    const testId = 'TEST-' + Date.now();
    const { error: insertError } = await supabase.from('agroflow_ciclos').insert({
        id: testId,
        fila_id: 1,
        batch_id: 'BATCH-TEST',
        metodo_labrado: 'Test Method',
        abono: 'Test Abono',
        variedad_planta: 'Test Plant',
        tratamientos: 'Test Treatment',
        fecha_inicio: new Date().toISOString(),
        estado: 'activo'
    });

    if (insertError) {
        console.error("Error inserting ciclo:", insertError);
        process.exit(1);
    }
    console.log("✅ Inserted test ciclo.");

    // 3. Read it back
    const { data: ciclo, error: readError } = await supabase.from('agroflow_ciclos').select('*').eq('id', testId).single();
    if (readError || !ciclo) {
        console.error("Error reading back ciclo:", readError);
        process.exit(1);
    }
    console.log("✅ Read back test ciclo:", ciclo.id);

    // 4. Clean up
    const { error: deleteError } = await supabase.from('agroflow_ciclos').delete().eq('id', testId);
    if (deleteError) {
        console.error("Error cleaning up:", deleteError);
    } else {
        console.log("✅ Cleaned up test data.");
    }
}

verify();
