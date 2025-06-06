// src/pages/account/components/AddressSection.tsx
import { useState, useEffect } from "react";
import { Card, Button, List, Form, Input, Modal, Select, notification, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { apiGet, apiPost, apiPut, apiDelete, ENDPOINTS } from "@/api/apiClient";

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
}

interface AddressFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const { Option } = Select;

const AddressSection = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form] = Form.useForm<AddressFormData>();

  // Fetch user addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiGet<{ success: boolean; data: Address[] }>(ENDPOINTS.USER.GET_ADDRESSES);
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar las direcciones",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    form.resetFields();
    setEditingAddress(null);
    setModalVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    form.setFieldsValue({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await apiDelete<{ success: boolean }>(
        ENDPOINTS.USER.DELETE_ADDRESS,
        { addressId }
      );
      if (response.success) {
        notification.success({
          message: "Dirección eliminada",
          description: "La dirección ha sido eliminada exitosamente",
        });
        fetchAddresses();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo eliminar la dirección",
      });
    }
  };

  const handleSubmit = async (values: AddressFormData) => {
    try {
      if (editingAddress) {
        // Update existing address
        const response = await apiPut<{ success: boolean }>(
          ENDPOINTS.USER.UPDATE_ADDRESS,
          values,
          { addressId: editingAddress.id }
        );
        if (response.success) {
          notification.success({
            message: "Dirección actualizada",
            description: "La dirección ha sido actualizada exitosamente",
          });
        }
      } else {
        // Add new address
        const response = await apiPost<{ success: boolean }>(
          ENDPOINTS.USER.ADD_ADDRESS,
          values
        );
        if (response.success) {
          notification.success({
            message: "Dirección agregada",
            description: "La dirección ha sido agregada exitosamente",
          });
        }
      }
      setModalVisible(false);
      fetchAddresses();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo guardar la dirección",
      });
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await apiPut<{ success: boolean }>(
        ENDPOINTS.USER.SET_DEFAULT_ADDRESS,
        {},
        { addressId }
      );
      if (response.success) {
        notification.success({
          message: "Dirección predeterminada",
          description: "La dirección se ha establecido como predeterminada",
        });
        fetchAddresses();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo establecer como dirección predeterminada",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis direcciones</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddAddress}
          className="bg-[#E2060F] hover:bg-[#001529]"
        >
          Agregar dirección
        </Button>
      </div>

      <List
        loading={loading}
        dataSource={addresses}
        locale={{ emptyText: "No tienes direcciones guardadas" }}
        renderItem={(address) => (
          <List.Item
            actions={[
              <Button 
                icon={<EditOutlined />} 
                onClick={() => handleEditAddress(address)}
                type="text"
              />,
              !address.isDefault && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleSetDefaultAddress(address.id)}
                  className="text-[#E2060F]"
                >
                  Establecer predeterminada
                </Button>
              ),
              <Popconfirm
                title="¿Estás seguro de eliminar esta dirección?"
                onConfirm={() => handleDeleteAddress(address.id)}
                okText="Sí"
                cancelText="No"
                okButtonProps={{ className: "bg-[#E2060F] hover:bg-[#001529]" }}
              >
                <Button icon={<DeleteOutlined />} type="text" danger />
              </Popconfirm>,
            ].filter(Boolean)}
          >
            <Card className="w-full">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className="font-semibold">{address.name}</span>
                  {address.isDefault && (
                    <span className="text-[#E2060F] text-sm">Predeterminada</span>
                  )}
                </div>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state}, {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>Tel: {address.phone}</p>}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingAddress ? "Editar dirección" : "Agregar dirección"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isDefault: false }}
        >
          <Form.Item
            name="name"
            label="Nombre de la dirección"
            rules={[{ required: true, message: "Por favor ingresa un nombre para esta dirección" }]}
          >
            <Input placeholder="Casa, Trabajo, etc." />
          </Form.Item>

          <Form.Item
            name="address"
            label="Dirección"
            rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="city"
            label="Ciudad"
            rules={[{ required: true, message: "Por favor ingresa la ciudad" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="state"
            label="Departamento/Estado"
            rules={[{ required: true, message: "Por favor ingresa el departamento o estado" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="postalCode"
            label="Código postal"
            rules={[{ required: true, message: "Por favor ingresa el código postal" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label="País"
            rules={[{ required: true, message: "Por favor selecciona el país" }]}
          >
            <Select placeholder="Selecciona un país">
              <Option value="Colombia">Colombia</Option>
              <Option value="México">México</Option>
              <Option value="Argentina">Argentina</Option>
              <Option value="Chile">Chile</Option>
              <Option value="Perú">Perú</Option>
              <Option value="Ecuador">Ecuador</Option>
              <Option value="Venezuela">Venezuela</Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
            <Select>
              <Option value={true}>Establecer como dirección predeterminada</Option>
              <Option value={false}>No establecer como predeterminada</Option>
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
              {editingAddress ? "Actualizar" : "Guardar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressSection;