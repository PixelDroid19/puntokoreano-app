import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subTotal: number;
  shipping: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  getOrderItems: () => { product: string; quantity: number; price: number }[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subTotal: 0,
      shipping: 0,
      total: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === newItem.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            newItem.stock
          );
          get().updateQuantity(newItem.id, newQuantity);
          return;
        }

        set((state) => ({
          items: [...state.items, { ...newItem, quantity: 1 }],
        }));
        get().calculateTotals();
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        get().calculateTotals();
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: Math.max(0, Math.min(quantity, item.stock)),
                }
              : item
          ),
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subTotal: 0,
          shipping: 0,
          total: 0,
        });
      },

      calculateTotals: () => {
        const { items } = get();

        // Si no hay items, todos los totales son 0
        if (items.length === 0) {
          set({
            totalItems: 0,
            subTotal: 0,
            shipping: 0,
            total: 0,
          });
          return;
        }

        // Calcular totales
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subTotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Calcular envío basado en el subtotal
        let shipping = 0;
        if (subTotal > 0 && subTotal < 100000) {
          shipping = 0; // Costo de envío solo si hay items y el subtotal es menor a 100k
        }

        set({
          totalItems,
          subTotal,
          shipping,
          total: subTotal + shipping,
        });
      },
      
      // Convertir items del carrito al formato necesario para crear órdenes
      getOrderItems: () => {
        const { items } = get();
        return items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        }));
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subTotal: state.subTotal,
        shipping: state.shipping,
        total: state.total,
      }),
    }
  )
);
