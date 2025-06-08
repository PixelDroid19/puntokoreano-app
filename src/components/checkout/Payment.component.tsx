import React, { useState, useEffect } from "react";
import { Alert, Form, Modal, Radio, Space, Spin, notification } from "antd";
import { Lock, CreditCard, Smartphone, Building } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import axios from "axios";
import ENDPOINTS from "@/api";
import { formatNumber } from "@/pages/store/utils/formatPrice";
import { ErrorParser } from "@/utils/validations";
import { CardForm } from "./Components/Payment.components/CardForm";
import { NequiForm } from "./Components/Payment.components/NequiForm";
import { PSEForm } from "./Components/Payment.components/PSEForm";
import { DaviPlataForm } from "./Components/Payment.components/DaviPlataForm";

// Definición de tipos mejorada
export type PaymentMethodType =
  | "CARD"
  | "PSE"
  | "NEQUI"
  | "BANCOLOMBIA_TRANSFER"
  | "DAVIPLATA";

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: React.FC;
  enabled: boolean;
}

interface PaymentFormProps {
  setStatus: (status: "wait" | "process" | "finish" | "error") => void;
  setCurrent: (step: number) => void;
}

// Tipos específicos para cada método de pago
interface CardPaymentData {
  token: string;
  card_data: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
  };
  installments: number;
}

interface PSEPaymentData {
  bankCode: string;
  userType: number;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NequiPaymentData {
  phoneNumber: string;
}

interface DaviPlataPaymentData {
  documentType: string;
  documentNumber: string;
}

type PaymentFormData = {
  card?: CardPaymentData;
  pse?: PSEPaymentData;
  nequi?: NequiPaymentData;
  daviplata?: DaviPlataPaymentData;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ setStatus, setCurrent }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CARD");
  const [formData, setFormData] = useState<PaymentFormData>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const { items, total, clearCart } = useCartStore();
  const { shippingInfo, setOrderId, setOrderStatus } = useCheckoutStore();

  const getPaymentMethodIcon = (methodId: PaymentMethodType): React.FC => {
    switch (methodId) {
      case "CARD":
        return CreditCard;
      case "PSE":
      case "BANCOLOMBIA_TRANSFER":
        return Building;
      case "NEQUI":
      case "DAVIPLATA":
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  // Cargar métodos de pago disponibles
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.PAYMENT.METHODS.url);
        if (data.success && data.data.methods) {
          const methods = data.data.methods.map((method: any) => ({
            ...method,
            icon: getPaymentMethodIcon(method.id as PaymentMethodType),
            enabled: true, // Puedes manejar la habilitación según la configuración
          }));
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
        notification.error({
          message: "Error",
          description: "No se pudieron cargar los métodos de pago.",
        });
      }
    };

