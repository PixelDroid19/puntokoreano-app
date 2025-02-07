import { useState, useEffect } from "react";
import { Alert, Form, Modal, Radio, Space, Spin, notification } from "antd";
import { Lock, CreditCard, Smartphone, Building } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import axios from "axios";
import ENDPOINTS from "@/api";
import { formatNumber } from "@/pages/store/utils/formatPrice";
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

  // Preparar datos para el backend
  const preparePaymentData = () => {
    const data = formData[paymentMethod.toLowerCase()];
    if (!data) return null;

    const baseData = {
      method: "wompi",
      provider: "wompi",
      payment_method_type: paymentMethod,
    };

    switch (paymentMethod) {
      case "CARD":
        return {
          ...baseData,
          card_data: data.card_data,
          token: data.token,
          installments: data.installments,
        };
      case "PSE":
        return {
          ...baseData,
          bank_code: data.bankCode,
          user_type: data.userType,
          user_legal_id_type: data.documentType,
          user_legal_id: data.documentNumber,
          user_name: `${data.firstName} ${data.lastName}`,
          user_email: data.email,
        };
      case "NEQUI":
        return {
          ...baseData,
          phone_number: data.phoneNumber,
        };
      case "DAVIPLATA":
        return {
          ...baseData,
          user_legal_id_type: data.documentType,
          user_legal_id: data.documentNumber,
        };
      default:
        return null;
    }
  };

  // Manejar el proceso de pago
  const handlePayment = async () => {
    if (!items?.length || !shippingInfo || !isFormValid) {
      notification.error({
        message: "Error",
        description: "Por favor complete toda la información requerida",
      });
      return;
    }

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
        shipping_address: shippingInfo,
        shipping_method: shippingInfo.shipping_method,
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

      // Manejar redirección según el método de pago
      if (payment.paymentUrl || payment.redirectUrl) {
        window.location.href = payment.paymentUrl || payment.redirectUrl;
      } else {
        window.location.href = `/checkout/result?order=${order.order_number}`;
      }

      setStatus("finish");
    } catch (error: any) {
      console.error("Error de pago:", error);
      setStatus("error");
      setOrderStatus("failed");

      notification.error({
        message: "Error en el pago",
        description:
          error.response?.data?.message ||
          "Error al procesar el pago. Por favor intente nuevamente.",
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
                      <method.icon size={20} />
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
