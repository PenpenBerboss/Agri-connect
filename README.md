# AgriConnect Cameroon 🇨🇲

Une plateforme web agricole complète et moderne adaptée au contexte camerounais, facilitant la mise en relation directe entre agriculteurs (Or Vert) et acheteurs nationaux.

## 🚀 Fonctionnalités Clés Implémentées

### 🌍 Contexte Camerounais (Adaptabilité)
- **Localisation précise** : Support des villes clés (Douala, Yaoundé, Bafoussam, Garoua, Bertoua, Bamenda, Kribi, Foumban).
- **Produits Locaux** : Catégories adaptées (Céréales, Tubercules, Fruits, Légumes, Semences, Engrais).
- **Messagerie Directe** : Intégration WhatsApp et bouton d'appel direct pour pallier les problèmes de connexion.
- **Simplicité** : Interface épurée et performante (Optimisée pour faible bande passante).

### 👥 Acteurs du Système
1. **Agriculteur / Vendeur** :
   - Dashboard de gestion de plantation (Enterprise v2.0).
   - Publication de produits avec images et géolocalisation automatique.
   - Statistiques de performance (Recharts) et suivi des notes.
   - Validation obligatoire par l'administration avant publication.
2. **Acheteur** :
   - Recherche avancée par nom, catégorie, ville et budget.
   - Système de favoris, gestion de panier et historique de commandes.
   - Géolocalisation pour trouver les produits "Près de chez vous".
3. **Administrateur** :
   - Console de modération des utilisateurs et du catalogue.
   - Validation des nouveaux comptes producteurs (système de file d'attente).
   - Supervision des statistiques de vente et de l'activité système.

### 🧠 Système de Recommandation Hybride (Moteur Intelligent)
Le cœur de la plateforme repose sur un moteur de recommandation hybride sophistiqué qui calcule en temps réel un score de pertinence pour chaque produit par rapport à l'utilisateur :

**Formule de Ranking :**
`Score = (0.5 × Similarité Contenu) + (0.3 × Popularité) + (0.2 × Proximité Géographique)`

1.  **Filtrage par Contenu (50%)** :
    - Analyse de la catégorie et sous-catégorie.
    - Correspondance des `product_type` et des `keywords`.
2.  **Popularité & Qualité (30%)** :
    - **Vues** : Tracking atomique côté serveur.
    - **Rating** : Moyenne pondérée des avis utilisateurs.
3.  **Filtrage Géographique (20%)** :
    - Calcul de distance euclidienne entre la position de l'acheteur et les zones de production.

## ️ Architecture de la Base de Données (Supabase)

L'application s'appuie sur Supabase (PostgreSQL) avec une synchronisation temps réel.

###  Schéma des Tables
1.  **`profiles`** : Extension des utilisateurs auth. Stocke les rôles (`admin`, `farmer`, `buyer`), le statut de validation (`pending`, `active`) et les métadonnées géographiques.
    - *Trigger* : `handle_new_user()` crée automatiquement le profil lors de l'inscription.
2.  **`products`** : Catalogue complet. Inclut les colonnes de performance (`views`, `rating`) et la géolocalisation (`location` JSONB).
3.  **`orders`** : Suivi des transactions. Lié via `customer_id`, `seller_id` et `product_id`.
4.  **`reviews`** : Système de notation. Les notes moyennes sont recalculées et injectées dans la table `products` par le backend.

### 🔐 Sécurité & RLS (Row Level Security)
- **Protection des Profils** : Modifiables uniquement par le propriétaire ou l'admin.
- **Isolation des Commandes** : Un vendeur ne voit que ses ventes, un acheteur ne voit que ses achats.
- **Stockage (Buckets)** :
    - `products` : Stockage public des images de récoltes.
    - `profiles` : Stockage des avatars utilisateurs.

## 🏗️ Structure du Projet (Folder Tree)

L'application suit une séparation stricte des préoccupations (SoC) pour permettre le déploiement hybride sur Vercel.

```text
├── api/                    # Fonctions Serverless Vercel (Backend ESM)
├── public/                 # Assets statiques (Logos, fonds d'écran)
├── src/
│   ├── application/        # Gestion d'état (Zustand Stores & Persistance)
│   ├── core/               # Logique métier : Types, Constantes, Services de recommandation
│   ├── components/         # Composants UI (Modals, Uploader, Layouts)
│   ├── pages/              # Vues (Home, Market, Dashboards, Map Atlas)
│   ├── server/             # Application Express (Logique API & Supabase Admin)
│   ├── services/           # Clients API (Axios) et Auth
│   └── shared/             # Utilitaires (formatage de prix, cn, etc.)
├── schema.sql              # Migration SQL complète pour Supabase
├── vercel.json             # Configuration des réécritures (Rewrites)
└── server.ts               # Serveur de développement local
```

## ⚙️ Configuration de l'Environnement

Pour le fonctionnement local et en production, créez un fichier `.env` ou configurez les variables sur Vercel :

### Variables Client (Vite)
- `VITE_SUPABASE_URL` : URL de votre projet Supabase.
- `VITE_SUPABASE_ANON_KEY` : Clé publique anonyme.

### Variables Serveur (Vercel/Node)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé secrète admin (Indispensable pour bypasser les RLS côté backend).
- `SUPABASE_URL` : (Identique à la version VITE).

## 🚀 Déploiement sur Vercel

L'application est déployée en tant qu'application **Full-Stack Hybride** :

1.  **Frontend (SPA)** : Vite compile le code vers `/dist`. Vercel sert ces fichiers statiques.
2.  **Backend (API)** : Le fichier `api/index.ts` expose l'application Express en tant que **Serverless Function**.

**Règle de routage (`vercel.json`)** :
- Les requêtes `/api/*` sont envoyées au backend Express.
- Les autres requêtes sont renvoyées vers `index.html` pour permettre à React Router de gérer les dashboards.

## 📍 Géolocalisation & Atlas Interactif

- **Capture GPS** : Lors de la création d'un produit, le système demande l'autorisation `navigator.geolocation`. En cas de refus, la position par défaut du profil de l'agriculteur est utilisée.
- **Atlas Global** : Accessible via `/map`, il affiche dynamiquement tous les produits de la base de données sur une carte Leaflet.
- **Proximité** : La landing page utilise la position réelle de l'acheteur pour filtrer la section "Près de chez Vous".

## ⭐ Confiance & Notation

- **Toasts Notifications** : Feedback instantané via `react-hot-toast` pour toutes les actions (Panier, Commandes, Auth).
- **Paiements** : Interface préparée pour MTN MoMo et Orange Money (Paiement manuel direct en version actuelle).
- **Modération** : Un onglet dédié dans le dashboard Admin permet de suspendre des utilisateurs ou de supprimer des avis inappropriés.

## 🛠️ Stack Technique
- **Frontend** : React 19, TypeScript, Vite, Tailwind CSS v4.
- **Backend** : Node.js, Express (mode ESM).
- **Base de données** : Supabase / PostgreSQL.
- **Animations** : Motion/React (Framer Motion).
- **Cartographie** : Leaflet & React-Leaflet.
- **Charts** : Recharts.

## 🚀 Démarrage Rapide

1. **Installation** : `npm install`
2. **Base de données** : Exécutez le contenu de `schema.sql` dans l'éditeur SQL de Supabase.
3. **Développement** : `npm run dev` (Démarre Vite et le proxy Express).
3. **Build** : `npm run build`

---
*Projet développé pour optimiser l'économie agricole au Cameroun.*
