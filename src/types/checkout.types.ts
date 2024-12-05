// src/types/checkout.types.ts

// Tipos comunes para los props de los componentes del checkout
export interface CheckoutStepProps {
    setStatus: (status: "wait" | "process" | "finish" | "error") => void;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
  }
  
  // Props específicos para cada paso del checkout
  export interface ContactStepProps extends CheckoutStepProps {
    initialData?: ContactData;
    onSave?: (data: ContactData) => void;
  }
  
  export interface ShippingStepProps extends CheckoutStepProps {
    initialData?: ShippingData;
    onSave?: (data: ShippingData) => void;
  }
  
  export interface BillingStepProps extends CheckoutStepProps {
    initialData?: BillingData;
    onSave?: (data: BillingData) => void;
    onComplete?: () => void;
  }
  
  // Interfaces para los datos de cada paso
  export interface ContactData {
    name: string;
    lastName: string;
    email: string;
    phone?: string;
  }
  
  export interface ShippingData {
    shippingMethod: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  }
  
  export interface BillingData {
    person: "natural" | "juridica";
    nit?: string;
    registerdName?: string;
    email?: string;
    name?: string;
    lastName?: string;
  }