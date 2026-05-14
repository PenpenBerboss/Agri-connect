import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function truncateTables() {
  console.log('Truncating tables...');
  
  // Note: Order matters due to FK constraints
  // Need to delete reviews/orders first, then products, then profiles
  
  const { error: reviewError } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (reviewError) console.error('Error truncating reviews:', reviewError.message);
  
  const { error: orderError } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (orderError) console.error('Error truncating orders:', orderError.message);
  
  const { error: productError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (productError) console.error('Error truncating products:', productError.message);
  
  const { error: profileError } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (profileError) console.error('Error truncating profiles:', profileError.message);

  console.log('Truncation completed.');
}

truncateTables();
