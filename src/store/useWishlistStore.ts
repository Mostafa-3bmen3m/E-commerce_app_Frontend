import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface WishlistState {
  items: WishlistItem[];
  fetchWatchlist: () => Promise<void>;
  toggleWatchlist: (product: WishlistItem) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      fetchWatchlist: async () => {
        try {
          const { data } = await api.get('/watchlist');
          if (data.success) {
            set({ items: data.watchlist });
          }
        } catch (error) {
          console.error('Error fetching watchlist:', error);
        }
      },
      toggleWatchlist: async (product) => {
        const isIn = get().isInWishlist(product.id);
        
        // Optimistic update
        if (isIn) {
          set({ items: get().items.filter(i => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }

        try {
          const { data } = await api.post('/watchlist/toggle', { productId: product.id });
          if (data.success) {
            set({ items: data.watchlist });
          }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            // Revert on error? Optional.
        }
      },
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
