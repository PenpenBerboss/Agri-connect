
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CITIES = [
  { name: 'Douala', region: 'Littoral', lat: 4.05, lng: 9.70 },
  { name: 'Yaoundé', region: 'Centre', lat: 3.86, lng: 11.52 },
  { name: 'Bafoussam', region: 'Ouest', lat: 5.48, lng: 10.42 },
  { name: 'Bertoua', region: 'Est', lat: 4.58, lng: 13.68 },
  { name: 'Garoua', region: 'Nord', lat: 9.30, lng: 13.40 },
  { name: 'Kribi', region: 'Sud', lat: 2.94, lng: 9.91 },
  { name: 'Bamenda', region: 'Nord-Ouest', lat: 5.96, lng: 10.15 },
  { name: 'Ngaoundéré', region: 'Adamaoua', lat: 7.32, lng: 13.58 }
];

const CATEGORIES = [
  { id: 'céréales', fallback: 'cereale.jpg', keywords: ['maïs', 'riz', 'sorgho', 'mil'], subs: ['Maïs Jaune', 'Maïs Blanc', 'Riz Local', 'Riz Long Grain'] },
  { id: 'tubercules', fallback: 'tubercule.jpg', keywords: ['manioc', 'macabo', 'igname', 'patate'], subs: ['Manioc Frais', 'Macabo Rouge', 'Macabo Blanc', 'Igname'] },
  { id: 'fruits', fallback: 'fruit.jpg', keywords: ['banane', 'ananas', 'mangue', 'papaye'], subs: ['Banane Douce', 'Ananas Victoria', 'Mangue Cameroun'] },
  { id: 'légumes', fallback: 'legume.jpg', keywords: ['tomate', 'piment', 'oignon', 'gombo'], subs: ['Tomate Foumbot', 'Piment Oiseau', 'Oignon Garoua'] },
  { id: 'semences', fallback: 'semence.jpg', keywords: ['graines'], subs: ['Semences Maïs', 'Semences Soja'] },
  { id: 'engrais', fallback: 'engrais.jpg', keywords: ['bio', 'fiente'], subs: ['Engrais NPK', 'Fiente de poulet'] }
];

const LOCAL_MAPS = {
  'manioc': 'manioc.jpg',
  'maïs': 'cereale.jpg',
  'cacao': 'cacao.jpg',
  'café': 'cafe.jpg',
  'plantain': 'plantain.jpg',
  'macabo': 'macabo.jpg',
  'tomate': 'tomate.jpg',
  'piment': 'piment.jpg',
  'arachide': 'arachide.jpg',
  'haricot': 'haricot.jpg'
};

