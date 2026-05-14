import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_REVIEWS } from '../src/services/mock/mockData';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting seed...');

  // 1. Seed Profiles
  console.log('Seeding profiles...');
  for (const user of MOCK_USERS) {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, // Using existing ID if possible, otherwise Supabase might need adjustments
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar,
      joined_at: user.joinedAt ? new Date(user.joinedAt).toISOString() : new Date().toISOString()
    });
    if (error) console.error('Error seeding profile:', user.email, error);
  }

  // 2. Seed Products
  console.log('Seeding products...');
  for (const product of MOCK_PRODUCTS) {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      seller_id: product.sellerId,
      unit: product.unit,
      created_at: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString()
    });
    if (error) console.error('Error seeding product:', product.name, error);
  }

  // 3. Seed Orders
  console.log('Seeding orders...');
  for (const order of MOCK_ORDERS) {
    // Note: Mock orders don't have direct mapping to new table IDs easily
    // We'll skip linking to products/profiles for now if it's too complex, 
    // or just insert what we have.
    console.log('Skipping order seeding due to lack of relational data mapping in current mock');
  }

  // 4. Seed Reviews
  console.log('Seeding reviews...');
  for (const review of MOCK_REVIEWS) {
    const { error } = await supabase.from('reviews').upsert({
      seller_id: review.sellerId,
      buyer_id: review.buyerId,
      rating: review.rating,
      comment: review.comment,
      created_at: new Date().toISOString()
    });
    if (error) console.error('Error seeding review:', error);
  }

  console.log('Seed completed.');
}

seed().catch(console.error);
