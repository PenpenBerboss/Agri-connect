import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Charger les données générées par seed_massive_data.ts
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../src/services/mock/generatedMassiveData.json');
const massiveData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const { users: MOCK_USERS, products: MOCK_PRODUCTS, reviews: MOCK_REVIEWS } = massiveData;

async function seed() {
  console.log('Starting seed...');

  // 1. Seed Profiles en lot (Bulk)
  console.log(`Seeding ${MOCK_USERS.length} profiles...`);
  const profiles = MOCK_USERS.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: 'active',
    avatar_url: user.avatar,
    joined_at: user.joinedAt ? new Date(user.joinedAt).toISOString() : new Date().toISOString()
  }));

  const { error: profileError } = await supabase.from('profiles').upsert(profiles);
  if (profileError) console.error('Error seeding profiles batch:', profileError.message);

  // 2. Seed Products en lot
  console.log(`Seeding ${MOCK_PRODUCTS.length} products...`);
  const products = MOCK_PRODUCTS.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    seller_id: product.sellerId,
    unit: product.unit,
    created_at: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString()
  }));

  const { error: productError } = await supabase.from('products').upsert(products);
  if (productError) console.error('Error seeding products batch:', productError.message);

  // 3. Seed Orders
  console.log('Skipping order seeding due to lack of relational data mapping in current mock');

  // 4. Seed Reviews en lot
  console.log(`Seeding ${MOCK_REVIEWS.length} reviews...`);
  const reviews = MOCK_REVIEWS.map((r: any) => ({
    id: r.id,
    seller_id: r.sellerId,
    buyer_id: r.buyerId,
    rating: r.rating,
    comment: r.comment,
    created_at: new Date().toISOString()
  }));

  const { error: reviewError } = await supabase.from('reviews').upsert(reviews);
  if (reviewError) console.error('Error seeding reviews batch:', reviewError.message);

  console.log('Seed completed.');
}

seed().catch(console.error);
