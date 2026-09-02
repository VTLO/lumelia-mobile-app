# Maison Lumélia — Application Mobile iOS & Android (React Native / Expo)

Application mobile officielle pour **Maison Lumélia** (Bijoux Acier 316L, PVD Or 18K & Hypoallergénique).

## 💎 Fonctionnalités Clés

1. **Catalogue Complet & Synchronisation Shopify** :
   - Synchronisation en direct avec `https://maison-lumelia-bijoux.fr/products.json` ou via Storefront GraphQL API.
   - Mode **Offline-First** garanti grâce au cache local intégré.
   - Affichage des finitions (*PVD Or 18K* et *Argent Poli Miroir*) et des tailles de doigts.

2. **Générateur de Parures Interactif (-15%)** :
   - Écran dédié **Créer ma Parure** en 3 étapes (1. Collier, 2. Bague ou Jonc, 3. Boucles d'oreilles).
   - Calcul en temps réel de l'économie réalisée (-15% dès 3 bijoux).
   - Ajout en un clic de la parure complète dans le panier.

3. **Panier Intelligent & Expédition** :
   - Détection automatique de la règle commerciale des 3 bijoux pour appliquer la remise de -15%.
   - Jauge dynamique pour la livraison offerte (dès 50 € d'achat).
   - Simulation et intégration Apple Pay / Google Pay.

4. **Expérience Produit Haut de Gamme** :
   - Badges de réassurance (*100% Waterproof*, *Acier 316L*, *Expédition 24-48h*).
   - Notes et avis clients certifiés (intégration Judge.me).
   - Liste des coups de cœur (Favoris / Wishlist).

---

## 🚀 Démarrage & Commandes

```bash
# Vérification TypeScript
npm run typecheck

# Lancement du serveur de développement Expo
npx expo start

# Lancer directement sur simulateur Android ou iOS
npx expo run:android
npx expo run:ios
```

---

## 📁 Architecture du Code

```text
lumelia-mobile-app/
├── App.tsx                      # Configuration de navigation (Tabs + Stacks)
├── app.json                     # Configuration Expo & Bundles Android/iOS
├── tsconfig.json                # Options de compilation TypeScript
├── src/
│   ├── constants/
│   │   └── theme.ts             # Palette Maison Lumélia (Or, Obsidienne, Champagne)
│   ├── types/
│   │   ├── Product.ts           # Modèles de données Produits & Finitions
│   │   ├── Cart.ts              # Modèles du panier & Remises
│   │   └── Navigation.ts        # Typage de navigation React Navigation v7
│   ├── services/
│   │   ├── catalogData.ts       # Données réelles extraites de maison-lumelia-bijoux.fr
│   │   └── shopifyClient.ts     # Client HTTP Shopify Storefront + Cache
│   ├── store/
│   │   ├── useCartStore.ts      # Zustand : Gestion du panier & règle -15%
│   │   ├── useParureStore.ts    # Zustand : Studio de création de parure
│   │   └── useWishlistStore.ts  # Zustand : Gestion des favoris
│   ├── components/
│   │   ├── Header.tsx           # En-tête de marque avec badge panier
│   │   ├── ProductCard.tsx      # Carte produit avec badges & favoris
│   │   ├── ParurePromoBanner.tsx# Jauge promotionnelle pour débloquer -15%
│   │   └── GuaranteesRow.tsx    # Ligne des réassurances (Waterproof, 316L, 24-48h)
│   └── screens/
│       ├── HomeScreen.tsx       # Page d'accueil avec hero, best-sellers & avis
│       ├── CatalogScreen.tsx    # Grille de filtrage par catégorie & recherche
│       ├── ProductDetailScreen.tsx # Galerie carrousel, finitions & fiche technique
│       ├── ParureBuilderScreen.tsx # Studio 3 étapes de composition de parure
│       ├── CartScreen.tsx       # Panier avec code promo & Apple Pay / GPay
│       └── WishlistScreen.tsx   # Liste des pièces favorites
```
