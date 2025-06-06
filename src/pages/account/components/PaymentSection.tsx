// src/pages/account/components/PaymentSection.tsx
import { useState, useEffect } from "react";
import { Card, Button, List, Form, Input, Modal, Select, notification, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, CreditCardOutlined } from "@ant-design/icons";
import { apiDelete, apiGet, apiPost, apiPut, ENDPOINTS } from "@/api/apiClient";

interface PaymentMethod {
  id: string;
  type: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface PaymentFormData {
  type: "credit_card" | "debit_card" | "paypal";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  isDefault: boolean;
}

const { Option } = Select;

const PaymentSection = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm<PaymentFormData>();

  // Fetch user payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await apiGet(ENDPOINTS.USER.GET_PAYMENT_METHODS);
      if (response.data.success) {
        setPaymentMethods(response.data.data);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los métodos de pago",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleAddPaymentMethod = () => {
    form.resetFields();
    form.setFieldsValue({ type: "credit_card", isDefault: false });
    setModalVisible(true);
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      const response = await apiDelete(
        ENDPOINTS.USER.DELETE_PAYMENT_METHOD,
        { methodId }
      );
      if (response.data.success) {
        notification.success({
          message: "Método de pago eliminado",
          description: "El método de pago ha sido eliminado exitosamente",
        });
        fetchPaymentMethods();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo eliminar el método de pago",
      });
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId: string) => {
    try {
      const response = await apiPut(
        ENDPOINTS.USER.SET_DEFAULT_PAYMENT_METHOD,
        {},
        { methodId }
      );
      if (response.data.success) {
        notification.success({
          message: "Método de pago predeterminado",
          description: "El método de pago se ha establecido como predeterminado",
        });
        fetchPaymentMethods();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo establecer como método de pago predeterminado",
      });
    }
  };

  const handleSubmit = async (values: PaymentFormData) => {
    try {
      // Remove CVV from data sent to server for security
      const { cvv, ...paymentData } = values;
      
      const response = await apiPost(ENDPOINTS.USER.ADD_PAYMENT_METHOD, paymentData);
      if (response.data.success) {
        notification.success({
          message: "Método de pago agregado",
          description: "El método de pago ha sido agregado exitosamente",
        });
        setModalVisible(false);
        fetchPaymentMethods();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo guardar el método de pago",
      });
    }
  };

  // Format card number for display (e.g., **** **** **** 1234)
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "";
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  // Get card type icon/name based on first digits
  const getCardType = (cardNumber: string) => {
    if (!cardNumber) return "Tarjeta";
    
    // Simple detection based on first digit
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "MasterCard";
    if (firstDigit === "3") return "American Express";
    if (firstDigit === "6") return "Discover";
    
    return "Tarjeta";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis métodos de pago</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddPaymentMethod}
          className="bg-[#E2060F] hover:bg-[#001529]"
        >
          Agregar método de pago
        </Button>
      </div>

      <List
        loading={loading}
        dataSource={paymentMethods}
        locale={{ emptyText: "No tienes métodos de pago guardados" }}
        renderItem={(method) => (
          <List.Item
            actions={[
              !method.isDefault && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                  className="text-[#E2060F]"
                >
                  Establecer predeterminado
                </Button>
              ),
              <Popconfirm
                title="¿Estás seguro de eliminar este método de pago?"
                onConfirm={() => handleDeletePaymentMethod(method.id)}
                okText="Sí"
                cancelText="No"
                okButtonProps={{ className: "bg-[#E2060F] hover:bg-[#001529]" }}
              >
                <Button icon={<DeleteOutlined />} type="text" danger />
              </Popconfirm>,
            ].filter(Boolean)}
          >
            <Card className="w-full">
              <div className="flex items-center gap-4">
                <CreditCardOutlined style={{ fontSize: '24px' }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {method.type === "credit_card" ? "Tarjeta de Crédito" : 
                       method.type === "debit_card" ? "Tarjeta de Débito" : 
                       "PayPal"}
                    </span>
                    {method.isDefault && (
                      <span className="text-[#E2060F] text-sm">Predeterminado</span>
                    )}
                  </div>
                  {method.cardNumber && (
                    <>
                      <p>{getCardType(method.cardNumber)} - {formatCardNumber(method.cardNumber)}</p>
                      <p>Titular: {method.cardHolder}</p>
                      <p>Expira: {method.expiryDate}</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Agregar método de pago"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: "credit_card", isDefault: false }}
        >
          <Form.Item
            name="type"
            label="Tipo de método de pago"
            rules={[{ required: true, message: "Por favor selecciona un tipo" }]}
          >
            <Select>
              <Option value="credit_card">Tarjeta de Crédito</Option>
              <Option value="debit_card">Tarjeta de Débito</Option>
              <Option value="paypal">PayPal</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const paymentType = getFieldValue('type');
              
              if (paymentType === 'paypal') {
                return (
                  <Form.Item
                    name="email"
                    label="Correo electrónico de PayPal"
                    rules={[{ required: true, type: 'email', message: "Por favor ingresa un correo válido" }]}
                  >
                    <Input />
                  </Form.Item>
                );
              }
              
              return (
                <>
                  <Form.Item
                    name="cardNumber"
                    label="Número de tarjeta"
                    rules={[{ required: true, message: "Por favor ingresa el número de tarjeta" }]}
                  >
                    <Input maxLength={16} />
                  </Form.Item>

                  <Form.Item
                    name="cardHolder"
                    label="Nombre del titular"
                    rules={[{ required: true, message: "Por favor ingresa el nombre del titular" }]}
                  >
                    <Input />
                  </Form.Item>

                  <div className="flex gap-4">
                    <Form.Item
                      name="expiryDate"
                      label="Fecha de expiración (MM/AA)"
                      className="flex-1"
                      rules={[{ required: true, message: "Por favor ingresa la fecha de expiración" }]}
                    >
                      <Input placeholder="MM/AA" maxLength={5} />
                    </Form.Item>

                    <Form.Item
                      name="cvv"
                      label="CVV"
                      className="flex-1"
                      rules={[{ required: true, message: "Por favor ingresa el CVV" }]}
                    >
                      <Input maxLength={4} />
                    </Form.Item>
                  </div>
                </>
              );
            }}
          </Form.Item>

          <Form.Item name="isDefault" label="Establecer como predeterminado">
            <Select>
              <Option value={true}>Sí</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-[#E2060F] hover:bg-[#001529]"
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentSection;