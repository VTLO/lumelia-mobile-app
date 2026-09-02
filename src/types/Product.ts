export type JewelryFinish = "PVD Or 18K" | "Argent Poli Miroir";

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
  finish?: JewelryFinish;
  size?: string | null;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  productType: "Colliers" | "Bagues" | "Bracelets" | "Boucles d'oreilles" | "Cartes Cadeaux" | string;
  images: string[];
  variants: ProductVariant[];
  availableFinishes: JewelryFinish[];
  availableSizes?: string[] | null;
  isBestSeller?: boolean;
  isWaterproof: boolean;
  isHypoallergenic: boolean;
  material: string;
  rating: number;
  reviewCount: number;
}

export type ProductCategory = "Tous" | "Colliers" | "Bagues" | "Bracelets" | "Boucles d'oreilles";

export interface ParureSlot {
  step: 1 | 2 | 3;
  name: string;
  category: ProductCategory;
  selectedProduct?: Product;
  selectedVariant?: ProductVariant;
}
