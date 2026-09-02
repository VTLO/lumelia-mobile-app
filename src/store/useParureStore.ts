import { create } from "zustand";
import { Product, ProductVariant, JewelryFinish, ParureSlot } from "../types/Product";
import { useCartStore } from "./useCartStore";

interface ParureState {
  slot1: ParureSlot; // Colliers
  slot2: ParureSlot; // Bagues ou Bracelets
  slot3: ParureSlot; // Boucles d'oreilles
  activeStep: 1 | 2 | 3;
  setActiveStep: (step: 1 | 2 | 3) => void;
  selectProductForSlot: (step: 1 | 2 | 3, product: Product, variant?: ProductVariant) => void;
  clearSlot: (step: 1 | 2 | 3) => void;
  resetParure: () => void;
  getParureSummary: () => {
    isComplete: boolean;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  };
  addParureToCart: () => boolean;
}

export const useParureStore = create<ParureState>((set, get) => ({
  slot1: { step: 1, name: "Collier", category: "Colliers" },
  slot2: { step: 2, name: "Bague ou Bracelet", category: "Bagues" },
  slot3: { step: 3, name: "Boucles d'oreilles", category: "Boucles d'oreilles" },
  activeStep: 1,

  setActiveStep: (step) => set({ activeStep: step }),

  selectProductForSlot: (step, product, variant) => {
    const selectedVariant = variant || product.variants[0];
    set((state) => {
      if (step === 1) {
        return { slot1: { ...state.slot1, selectedProduct: product, selectedVariant } };
      } else if (step === 2) {
        return { slot2: { ...state.slot2, selectedProduct: product, selectedVariant } };
      } else {
        return { slot3: { ...state.slot3, selectedProduct: product, selectedVariant } };
      }
    });
  },

  clearSlot: (step) => {
    set((state) => {
      if (step === 1) return { slot1: { ...state.slot1, selectedProduct: undefined, selectedVariant: undefined } };
      if (step === 2) return { slot2: { ...state.slot2, selectedProduct: undefined, selectedVariant: undefined } };
      return { slot3: { ...state.slot3, selectedProduct: undefined, selectedVariant: undefined } };
    });
  },

  resetParure: () => {
    set({
      slot1: { step: 1, name: "Collier", category: "Colliers" },
      slot2: { step: 2, name: "Bague ou Bracelet", category: "Bagues" },
      slot3: { step: 3, name: "Boucles d'oreilles", category: "Boucles d'oreilles" },
      activeStep: 1,
    });
  },

  getParureSummary: () => {
    const { slot1, slot2, slot3 } = get();
    const isComplete = Boolean(slot1.selectedProduct && slot2.selectedProduct && slot3.selectedProduct);
    
    let originalPrice = 0;
    if (slot1.selectedVariant) originalPrice += slot1.selectedVariant.price;
    if (slot2.selectedVariant) originalPrice += slot2.selectedVariant.price;
    if (slot3.selectedVariant) originalPrice += slot3.selectedVariant.price;

    const discountAmount = isComplete ? Math.round(originalPrice * 0.15 * 100) / 100 : 0;
    const finalPrice = Math.round((originalPrice - discountAmount) * 100) / 100;

    return {
      isComplete,
      originalPrice: Math.round(originalPrice * 100) / 100,
      discountAmount,
      finalPrice,
    };
  },

  addParureToCart: () => {
    const { slot1, slot2, slot3, getParureSummary, resetParure } = get();
    const { isComplete } = getParureSummary();
    if (!isComplete) return false;

    const cart = useCartStore.getState();
    
    if (slot1.selectedProduct && slot1.selectedVariant) {
      cart.addItem(
        slot1.selectedProduct,
        slot1.selectedVariant,
        (slot1.selectedVariant.finish as JewelryFinish) || "PVD Or 18K"
      );
    }
    if (slot2.selectedProduct && slot2.selectedVariant) {
      cart.addItem(
        slot2.selectedProduct,
        slot2.selectedVariant,
        (slot2.selectedVariant.finish as JewelryFinish) || "PVD Or 18K",
        slot2.selectedVariant.size || undefined
      );
    }
    if (slot3.selectedProduct && slot3.selectedVariant) {
      cart.addItem(
        slot3.selectedProduct,
        slot3.selectedVariant,
        (slot3.selectedVariant.finish as JewelryFinish) || "PVD Or 18K"
      );
    }

    resetParure();
    return true;
  },
}));
