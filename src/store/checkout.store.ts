// src/store/checkout.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutState {
  orderId: string | null;
  shippingInfo: any;
  paymentMethod: string | null;
  shippingCost: number;
  orderStatus: "pending" | "processing" | "completed" | "failed";

  setOrderId: (id: string) => void;
  setShippingInfo: (info: any) => void;
  setPaymentMethod: (method: string) => void;
  setShippingCost: (cost: number) => void;
  setOrderStatus: (status: CheckoutState["orderStatus"]) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      orderId: null,
      shippingInfo: null,
      paymentMethod: null,
      shippingCost: 0,
      orderStatus: "pending",

      setOrderId: (id) => set({ orderId: id }),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      setOrderStatus: (status) => set({ orderStatus: status }),
      resetCheckout: () =>
        set({
          orderId: null,
          shippingInfo: null,
          paymentMethod: null,
          shippingCost: 0,
          orderStatus: "pending",
        }),
    }),
    {
      name: "checkout-storage",
    }
  )
);
