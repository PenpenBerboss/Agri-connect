# AgriConnect Cameroon 🇨🇲

Une plateforme web agricole moderne adaptée au contexte camerounais, facilitant la mise en relation directe entre agriculteurs et acheteurs.

## 🚀 Fonctionnalités Clés Implémentées

### 🌍 Contexte Camerounais (Adaptabilité)
- **Localisation précise** : Support des villes clés (Douala, Yaoundé, Bafoussam, Garoua, Bertoua, Bamenda, Kribi, Foumban).
- **Produits Locaux** : Catégories adaptées (Céréales, Tubercules, Fruits, Légumes, Semences, Engrais).
- **Messagerie Directe** : Intégration WhatsApp et bouton d'appel direct pour pallier les problèmes de connexion.
- **Simplicité** : Interface épurée et performante (Optimisée pour faible bande passante).

### 👥 Acteurs du Système
1. **Agriculteur / Vendeur** :
   - Dashboard de gestion de plantation.
   - Publication de produits avec images et géolocalisation.
   - Statistiques de performance (Recharts) et suivi des notes.
2. **Acheteur** :
   - Recherche avancée par nom, catégorie et **ville**.
   - Système de favoris et gestion de panier.
3. **Administrateur** :
   - Console de modération des utilisateurs et du catalogue.
   - Supervision des statistiques globales.

### 🧠 Système de Recommandation Hybride (Moteur Intelligent)
Le cœur de la plateforme repose sur un moteur de recommandation hybride sophistiqué qui calcule en temps réel un score de pertinence pour chaque produit par rapport à l'utilisateur :

**Formule de Ranking :**
`Score = (0.5 × Similarité Contenu) + (0.3 × Popularité) + (0.2 × Proximité Géographique)`

1.  **Filtrage par Contenu (50%)** :
    - Analyse de la catégorie et sous-catégorie.
    - Correspondance des `product_type` et des `keywords`.
    - Analyse des méta-tags fournis par le vendeur.
2.  **Popularité & Qualité (30%)** :
    - **Vues** : Tracking dynamique des consultations via backend.
    - **Rating** : Calcul basé sur la moyenne des avis utilisateurs.
    - **Engagement** : Prise en compte du volume de commentaires et de favoris.
3.  **Filtrage Géographique (20%)** :
    - Calcul de distance euclidienne entre la position de l'acheteur (ou du produit consulté) et les autres vendeurs.
    - Prise en compte de la région et de la ville.

### 📝 Mises à jour Récentes
- **Système de Feedback Instantané** : Intégration de `react-hot-toast` pour toutes les actions critiques (création de produit, mise à jour de profil, validation de vendeurs, suppression de données, ajout au panier).
- **Synchronisation du Schéma Backend** : Correction et mise à jour de la table `profiles` incluant désormais les champs `city`, `lat`, `lng` et `region` directement synchronisés avec Supabase.
- **Validation Administrative** : Processus complet de validation/rejet des vendeurs avec notifications en temps réel.
- **Cartographie Interactive** : Localisation automatique des produits sur la carte dès leur création grâce aux coordonnées GPS du vendeur.
- **Expérience Utilisateur (UX) Renforcée** : Remplacement des alertes natives par des composants de notification modernes et non-intrusifs.

### 📊 Spécifications Techniques & Mesures
- **Base de Données (Supabase/PostgreSQL)** :
  - **Tracking des Vues** : Incrémentation atomique côté serveur pour éviter la fraude et assurer la performance.
  - **Metadata Géographique** : Ajout de colonnes `lat`, `lng` et `region` sur les profils et les produits pour des calculs spatiaux précis.
  - **Indexation** : Optimisation des recherches par catégories et mots-clés.
  - **Schema Management** : Script de migration SQL pour assurer l'intégrité des données à travers toutes les tables.
- **Frontend** :
  - **Sections Dynamiques** : "Produits Similaires", "Produits Proches de Vous", et "Tendances Actuelles" (basé sur le volume de vues récent).
  - **Responsive Design** : Optimisation des images et des composants pour un chargement rapide sur mobiles (majorité du trafic au Cameroun).
  - **Toasts Notifications** : Feedback visuel fluide via `react-hot-toast`.
- **Sécurité et RLS** :
  - Politiques Row Level Security strictes pour protéger les données propriétaires des vendeurs.
  - Gestion sécurisée des uploads d'images via Buckets restreints.

### 📍 Géolocalisation Native
- Les vendeurs peuvent désormais configurer leurs coordonnées GPS précises lors de la création de produit.
- Synchronisation automatique entre le profil vendeur et ses annonces pour garantir l'exactitude des informations sur la carte.

### ⭐ Confiance & Notation
- **Notation Vendeur** : Système complet de commentaires et de notes (1-5 étoiles).
- **Paiements Mobiles** : Support (UI) pour Orange Money, MTN MoMo et Espèces.

### 🏗️ Architecture (Refactoring Clean Code)
L'application est structurée selon une architecture modulaire et scalable :
- **Core** : Contient les types globaux, les interfaces et la logique métier pure (services de recommandation).
- **Shared** : Utilitaires réutilisables, composants UI de base et styles.
- **Features** : Organisation par domaines fonctionnels (Products, Auth, Dashboard, Map).
- **Application** : Gestion de l'état global avec Zustand et persistance locale.
- **Services** : Clients API et gestion des données mockées.

## 🛠️ Stack Technique
- **Core** : React 18, TypeScript, Vite.
- **Design** : Tailwind CSS v4, Motion/React (Animations).
- **État (State)** : Zustand.
- **Cartographie** : React-Leaflet.
- **Visualisation** : Recharts.

## 🚀 Démarrage Rapide

1. **Installation** : `npm install`
2. **Développement** : `npm run dev`
3. **Build** : `npm run build`

---
*Projet développé pour optimiser l'économie agricole au Cameroun.*
