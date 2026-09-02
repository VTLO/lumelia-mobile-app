import { create } from "zustand";

interface WishlistState {
  favorites: string[]; // Product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  favorites: [],

  toggleFavorite: (productId: string) => {
    set((state) => {
      const exists = state.favorites.includes(productId);
      return {
        favorites: exists
          ? state.favorites.filter(id => id !== productId)
          : [...state.favorites, productId],
      };
    });
  },

  isFavorite: (productId: string) => {
    return get().favorites.includes(productId);
  },
}));
