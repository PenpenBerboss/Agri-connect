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

### 🧠 Intelligence Artificielle & Recommandations
Intégration d'un **système hybride** exclusif :
- **Algorithme de Score** : 50% Contenu + 30% Popularité + 20% Géographie.
- **Recommandations Intelligentes** : Suggère des produits similaires en fonction de la catégorie consultée, de la proximité kilométrique et de l'intérêt général.

### 📍 Géolocalisation
- **Leaflet & OpenStreetMap** : Carte interactive pour tracer la provenance des produits.
- **Filtrage par Ville** : Possibilité de filtrer l'ensemble du marché par zone géographique.

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
