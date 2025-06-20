// src/pages/account/components/OrdersSection.tsx
import { useState, useEffect } from "react";
import { List, Card, Button, Empty, notification, Spin, Tag, Divider, Modal, Timeline } from "antd";
import { ShopOutlined, TruckOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, ENDPOINTS } from "@/api/apiClient";
import { formatNumber } from "@/pages/store/utils/formatPrice";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
    brand?: string;
  } | null;
  quantity: number;
  price: number;
  total: number;
  _id: string;
}

interface Order {
  _id: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "confirmed" | "completed";
  items: OrderItem[];
  total: number; // Cambiado de total_amount a total
  subtotal: number;
  tax: number;
  shipping_cost: number;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string; // Cambiado de postal_code a zip
    country: string;
    email?: string;
    phone?: string;
  };
  payment: {
    method: string;
    provider: string;
    status: string;
    transaction_id: string;
    amount: number;
    currency: string;
  };
  tracking_number?: string;
  createdAt: string; // Cambiado de created_at a createdAt
  updatedAt: string; // Cambiado de updated_at a updatedAt
  estimated_delivery?: string;
  shipping_method?: string;
  status_history?: Array<{
    status: string;
    date: string;
    comment: string;
    _id: string;
  }>;
}

interface OrderTracking {
  status: string;
  description: string;
  date: string;
  location?: string;
  isEstimated?: boolean;
}

