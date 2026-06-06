import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { useAuthStore } from "./authStore"; // We pull this in to get the user's token!

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      isCartOpen: false,

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      // 1. PULL FROM DB: Called when the user logs in
      loadUserCart: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ cartItems: data.cartItems, shippingAddress: data.shippingAddress });
        } catch (error) {
          console.error("Failed to load DB cart");
        }
      },

      // 2. PUSH TO DB: Helper function to save state silently in the background
      saveToDB: async (state) => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
            cartItems: state.cartItems,
            shippingAddress: state.shippingAddress
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error("Failed to sync DB cart");
        }
      },

      // 3. UPDATED ACTIONS: Now they update Zustand AND save to the Database!
      addToCart: (product, qty = 1) => {
        const cartItems = get().cartItems;
        const existItem = cartItems.find((x) => x._id === product._id);
        
        let newCartItems;
        if (existItem) {
          newCartItems = cartItems.map((x) => x._id === existItem._id ? { ...x, qty: x.qty + qty } : x);
        } else {
          newCartItems = [...cartItems, { ...product, qty }];
        }
        
        set({ cartItems: newCartItems });
        get().saveToDB({ cartItems: newCartItems, shippingAddress: get().shippingAddress });
      },

      removeFromCart: (id) => {
        const newCartItems = get().cartItems.filter((x) => x._id !== id);
        set({ cartItems: newCartItems });
        get().saveToDB({ cartItems: newCartItems, shippingAddress: get().shippingAddress });
      },

      saveShippingAddress: (data) => {
        set({ shippingAddress: data });
        get().saveToDB({ cartItems: get().cartItems, shippingAddress: data });
      },

      // We still keep clearCart for when they log out so the browser empties locally
      clearCart: () => set({ cartItems: [], shippingAddress: {} }),
    }),
    {
      name: "cart-storage",
    }
  )
);