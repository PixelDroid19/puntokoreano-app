import React, { useState, useEffect } from "react";
import { Alert, Form, Modal, Radio, Space, Spin, notification, Divider } from "antd";
import { Lock, CreditCard, Smartphone, Building, ShoppingCart, Truck, CreditCard as CreditCardIcon, AlertTriangle } from "lucide-react";
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
  icon: JSX.Element;
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

// 🆕 Interface para el cálculo de costos
interface CostCalculation {
  subtotal: number;
  shipping: number;
  tax: number;
  processingFee: number;
  installmentFee: number;
  total: number;
  available: boolean;
  unavailableItems: Array<{
    id: string;
    name: string;
    requested: number;
    available: number;
  }>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ setStatus, setCurrent }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CARD");
  const [formData, setFormData] = useState<PaymentFormData>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [costCalculation, setCostCalculation] = useState<CostCalculation | null>(null);
  const [calculatingCosts, setCalculatingCosts] = useState(false);
  const [stockVerified, setStockVerified] = useState(false);

  const { items, total, clearCart } = useCartStore();
  const { shippingInfo, setOrderId, setOrderStatus } = useCheckoutStore();

  const getPaymentMethodIcon = (methodId: PaymentMethodType): JSX.Element => {
    const iconStyle = { width: '20px', height: '20px' };
    switch (methodId) {
      case "CARD":
        return <CreditCard style={iconStyle} />;
      case "PSE":
      case "BANCOLOMBIA_TRANSFER":
        return <Building style={iconStyle} />;
      case "NEQUI":
      case "DAVIPLATA":
        return <Smartphone style={iconStyle} />;
      default:
        return <CreditCard style={iconStyle} />;
    }
  };

  // 🆕 Calcular costos completos
  const calculateTotalCosts = async () => {
    if (!items?.length) return;

    setCalculatingCosts(true);
    try {
      // Obtener datos de envío
      const shippingData = localStorage.getItem("checkoutShipping");
      const contactData = localStorage.getItem("checkoutContact");
      
      if (!shippingData || !contactData) {
        notification.warning({
          message: "Información incompleta",
          description: "Complete la información de contacto y envío primero",
        });
        setCurrent(0);
        return;
      }

      const shipping = JSON.parse(shippingData);
      const contact = JSON.parse(contactData);

      // 1. Verificar disponibilidad de stock
      const stockResponse = await axios.post(ENDPOINTS.ORDERS.VERIFY_STOCK.url, {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity
        }))
      });

      const stockAvailable = stockResponse.data.success;
      const unavailableItems = stockAvailable ? [] : stockResponse.data.data?.insufficientStock || [];

      // 2. Calcular costo de envío (o usar el ya calculado)
      let shippingCost = 0;
      let backendSubtotal = 0; // 🚨 SEGURIDAD: Subtotal verificado del backend
        
      // 🆕 Priorizar el costo calculado en el paso anterior
      if (shipping.calculatedShipping?.cost !== undefined) {
        shippingCost = shipping.calculatedShipping.cost;
        // 🚨 SEGURIDAD: Si tenemos datos calculados, usar el subtotal del backend
        backendSubtotal = shipping.calculatedShipping.orderSubtotal || 0;
        console.log(`✅ Usando costo de envío y subtotal pre-calculados: $${shippingCost}, subtotal: $${backendSubtotal}`);
      } else {
        // Fallback: calcular nuevamente si no existe
        const shippingCostResponse = await axios.post(ENDPOINTS.ORDERS.CALCULATE_SHIPPING_COST.url, {
          shipping_address: {
            city: shipping.city,
            state: shipping.state,
            country: shipping.country || "Colombia"
          },
          shipping_method: shipping.shippingMethod,
          items: items.map(item => ({
            product: item.id, // 🚨 SEGURIDAD: Solo enviar ID
            quantity: item.quantity
            // 🚨 NO ENVIAR: price, weight - El backend los obtiene de la DB
          }))
        });

        if (shippingCostResponse.data.success) {
          shippingCost = shippingCostResponse.data.data.cost;
          backendSubtotal = shippingCostResponse.data.data.orderSubtotal; // 🚨 SEGURIDAD: Usar subtotal del backend
          console.log(`📦 Costo de envío y subtotal calculados del backend: $${shippingCost}, subtotal: $${backendSubtotal}`);
        } else {
          // Si falla, redirigir al usuario para recalcular
          notification.error({
            message: "Error de cálculo",
            description: "Error al calcular costos. Verifique su información de envío.",
          });
          setCurrent(1); // Volver al paso de envío
          return;
        }
      }

      // 🚨 SEGURIDAD: Usar subtotal del backend, NO del frontend
      const subtotal = backendSubtotal;
      const tax = subtotal * 0.19; // IVA del 19%
      
      // 🆕 Obtener cuotas de procesamiento del backend (ya calculadas)
      let processingFee = 0;
      let installmentFee = 0;
      
      try {
        // 🆕 Solicitar al backend que calcule las cuotas según configuración
        const feesResponse = await axios.post(ENDPOINTS.ORDERS.CALCULATE_PROCESSING_FEES.url, {
          payment_method_type: paymentMethod,
          subtotal,
          installments: formData.card?.installments || 1,
        });

        if (feesResponse.data.success) {
          processingFee = feesResponse.data.data.processingFee || 0;
          installmentFee = feesResponse.data.data.installmentFee || 0;
          console.log(`💳 Cuotas obtenidas del backend: procesamiento=$${processingFee}, cuotas=$${installmentFee}`);
        } else {
          console.warn('No se pudieron obtener cuotas del backend, usando fallback');
          // 🆕 Fallback: usar las cuotas por defecto solo si falla la API
          if (paymentMethod === "CARD") {
            processingFee = subtotal * 0.029; // 2.9% fallback
            const installments = formData.card?.installments || 1;
            if (installments > 1) {
              installmentFee = subtotal * 0.015 * (installments - 1); // 1.5% fallback
            }
          } else if (paymentMethod === "PSE") {
            processingFee = Math.min(subtotal * 0.025, 3000); // 2.5% máximo $3,000 fallback
          }
        }
      } catch (feesError) {
        console.warn('Error obteniendo cuotas del backend:', feesError);
        // Fallback a cálculo local si la API no está disponible
        if (paymentMethod === "CARD") {
          processingFee = subtotal * 0.029;
          const installments = formData.card?.installments || 1;
          if (installments > 1) {
            installmentFee = subtotal * 0.015 * (installments - 1);
          }
        } else if (paymentMethod === "PSE") {
          processingFee = Math.min(subtotal * 0.025, 3000);
        }
      }

      const totalCost = subtotal + shippingCost + tax + processingFee + installmentFee;

      setCostCalculation({
        subtotal,
        shipping: shippingCost,
        tax,
        processingFee,
        installmentFee,
        total: totalCost,
        available: stockAvailable,
        unavailableItems
      });

      setStockVerified(true);

    } catch (error: any) {
      notification.error({
        message: "Error de cálculo",
        description: error?.response?.data?.message || error?.message || "Error desconocido",
      });
    } finally {
      setCalculatingCosts(false);
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
            enabled: true,
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

  // Calcular costos cuando cambie el método de pago o los datos del formulario
  useEffect(() => {
    if (paymentMethod && items?.length) {
      calculateTotalCosts();
    }
  }, [paymentMethod, formData, items]);

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
    // Verificaciones previas
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

    if (!stockVerified || !costCalculation) {
      notification.error({
        message: "Error",
        description: "Verificando disponibilidad y costos...",
      });
      await calculateTotalCosts();
      return;
    }

    if (!costCalculation.available) {
      notification.error({
        message: "Productos no disponibles",
        description: `Algunos productos ya no están disponibles: ${costCalculation.unavailableItems.map(item => item.name).join(", ")}`,
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

    // Construir shipping_address con el costo calculado
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
      shipping_cost: costCalculation.shipping, // 🆕 Incluir costo calculado
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
          product: item.id, // 🚨 SEGURIDAD: Solo enviar ID
          quantity: item.quantity,
          // 🚨 NO ENVIAR: price - El backend lo obtiene de la DB
        })),
        shipping_address,
        shipping_method: shippingDetails.shippingMethod,
        payment: paymentData,
        // 🆕 Incluir cálculos para verificación en backend
        calculated_costs: costCalculation,
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

      const { message, details } = ErrorParser.parseBackendError(error);

      notification.error({
        message,
        description: details,
        duration: 8,
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

  // 🆕 Renderizar desglose de costos
  const renderCostBreakdown = () => {
    if (calculatingCosts) {
      return (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <Spin size="small" />
            <span>Calculando costos...</span>
          </div>
        </div>
      );
    }

    if (!costCalculation) {
      return (
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 text-yellow-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Complete la información anterior para ver el total</span>
          </div>
        </div>
      );
    }

    if (!costCalculation.available) {
      return (
        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 text-red-700 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Productos no disponibles</span>
          </div>
          {costCalculation.unavailableItems.map((item) => (
            <div key={item.id} className="text-sm text-red-600">
              • {(item as any).message || `${item.name}: Solicitado ${item.requested}, Disponible ${item.available}`}
            </div>
          ))}
          <div className="mt-3 text-sm text-gray-600">
            <p>💡 Puedes:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Reducir las cantidades</li>
              <li>Eliminar productos agotados del carrito</li>
              <li>Continuar con productos disponibles</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                 <h3 className="text-lg font-medium mb-4 flex items-center">
           <ShoppingCart className="mr-2 w-5 h-5" />
           Resumen del Pedido
         </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal productos</span>
            <span>{formatNumber(costCalculation.subtotal, "es-CO", "COP")} COP</span>
          </div>
          
                     <div className="flex justify-between">
             <span className="flex items-center">
               <Truck className="mr-1 w-4 h-4" />
               Envío
             </span>
             <span>{formatNumber(costCalculation.shipping, "es-CO", "COP")} COP</span>
           </div>
           
           <div className="flex justify-between">
             <span>IVA (19%)</span>
             <span>{formatNumber(costCalculation.tax, "es-CO", "COP")} COP</span>
           </div>
           
           {costCalculation.processingFee > 0 && (
             <div className="flex justify-between">
               <span className="flex items-center">
                 <CreditCardIcon className="mr-1 w-4 h-4" />
                 Cuota procesamiento
               </span>
               <span>{formatNumber(costCalculation.processingFee, "es-CO", "COP")} COP</span>
             </div>
           )}
          
          {costCalculation.installmentFee > 0 && (
            <div className="flex justify-between">
              <span>Cuota por cuotas</span>
              <span>{formatNumber(costCalculation.installmentFee, "es-CO", "COP")} COP</span>
            </div>
          )}
          
          <Divider className="my-2" />
          
          <div className="flex justify-between text-lg font-semibold">
            <span>Total a Pagar</span>
            <span className="text-green-600">
              {formatNumber(costCalculation.total, "es-CO", "COP")} COP
            </span>
          </div>
        </div>
      </div>
    );
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
                setStockVerified(false);
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
                      {method.icon}
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

        {/* 🆕 Desglose de costos dinámico */}
        {renderCostBreakdown()}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrent(2)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Volver
          </button>

          <button
            onClick={handlePayment}
            disabled={loading || !stockVerified || !costCalculation?.available}
            className="px-6 py-2 bg-[#E2060F] text-white rounded hover:bg-[#001529] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : 
             !stockVerified ? "Verificando..." :
             !costCalculation?.available ? "Productos no disponibles" :
             "Proceder al Pago"}
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