    fetchPaymentMethods();
  }, []);

  // Manejar la validación del formulario
  const handleFormValidation = (isValid: boolean, data: any) => {
    setIsFormValid(isValid);
    setFormData((prev) => ({
      ...prev,
      [paymentMethod.toLowerCase()]: data,
    }));
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // Preparar datos para el backend
  const preparePaymentData = () => {
    const methodKey = paymentMethod.toLowerCase() as keyof PaymentFormData;
    const data = formData[methodKey];
    if (!data) return null;

    const baseData = {
      method: "wompi",
      provider: "wompi",
      payment_method_type: paymentMethod,
    };

    switch (paymentMethod) {
      case "CARD":
        const cardData = data as CardPaymentData;
        return {
          ...baseData,
          card_data: { card_data: { ...cardData } },
          installments: cardData.installments ?? 1,
        };
      case "PSE":
        const pseData = data as PSEPaymentData;
        return {
          ...baseData,
          bank_code: pseData.bankCode,
          user_type: pseData.userType,
          user_legal_id_type: pseData.documentType,
          user_legal_id: pseData.documentNumber,
          user_name: `${pseData.firstName} ${pseData.lastName}`,
          user_email: pseData.email,
        };
      case "NEQUI":
        const nequiData = data as NequiPaymentData;
        return {
          ...baseData,
          phone_number: nequiData.phoneNumber,
        };
      case "DAVIPLATA":
        const daviData = data as DaviPlataPaymentData;
        return {
          ...baseData,
          user_legal_id_type: daviData.documentType,
          user_legal_id: daviData.documentNumber,
        };
      default:
        return null;
    }
  };

  // Manejar el proceso de pago
  const handlePayment = async () => {
    console.log("=== DEBUG VALIDATION ===");
    console.log("items?.length:", items?.length);
    console.log("isFormValid:", isFormValid);
    console.log("formData:", formData);
    console.log("paymentMethod:", paymentMethod);
    
    if (!items?.length) {
      notification.error({
        message: "Error",
        description: "No hay productos en el carrito",
      });
      return;
    }
    
    if (!isFormValid) {
      notification.error({
        message: "Error",
        description: "Por favor complete correctamente todos los campos del formulario",
      });
      return;
    }

    // Obtener datos de contacto y envío desde localStorage
    const contactData = localStorage.getItem("checkoutContact");
    const shippingData = localStorage.getItem("checkoutShipping");

    if (!contactData || !shippingData) {
      notification.error({
        message: "Error",
        description: "Información de contacto o envío incompleta. Por favor, complete todos los pasos.",
      });
      return;
    }

    const contactInfo = JSON.parse(contactData);
    const shippingDetails = JSON.parse(shippingData);

    // Construir shipping_address combinando datos de contacto y envío
    const shipping_address = {
      name: `${contactInfo.name} ${contactInfo.lastName}`,
      street: shippingDetails.street,
      address: shippingDetails.street,
      address_line_1: shippingDetails.street,
      city: shippingDetails.city,
      state: shippingDetails.state,
      zip: shippingDetails.zip,
      country: shippingDetails.country || "Colombia",
      phone: contactInfo.phone,
      email: contactInfo.email,
      shipping_method: shippingDetails.shippingMethod,
    };

    const paymentData = preparePaymentData();
    if (!paymentData) {
      notification.error({
        message: "Error",
        description: "Error en la configuración del pago",
      });
      return;
    }

    setLoading(true);
    setStatus("process");
    setOrderStatus("processing");

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address,
        shipping_method: shippingDetails.shippingMethod,
        payment: paymentData,
      };

      const { data: response } = await axios.post(
        ENDPOINTS.ORDERS.CREATE.url,
        orderData
      );

      if (!response.success || !response.data?.order?.id) {
        throw new Error("Error al crear la orden");
      }

      const { order, payment } = response.data;
      setOrderId(order.id);
      clearCart();

      // Limpiar datos del checkout después del éxito
      localStorage.removeItem("checkoutContact");
      localStorage.removeItem("checkoutShipping");

      // Manejar redirección según el método de pago
      if (payment.paymentUrl || payment.redirectUrl) {
        window.location.href = `/store/finish-order`;
      } else {
        window.location.href = `/store/finish-order`;
      }

      setStatus("finish");
    } catch (error: any) {
      console.error("Error de pago:", error);
      setStatus("error");
      setOrderStatus("failed");

      // 🆕 Usar el analizador de errores
      const { message, details } = ErrorParser.parseBackendError(error);

      notification.error({
        message,
        description: details,
        duration: 8, // Mostrar más tiempo para errores específicos
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    const props = { onValidChange: handleFormValidation };

    switch (paymentMethod) {
      case "CARD":
        return <CardForm {...props} />;
      case "NEQUI":
        return <NequiForm {...props} />;
      case "PSE":
        return <PSEForm {...props} />;
      case "DAVIPLATA":
        return <DaviPlataForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Pago Seguro</h2>
          <Lock className="text-gray-400" />
        </div>

        <Form layout="vertical">
          <Form.Item label="Selecciona el método de pago">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setIsFormValid(false);
                setFormData({});
              }}
            >
              <Space direction="vertical">
                {paymentMethods.map((method) => (
                  <Radio
                    key={method.id}
                    value={method.id}
                    disabled={!method.enabled}
                  >
                                      <Space>
                    {React.createElement(method.icon, { size: 20 })}
                    {method.name}
                  </Space>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>

        <div className="mt-6">{renderPaymentForm()}</div>

        <Alert
          message="Pago Seguro con Wompi"
          description="Serás redirigido a Wompi para realizar el pago de forma segura"
          type="info"
          showIcon
        />

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Resumen del Pedido</h3>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>$ {formatNumber(total, "es-CO", "COP")} COP</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrent(2)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Volver
          </button>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-6 py-2 bg-[#E2060F] text-white rounded hover:bg-[#001529] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Proceder al Pago"}
          </button>
        </div>
      </div>

      <Modal open={loading} footer={null} closable={false} centered>
        <div className="flex flex-col items-center p-6">
          <Spin size="large" />
          <h3 className="mt-4 text-lg font-medium">Preparando Pago</h3>
          <p className="text-gray-500 mt-2 text-center">
            Serás redirigido a Wompi en un momento...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentForm;
