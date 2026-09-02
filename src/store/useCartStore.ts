import { create } from "zustand";
import { Product, ProductVariant, JewelryFinish } from "../types/Product";
import { CartItem, CartSummary } from "../types/Cart";

interface CartState {
  items: CartItem[];
  promoCode: string;
  addItem: (product: Product, variant: ProductVariant, finish: JewelryFinish, size?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setPromoCode: (code: string) => void;
  getSummary: () => CartSummary;
}

const FREE_SHIPPING_THRESHOLD = 50.0;
const STANDARD_SHIPPING_COST = 4.90;
const PARURE_MIN_ITEMS = 3;
const PARURE_DISCOUNT_RATE = 0.15;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  promoCode: "",

  addItem: (product, variant, finish, size) => {
    set((state) => {
      const cartItemId = `${product.id}-${variant.id}-${finish}-${size || "default"}`;
      const existingIndex = state.items.findIndex(item => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += 1;
        return { items: updated };
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          variant,
          finish,
          size,
          quantity: 1,
        };
        return { items: [...state.items, newItem] };
      }
    });
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter(item => item.cartItemId !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [], promoCode: "" }),

  setPromoCode: (promoCode) => set({ promoCode }),

  getSummary: (): CartSummary => {
    const { items } = get();
    
    // Bijoux éligibles à la parure (hors cartes cadeaux)
    const eligibleJewelryCount = items
      .filter(item => item.product.productType !== "Cartes Cadeaux")
      .reduce((acc, item) => acc + item.quantity, 0);

    const isParureDiscountApplied = eligibleJewelryCount >= PARURE_MIN_ITEMS;
    const discountPercentage = isParureDiscountApplied ? 15 : 0;

    const subtotal = items.reduce(
      (acc, item) => acc + item.variant.price * item.quantity,
      0
    );

    const discountAmount = isParureDiscountApplied
      ? Math.round(subtotal * PARURE_DISCOUNT_RATE * 100) / 100
      : 0;

    const subtotalAfterDiscount = subtotal - discountAmount;
    const isFreeShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || items.length === 0;
    const shipping = isFreeShipping ? 0.0 : STANDARD_SHIPPING_COST;
    const total = Math.round((subtotalAfterDiscount + shipping) * 100) / 100;

    const freeShippingProgress = Math.min(
      100,
      Math.round((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
    );

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountPercentage,
      discountAmount,
      shipping,
      total,
      isParureDiscountApplied,
      freeShippingProgress,
      itemsCount,
    };
  },
}));
