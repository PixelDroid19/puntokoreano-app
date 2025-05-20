// src/store/checkout.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PaymentMethodData {
  type: string;
  token?: string;
  installments?: number;
  phone?: string;
  user_type?: number;
  user_legal_id_type?: string;
  user_legal_id?: string;
  financial_institution_code?: string;
  payment_description?: string;
  sandbox_status?: string;
  otp?: string;
}

interface CheckoutState {
  orderId: string | null;
  shippingInfo: any;
  paymentMethod: string | null;
  paymentMethodData: PaymentMethodData | null;
  shippingCost: number;
  orderStatus: "pending" | "processing" | "completed" | "failed";
  transactionId: string | null;
  paymentUrl: string | null;
  redirectUrl: string | null;
  acceptanceToken: string | null;
  isDevelopment: boolean;

  setOrderId: (id: string) => void;
  setShippingInfo: (info: any) => void;
  setPaymentMethod: (method: string) => void;
  setPaymentMethodData: (data: PaymentMethodData) => void;
  setShippingCost: (cost: number) => void;
  setOrderStatus: (status: CheckoutState["orderStatus"]) => void;
  setTransactionInfo: (transactionId: string, paymentUrl?: string, redirectUrl?: string) => void;
  setAcceptanceToken: (token: string) => void;
  setDevelopmentMode: (isDev: boolean) => void;
  resetCheckout: () => void;
  resetPaymentInfo: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      orderId: null,
      shippingInfo: null,
      paymentMethod: null,
      paymentMethodData: null,
      shippingCost: 0,
      orderStatus: "pending",
      transactionId: null,
      paymentUrl: null,
      redirectUrl: null,
      acceptanceToken: null,
      isDevelopment: process.env.NODE_ENV !== "production", // Por defecto, modo desarrollo si no es producción

      setOrderId: (id) => set({ orderId: id }),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setPaymentMethodData: (data) => set({ paymentMethodData: data }),
      setShippingCost: (cost) => set({ shippingCost: cost }),
      setOrderStatus: (status) => set({ orderStatus: status }),
      setTransactionInfo: (transactionId, paymentUrl, redirectUrl) => 
        set({ 
          transactionId, 
          paymentUrl: paymentUrl || null, 
          redirectUrl: redirectUrl || null 
        }),
      setAcceptanceToken: (token) => set({ acceptanceToken: token }),
      setDevelopmentMode: (isDev) => set({ isDevelopment: isDev }),
      resetPaymentInfo: () => set({
        transactionId: null,
        paymentUrl: null,
        redirectUrl: null,
        paymentMethodData: null,
      }),
      resetCheckout: () =>
        set({
          orderId: null,
          shippingInfo: null,
          paymentMethod: null,
          paymentMethodData: null,
          shippingCost: 0,
          orderStatus: "pending",
          transactionId: null,
          paymentUrl: null,
          redirectUrl: null,
          acceptanceToken: null,
          // Mantener el modo de desarrollo como está
        }),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        orderId: state.orderId,
        shippingInfo: state.shippingInfo,
        paymentMethod: state.paymentMethod,
        shippingCost: state.shippingCost,
        orderStatus: state.orderStatus,
        isDevelopment: state.isDevelopment,
        // No persistir datos sensibles de pago
      }),
    }
  )
);
