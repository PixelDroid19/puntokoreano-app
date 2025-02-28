// src/pages/account/components/OrdersSection.tsx
import { useState, useEffect } from "react";
import { Table, Tag, Button, Select, Space, notification, Spin, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import ENDPOINTS from "@/api";
import { formatNumber } from "@/pages/store/utils/formatPrice";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  shipping_method: string;
  estimated_delivery?: string;
  items: OrderItem[];
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    email: string;
    phone: string;
  };
  payment: {
    method: string;
    provider: string;
    status: string;
    transaction_id: string;
    amount: number;
    currency: string;
    payment_method_details: {
      type: string;
      installments: number;
    };
    processed_at: string;
  };
  createdAt: string;
  created_at?: string; // Added for backward compatibility
  tracking_number?: string;
}

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
  total: number;
}

const { Option } = Select;

const OrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
  const fetchOrders = async (page = 1, status: string | null = null) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: pagination.pageSize,
      };

      if (status) {
        params.status = status;
      }

      const response = await axios.get(ENDPOINTS.USER.GET_ORDERS.url, { params });
      if (response.data.success) {
        // Map and normalize the data to handle potential API changes
        const normalizedOrders = response.data.data.orders.map((order: any) => ({
          ...order,
          // Ensure createdAt exists (might be created_at in some responses)
          createdAt: order.createdAt || order.created_at,
        }));
        
        setOrders(normalizedOrders);
        setPagination({
          ...pagination,
          current: page,
          total: response.data.data.pagination?.total || 0,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los pedidos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.current, statusFilter);
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchOrders(pagination.current, statusFilter);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    fetchOrders(1, value);
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: "gold", text: "Pendiente" },
      processing: { color: "blue", text: "Procesando" },
      confirmed: { color: "cyan", text: "Confirmado" },
      shipped: { color: "cyan", text: "Enviado" },
      delivered: { color: "green", text: "Entregado" },
      cancelled: { color: "red", text: "Cancelado" },
      refunded: { color: "volcano", text: "Reembolsado" },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || { color: "default", text: status || 'Desconocido' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const columns = [
    {
      title: "Número de pedido",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string, record: Order) => (
        <span>
          {formatDate(record.createdAt || record.created_at, 'distance')}
        </span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span>$ {formatNumber(total, "es-CO", "COP")} COP</span>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Order) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => viewOrderDetails(record)}
          type="primary"
          className="bg-[#E2060F] hover:bg-[#001529]"
        >
          Ver detalles
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis pedidos</h2>
        <Space>
          <span>Filtrar por estado:</span>
          <Select
            allowClear
            placeholder="Todos los estados"
            style={{ width: 200 }}
            onChange={handleStatusFilterChange}
            value={statusFilter}
          >
            <Option value="pending">Pendiente</Option>
            <Option value="processing">Procesando</Option>
            <Option value="shipped">Enviado</Option>
            <Option value="delivered">Entregado</Option>
            <Option value="cancelled">Cancelado</Option>
            <Option value="refunded">Reembolsado</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        locale={{ emptyText: "No tienes pedidos" }}
      />

      <Modal
        title={`Detalles del pedido #${selectedOrder?.order_number || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del pedido</h3>
                <p>
                  <strong>Estado:</strong> {getStatusTag(selectedOrder.status)}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {formatDate(selectedOrder.createdAt || selectedOrder.created_at)}
                </p>
                <p>
                  <strong>Subtotal:</strong> ${" "}
                  {formatNumber(selectedOrder.subtotal, "es-CO", "COP")} COP
                </p>
                <p>
                  <strong>Envío:</strong> ${" "}
                  {formatNumber(selectedOrder.shipping_cost, "es-CO", "COP")} COP
                </p>
                <p>
                  <strong>Impuestos:</strong> ${" "}
                  {formatNumber(selectedOrder.tax, "es-CO", "COP")} COP
                </p>
                <p>
                  <strong>Total:</strong> ${" "}
                  {formatNumber(selectedOrder.total, "es-CO", "COP")} COP
                </p>
                {selectedOrder.tracking_number && (
                  <p>
                    <strong>Número de seguimiento:</strong>{" "}
                    {selectedOrder.tracking_number}
                  </p>
                )}
                {selectedOrder.estimated_delivery && (
                  <p>
                    <strong>Entrega estimada:</strong>{" "}
                    {formatDate(selectedOrder.estimated_delivery)}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Dirección de envío</h3>
                <p><strong>Nombre:</strong> {selectedOrder.shipping_address?.name || 'No disponible'}</p>
                <p><strong>Dirección:</strong> {selectedOrder.shipping_address?.address || 'No disponible'}</p>
                <p>
                  {selectedOrder.shipping_address?.city || 'Ciudad no disponible'},{" "}
                  {selectedOrder.shipping_address?.state || 'Estado no disponible'}
                </p>
                <p>
                  {selectedOrder.shipping_address?.country || 'País no disponible'},{" "}
                  {selectedOrder.shipping_address?.zip || 'Código postal no disponible'}
                </p>
                <p><strong>Email:</strong> {selectedOrder.shipping_address?.email || 'No disponible'}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.shipping_address?.phone || 'No disponible'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Productos</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <Table
                  dataSource={selectedOrder.items}
                  rowKey="_id"
                  pagination={false}
                  columns={[
                    {
                      title: "Producto",
                      dataIndex: ["product", "name"],
                      key: "name",
                      render: (name: string, record: OrderItem) => (
                        <div className="flex items-center gap-2">
                          {record.product?.images && record.product.images.length > 0 ? (
                            <img
                              src={record.product.images[0]}
                              alt={name}
                              className="w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">No img</div>
                          )}
                          <span>{name || 'Producto sin nombre'}</span>
                        </div>
                      ),
                    },
                    {
                      title: "Precio",
                      dataIndex: "price",
                      key: "price",
                      render: (price: number) => (
                        <span>$ {formatNumber(price, "es-CO", "COP")} COP</span>
                      ),
                    },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Subtotal",
                      dataIndex: "total",
                      key: "total",
                      render: (total: number) => (
                        <span>
                          $ {formatNumber(total, "es-CO", "COP")} COP
                        </span>
                      ),
                    },
                  ]}
                />
              ) : (
                <p>No hay productos disponibles</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Información de pago</h3>
              {selectedOrder.payment ? (
                <>
                  <p><strong>Método:</strong> {selectedOrder.payment.method || 'No disponible'}</p>
                  <p><strong>Estado:</strong> {selectedOrder.payment.status || 'No disponible'}</p>
                  <p><strong>ID de transacción:</strong> {selectedOrder.payment.transaction_id}</p>
                  <p><strong>Procesado el:</strong> {formatDate(selectedOrder.payment.processed_at)}</p>
                  {selectedOrder.payment.payment_method_details.installments > 1 && (
                    <p><strong>Cuotas:</strong> {selectedOrder.payment.payment_method_details.installments}</p>
                  )}
                </>
              ) : (
                <p>Información de pago no disponible</p>
              )}
            </div>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </div>
  );
};

export default OrdersSection;