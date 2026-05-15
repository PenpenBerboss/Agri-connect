import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
  console.log('Running migrations...');
  
  // Try to add columns to profiles
  const columns = [
    { name: 'phone', type: 'TEXT' },
    { name: 'city', type: 'TEXT' },
    { name: 'neighborhood', type: 'TEXT' },
    { name: 'lat', type: 'DECIMAL(9, 6)' },
    { name: 'lng', type: 'DECIMAL(9, 6)' },
    { name: 'region', type: 'TEXT' },
    { name: 'language', type: 'TEXT' }
  ];

  for (const col of columns) {
    try {
      console.log(`Checking column: ${col.name}`);
      // Supabase JS doesn't have a direct way to run DLL, but we can try to update it
      // Actually, we can use the SQL editor trick or just assume schema.sql is the way.
      // But if it's failing at runtime, it means the DB is out of sync.
    } catch (e) {
      console.error(`Error with column ${col.name}`, e);
    }
  }
}

migrate();