const OrdersSection = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<OrderTracking[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Helper function to safely parse dates
  const safeParseDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (error) {
      return null;
    }
  };

  // Format date with fallback
  const formatDate = (dateString: string | undefined, format: 'distance' | 'local' = 'local') => {
    const date = safeParseDate(dateString);
    if (!date) return 'Fecha no disponible';
    
    if (format === 'distance') {
      return formatDistance(date, new Date(), {
        addSuffix: true,
        locale: es,
      });
    } else {
      return date.toLocaleDateString("es-CO");
    }
  };

  // Fetch user orders
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiGet<{
        success: boolean;
        data: {
          orders: Order[];
          pagination: {
            total: number;
            pages: number;
            page: number;
            limit: number;
          };
        };
      }>(
        ENDPOINTS.USER.GET_ORDERS,
        {},
        { page, limit: pagination.pageSize }
      );

      if (response.success) {
        setOrders(response.data.orders);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: response.data.pagination.total,
        }));
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los pedidos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const handleTrackOrder = async (order: Order) => {
    setSelectedOrder(order);
    
    try {
      const response = await apiGet<{
        success: boolean;
        data: OrderTracking[] | {
          hasTracking: boolean;
          message?: string;
          statusHistory?: Array<{
            status: string;
            date: string;
            comment: string;
          }>;
        };
      }>(
        ENDPOINTS.ORDERS.TRACK_ORDER,
        { orderId: order._id }
      );

      if (response.success) {
        // Si la respuesta es un array, es información de tracking
        if (Array.isArray(response.data)) {
          setTrackingInfo(response.data);
          setTrackingModalVisible(true);
        } else if (response.data.hasTracking === false) {
          // No tiene tracking number, mostrar información básica del historial
          const statusHistory = response.data.statusHistory || [];
          const trackingFromHistory: OrderTracking[] = statusHistory.map((history) => ({
            status: history.status,
            description: history.comment || `Estado: ${history.status}`,
            date: history.date,
            location: "Centro de distribución"
          }));
          
          setTrackingInfo(trackingFromHistory);
          setTrackingModalVisible(true);
          
          if (response.data.message) {
            notification.info({
              message: "Información de seguimiento",
              description: response.data.message,
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Error al obtener tracking:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "No se pudo obtener la información de seguimiento",
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await apiPost<{ success: boolean }>(
        ENDPOINTS.ORDERS.CANCEL_ORDER,
        {},
        { orderId }
      );

      if (response.success) {
        notification.success({
          message: "Pedido cancelado",
          description: "El pedido ha sido cancelado exitosamente",
        });
        fetchOrders();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo cancelar el pedido",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "confirmed":
        return "green";
      case "completed":
        return "green";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "processing":
        return "Procesando";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Completado";
      case "shipped":
        return "Enviado";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <CloseCircleOutlined />;
      case "processing":
        return <ShopOutlined />;
      case "confirmed":
        return <CheckCircleOutlined />;
      case "completed":
        return <CheckCircleOutlined />;
      case "shipped":
        return <TruckOutlined />;
      case "delivered":
        return <CheckCircleOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      default:
        return <ShopOutlined />;
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/store/product/${productId}`);
  };

  // Manejar errores de carga de imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/64x64/f3f4f6/a3a3a3?text=No%20Image';
  };

  if (loading && orders.length === 0) {
    return <Spin size="large" className="flex justify-center my-8" />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis pedidos</h2>
        <div className="text-gray-500">
          {pagination.total} pedido{pagination.total !== 1 ? "s" : ""}
        </div>
      </div>

      {orders.length === 0 ? (
        <Empty
          description="No tienes pedidos realizados"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
        >
          <Button 
            type="primary" 
            onClick={() => navigate("/store")}
            className="bg-[#E2060F] hover:bg-[#001529]"
          >
            Comenzar a comprar
          </Button>
        </Empty>
      ) : (
        <List
          loading={loading}
          dataSource={orders}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} pedidos`,
          }}
          renderItem={(order) => (
            <List.Item>
              <Card className="w-full">
                {/* Header del pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Pedido #{order.order_number}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Realizado el {new Date(order.createdAt).toLocaleDateString("es-CO")}
                    </p>
                    {order.tracking_number && (
                      <p className="text-gray-500 text-sm">
                        Seguimiento: {order.tracking_number}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Tag
                      icon={getStatusIcon(order.status)}
                      color={getStatusColor(order.status)}
                    >
                      {getStatusText(order.status)}
                    </Tag>
                    <div className="text-lg font-bold text-[#E2060F]">
                      {formatNumber(order.total, "es-CO", "COP")} COP
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Items del pedido */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={item._id || index} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.name || 'Producto'}
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                            onError={handleImageError}
                            onClick={() => item.product?._id && navigateToProduct(item.product._id)}
                          />
                        ) : (
                          <img
                            src="https://placehold.co/64x64/f3f4f6/a3a3a3?text=No%20Image"
                            alt="Producto"
                            className="w-12 h-12 object-contain opacity-50"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">
                          {item.product?.name || `Producto (${formatNumber(item.price, "es-CO", "COP")} COP)`}
                        </h5>
                        <div className="text-sm text-gray-500">
                          Cantidad: {item.quantity} × ${formatNumber(item.price, "es-CO", "COP")} COP
                        </div>
                        {!item.product && (
                          <div className="text-xs text-orange-500 mt-1">
                            ⚠️ Información del producto no disponible
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatNumber(item.total, "es-CO", "COP")} COP
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 2 && (
                    <div className="text-center text-gray-500 text-sm">
                      + {order.items.length - 2} producto{order.items.length - 2 !== 1 ? "s" : ""} más
                    </div>
                  )}
                </div>

                <Divider />

                {/* Información de envío y pago */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Dirección de envío */}
                  <div>
                    <h6 className="font-semibold mb-2">Dirección de envío:</h6>
                    <div className="text-sm text-gray-600">
                      <p>{order.shipping_address.name}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                      </p>
                      <p>{order.shipping_address.country}</p>
                      {order.shipping_address.phone && (
                        <p className="mt-1">📞 {order.shipping_address.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Información de pago */}
                  <div>
                    <h6 className="font-semibold mb-2">Información de pago:</h6>
                    <div className="text-sm text-gray-600">
                      <p>Método: {order.payment.method}</p>
                      <p>Proveedor: {order.payment.provider.toUpperCase()}</p>
                      <p>Estado: <span className={`font-medium ${order.payment.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                        {order.payment.status === 'completed' ? 'Completado' : order.payment.status}
                      </span></p>
                      <p>ID Transacción: {order.payment.transaction_id}</p>
                      
                      {/* Resumen de montos */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatNumber(order.subtotal, "es-CO", "COP")} COP</span>
                        </div>
                        {order.tax > 0 && (
                          <div className="flex justify-between">
                            <span>Impuestos:</span>
                            <span>{formatNumber(order.tax, "es-CO", "COP")} COP</span>
                          </div>
                        )}
                        {order.shipping_cost > 0 && (
                          <div className="flex justify-between">
                            <span>Envío:</span>
                            <span>{formatNumber(order.shipping_cost, "es-CO", "COP")} COP</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-[#E2060F] border-t border-gray-200 pt-1 mt-1">
                          <span>Total:</span>
                          <span>{formatNumber(order.total, "es-CO", "COP")} COP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-between items-center">
                  <div>
                    {order.estimated_delivery && (
                      <p className="text-sm text-gray-500">
                        Entrega estimada: {new Date(order.estimated_delivery).toLocaleDateString("es-CO")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      icon={<TruckOutlined />}
                      onClick={() => handleTrackOrder(order)}
                      style={{
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                        e.currentTarget.style.borderColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.borderColor = '#2563eb';
                      }}
                    >
                      {order.tracking_number ? 'Rastrear' : 'Ver Estado'}
                    </Button>
                    
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        danger
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Modal de seguimiento */}
      <Modal
        title={`${selectedOrder?.tracking_number ? 'Seguimiento' : 'Estado'} del pedido #${selectedOrder?.order_number}`}
        open={trackingModalVisible}
        onCancel={() => setTrackingModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <div className="mb-4">
              {selectedOrder.tracking_number ? (
                <p><strong>Número de seguimiento:</strong> {selectedOrder.tracking_number}</p>
              ) : (
                <div className="bg-blue-50 p-3 rounded-lg mb-3">
                  <p className="text-blue-700 text-sm">
                    Este pedido aún no tiene número de seguimiento asignado. A continuación se muestra el historial de estados:
                  </p>
                </div>
              )}
              <p><strong>Estado actual:</strong> 
                <Tag 
                  color={getStatusColor(selectedOrder.status)} 
                  className="ml-2"
                >
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </p>
            </div>
            
            {trackingInfo.length > 0 ? (
              <Timeline
                items={trackingInfo.map((tracking, index) => ({
                  dot: index === 0 ? <CheckCircleOutlined className="text-green-500" /> : undefined,
                  children: (
                    <div>
                      <div className="font-semibold">
                        {getStatusText(tracking.status)}
                        {tracking.status === 'estimated' && (
                          <span className="text-blue-500 text-sm ml-2">(Estimado)</span>
                        )}
                      </div>
                      <div className="text-gray-600">{tracking.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tracking.date).toLocaleString("es-CO")}
                        {tracking.location && ` - ${tracking.location}`}
                      </div>
                    </div>
                  ),
                }))}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay información de seguimiento disponible</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersSection;