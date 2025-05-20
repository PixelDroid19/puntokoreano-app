import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Box,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout.store";
import StatusBadge from "./components/StatusBadge";
import OrderItem from "./components/OrderItem";
import OrderSummary from "./components/OrderSummary";
import { apiGet, ENDPOINTS } from "@/api/apiClient";

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      code: string;
      images: string[];
      imageGroup?: { images: { url: string }[] };
      useGroupImages?: boolean;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    type: string;
  };
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping_method: string;
  shipping_cost: number;
  subtotal: number;
  tax: number;
  total: number;
  payment: {
    status: string;
    method: string;
    transaction_id: string;
    processed_at: string;
  };
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  status_history: Array<{
    status: string;
    date: string;
    comment: string;
    _id: string;
  }>;
}

const ThanksOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useCheckoutStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        navigate("/store");
        return;
      }

      try {
        setLoading(true);
        const data = await apiGet(ENDPOINTS.ORDERS.GET_ORDER, {
          id: orderId,
        });
        setOrderDetails(data.data);
      } catch (error) {
        /*   toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo obtener el detalle de la orden",
        }); */
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            No se encontró la orden
          </h2>
          <p className="mt-2 text-gray-500">
            No pudimos encontrar la información de tu pedido.
          </p>
          <button
            onClick={() => navigate("/store")}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            Ir a la tienda
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Logo and header */}
      <div className="text-center mb-10">
        <img
          className="h-14 w-auto mx-auto mb-4"
          src="https://puntokoreano.com/images/logo-512x512.png"
          alt="Logo"
        />
        <StatusBadge
          status={orderDetails.status as any}
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {orderDetails.status === "cancelled" ||
          orderDetails.status === "failed"
            ? "Tu orden ha sido cancelada"
            : "¡Gracias por tu compra!"}
        </h1>
        <p className="text-gray-500 mt-2">
          Pedido{" "}
          <span className="font-medium text-gray-700">
            {orderDetails.order_number}
          </span>{" "}
          • {formatDate(orderDetails.created_at)}
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Order status message */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-100 p-2">
              {orderDetails.status === "cancelled" ||
              orderDetails.status === "failed" ? (
                <CreditCard className="h-5 w-5 text-gray-500" />
              ) : (
                <ShoppingBag className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div>
              <h2 className="font-medium text-gray-900">
                {orderDetails.status === "cancelled" ||
                orderDetails.status === "failed"
                  ? "Tu pago ha sido rechazado"
                  : "Tu pedido ha sido recibido"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {orderDetails.status === "cancelled" ||
                orderDetails.status === "failed"
                  ? "Lo sentimos, pero tu pago ha sido rechazado. Por favor, intenta con otro método de pago o contacta a tu banco."
                  : `Recibirás un correo electrónico con la confirmación y detalles de seguimiento.`}
              </p>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Box className="h-4 w-4" />
            Productos
          </h3>
          <div className="space-y-1">
            {orderDetails.items.map((item, index) => (
              <OrderItem
                key={`${item.product.id}-${index}`}
                product={item.product}
                quantity={item.quantity}
                price_paid={item.price_paid}
                total={item.total}
              />
            ))}
          </div>
        </div>

        {/* Order info */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left column */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Información de envío
              </h3>
              <div className="text-sm space-y-1.5">
                <p className="font-medium">
                  {orderDetails.shipping_address.name}
                </p>
                <p className="text-gray-600">
                  {orderDetails.shipping_address.address}
                </p>
                <p className="text-gray-600">
                  {orderDetails.shipping_address.city},{" "}
                  {orderDetails.shipping_address.state}{" "}
                  {orderDetails.shipping_address.zip}
                </p>
                <p className="text-gray-600">
                  {orderDetails.shipping_address.country}
                </p>
                <p className="text-gray-600 mt-2">
                  {orderDetails.shipping_address.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Entrega estimada
              </h3>
              <p className="text-sm text-gray-600">
                {orderDetails.estimated_delivery
                  ? formatDate(orderDetails.estimated_delivery)
                  : "Fecha no disponible"}
              </p>
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  Método:{" "}
                  {orderDetails.shipping_method === "express"
                    ? "Express"
                    : "Estándar"}
                </span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Resumen del pedido
            </h3>

            <OrderSummary
              subtotal={orderDetails.subtotal}
              shipping_cost={orderDetails.shipping_cost}
              tax={orderDetails.tax}
              total={orderDetails.total}
            />

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Forma de pago
              </h4>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                {orderDetails.payment.method}{" "}
                {/* •{" "}
                {orderDetails.payment.transaction_id} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue shopping button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/store")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
        >
          Seguir comprando
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ThanksOrder;