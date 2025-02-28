// src/pages/account/components/ProfileSection.tsx
import { useState } from "react";
import { Form, Input, Button, Card, Space, notification } from "antd";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import ENDPOINTS from "@/api";

interface ProfileFormData {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSection = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm<ProfileFormData>();
  const [passwordForm] = Form.useForm<PasswordFormData>();

  const handleProfileUpdate = async (values: ProfileFormData) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        ENDPOINTS.USER.UPDATE_PROFILE.url,
        values
      );
      if (response.data.success) {
        updateUser(response.data.data);
        notification.success({
          message: "Perfil actualizado",
          description: "Tu información ha sido actualizada exitosamente",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordFormData) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: "Error",
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(ENDPOINTS.USER.CHANGE_PASSWORD.url, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      notification.success({
        message: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente",
      });
      passwordForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo actualizar la contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card title="Información personal" className="w-full">
        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{
            name: user?.name,
            lastName: user?.last_name,
            email: user?.email,
            phone: user?.phone,
          }}
          onFinish={handleProfileUpdate}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="lastName"
            rules={[{ required: true, message: "Por favor ingresa tu apellido" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa tu correo electrónico" },
              { type: "email", message: "Por favor ingresa un correo electrónico válido" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-[#E2060F] hover:bg-[#001529]"
            >
              Actualizar perfil
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Cambiar contraseña" className="w-full">
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Contraseña actual"
            name="currentPassword"
            rules={[{ required: true, message: "Por favor ingresa tu contraseña actual" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nueva contraseña"
            name="newPassword"
            rules={[
              { required: true, message: "Por favor ingresa tu nueva contraseña" },
              { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            rules={[
              { required: true, message: "Por favor confirma tu nueva contraseña" },
              { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-[#E2060F] hover:bg-[#001529]"
            >
              Cambiar contraseña
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default ProfileSection;