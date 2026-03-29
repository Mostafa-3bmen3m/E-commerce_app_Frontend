import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axios';
import { useAuthStore } from './useAuthStore';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            const response = await axios.get('/cart');
            if (response.data.success) {
              const items = response.data.cart.items.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                price: item.product.price,
                image: item.product.images[0],
                quantity: item.quantity,
                stock: item.product.stock,
              }));
              set({ items });
            }
          } catch (error) {
            console.error('Failed to fetch cart', error);
          }
        }
      },
      addItem: async (product, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();
        
        if (isAuthenticated) {
          try {
            await axios.post('/cart/add', { productId: product.id, quantity });
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to add to cart', error);
          }
        } else {
          const existingItem = items.find((item) => item.productId === product.id);
          if (existingItem) {
            set({
              items: items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              ),
            });
          } else {
            set({
              items: [...items, { 
                id: Math.random().toString(36).substr(2, 9), 
                productId: product.id, 
                name: product.name, 
                price: product.price, 
                quantity, 
                image: product.images[0], 
                stock: product.stock 
              }],
            });
          }
        }
      },
      removeItem: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await axios.delete(`/cart/remove/${id}`);
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to remove from cart', error);
          }
        } else {
          set({ items: get().items.filter((item) => item.id !== id) });
        }
      },
      updateQuantity: async (id, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await axios.put(`/cart/update/${id}`, { quantity });
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to update quantity', error);
          }
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await axios.delete('/cart/clear');
            set({ items: [] });
          } catch (error) {
            console.error('Failed to clear cart', error);
          }
        } else {
          set({ items: [] });
        }
      },
      get totalItems() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