const PRODUCT_NAMES = {
  'manioc': ['Manioc de Sangmélima', 'Cossettes de Manioc', 'Farine de Manioc (Gari)', 'Bâtons de Manioc'],
  'maïs': ['Maïs jaune de l\'Ouest', 'Maïs blanc premium', 'Farine de maïs tamisée'],
  'cacao': ['Fèves de cacao séchées', 'Cacao Grade A Bertoua', 'Pâte de cacao artisanale'],
  'café': ['Café Arabica de l\'Ouest', 'Café Robusta Moulu', 'Cerises de café'],
  'plantain': ['Régimes de Plantain Musang', 'Plantain géant du Sud', 'Plantain mûr premium'],
  'macabo': ['Macabo rouge de l\'Ouest', 'Macabo blanc', 'Pousse de macabo'],
  'tomate': ['Tomate de Foumbot (Caisse)', 'Tomate ronde bio', 'Concentré de tomate local'],
  'piment': ['Piment oiseau extra-fort', 'Piment jaune de Penja', 'Piment séché en poudre'],
  'arachide': ['Arachides décortiquées', 'Arachide rouge de Garoua', 'Arachide grillée'],
  'haricot': ['Haricot rouge (Koki)', 'Haricot noir du Nord-Ouest', 'Haricot blanc'],
  'soja': ['Soja bio pour transformation', 'Lait de soja artisanal'],
  'riz local': ['Riz Ndop Long Grain', 'Riz Yagoua décortiqué']
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInRange(min, max, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// 1. Generate Users
const users = [];
const roles = ['farmer', 'buyer'];
for (let i = 1; i <= 500; i++) {
  const city = getRandomElement(CITIES);
  const role = i <= 100 ? 'farmer' : 'buyer'; // 100 farmers, 400 buyers
  users.push({
    id: `user_${i}`,
    name: `User ${i} Cameroon`,
    email: `user${i}@example.cm`,
    phone: `+237 6${Math.floor(Math.random() * 89999999 + 10000000)}`,
    role: role,
    location: {
      city: city.name,
      region: city.region,
      lat: getRandomInRange(city.lat - 0.1, city.lat + 0.1, 4),
      lng: getRandomInRange(city.lng - 0.1, city.lng + 0.1, 4)
    },
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
    bio: `Passionné par l'agriculture à ${city.name}.`,
    preferred_categories: [getRandomElement(CATEGORIES).id],
    joinedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0]
  });
}

const farmers = users.filter(u => u.role === 'farmer');

// 2. Generate Products
const products = [];
const crops = Object.keys(PRODUCT_NAMES);
for (let i = 1; i <= 3000; i++) {
  const seller = getRandomElement(farmers);
  const crop = getRandomElement(crops);
  const name = getRandomElement(PRODUCT_NAMES[crop]);
  const city = getRandomElement(CITIES);
  
  const cat = crop === 'maïs' || crop === 'riz local' ? 'céréales' : 
              crop === 'manioc' || crop === 'macabo' ? 'tubercules' :
              crop === 'tomate' || crop === 'piment' ? 'légumes' :
              crop === 'cacao' || crop === 'café' ? 'engrais' : // actually cash crops, use engrais/others fallback
              'fruits';
  
  // Image logic
  let imageUrl: string;
  if (LOCAL_MAPS[crop]) {
    imageUrl = `/assets/${LOCAL_MAPS[crop]}`;
  } else {
    const categoryInfo = CATEGORIES.find(c => c.id === cat);
    imageUrl = categoryInfo ? `/assets/${categoryInfo.fallback}` : '/assets/cereale.jpg';
  }

  products.push({
    id: `prod_${i}`,
    name: name,
    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + `-${i}`,
    description: `Produit de haute qualité cultivé avec soin à ${city.name}. Frais et direct du producteur.`,
    category: cat,
    subcategory: crop,
    price: getRandomInRange(500, 50000, 0),
    stock: getRandomInRange(10, 5000, 0),
    unit: getRandomElement(['kg', 'sac', 'régime', 'caisse', 'litre']),
    images: [imageUrl],
    sellerId: seller.id,
    sellerName: seller.name,
    location: {
      city: city.name,
      region: city.region,
      lat: getRandomInRange(city.lat - 0.05, city.lat + 0.05, 4),
      lng: getRandomInRange(city.lng - 0.05, city.lng + 0.05, 4)
    },
    harvest_period: getRandomElement(['Mars-Mai', 'Juin-Août', 'Septembre-Novembre', 'Décembre-Février']),
    season: getRandomElement(['Saison Sèche', 'Saison des Pluies']),
    availability_status: 'disponible',
    views: getRandomInRange(0, 1000, 0),
    favorites_count: getRandomInRange(0, 200, 0),
    contact_count: getRandomInRange(0, 50, 0),
    rating: getRandomInRange(3, 5, 1),
    reviewsCount: getRandomInRange(0, 30, 0),
    recommendation_tags: [crop, city.name, 'bio'],
    keywords: [crop, 'Cameroun', city.name, 'frais'],
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString()
  });
}

// 3. Generate History (Interactions)
const history = [];
const actions = ['view', 'favorite', 'contact', 'search', 'click', 'map_view'];
const buyers = users.filter(u => u.role === 'buyer');

// To simulate patterns, some buyers will prefer certain categories or regions
for (let i = 1; i <= 50000; i++) {
  const buyer = getRandomElement(buyers);
  const action = getRandomElement(actions);
  
  // Collaborative patterns: buyer focuses on preferred categories 70% of the time
  let product;
  if (Math.random() < 0.7) {
    const preferredProducts = products.filter(p => p.subcategory === buyer.preferred_categories[0]);
    product = getRandomElement(preferredProducts.length > 0 ? preferredProducts : products);
  } else {
    product = getRandomElement(products);
  }

  history.push({
    user_id: buyer.id,
    product_id: product.id,
    action_type: action,
    duration: action === 'view' ? getRandomInRange(5, 120, 0) : 0,
    created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60).toISOString()
  });
}

// 4. Generate Reviews
const reviews = [];
for (let i = 1; i <= 1000; i++) {
  const buyer = getRandomElement(buyers);
  const product = getRandomElement(products);
  reviews.push({
    id: `rev_${i}`,
    productId: product.id,
    userId: buyer.id,
    userName: buyer.name,
    userAvatar: buyer.avatar,
    rating: getRandomInRange(3, 5, 0),
    comment: getRandomElement([
      "Qualité exceptionnelle, je recommande !",
      "Produit très frais, livraison rapide.",
      "Conforme à la description.",
      "Le vendeur est très professionnel.",
      "Bon rapport qualité/prix.",
      "Un peu d'attente mais le produit est top."
    ]),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 15).toISOString()
  });
}

const finalData = {
  users,
  products,
  history,
  reviews
};

const outputDir = path.join(__dirname, '..', 'src', 'services', 'mock');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'generatedMassiveData.json'),
  JSON.stringify(finalData, null, 2)
);

console.log('Massive dataset generated successfully!');
console.log(`- ${users.length} Users`);
console.log(`- ${products.length} Products`);
console.log(`- ${history.length} Interactions`);
console.log(`- ${reviews.length} Reviews`);
