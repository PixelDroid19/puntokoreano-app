// src/pages/account/components/ProfileSection.tsx
import { useState } from "react";
import { Form, Input, Button, Card, Space, Select, notification } from "antd";
import { useAuthStore } from "@/store/auth.store";
import { apiPatch, apiPost, ENDPOINTS } from "@/api/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  document_type?: string;
  document_number?: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    theme?: "light" | "dark";
    language?: string;
  };
  [key: string]: any;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string | number;
  document_type?: string;
  document_number?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  code?: string;
}

const ProfileSection = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm<ProfileFormData>();
  const [passwordForm] = Form.useForm<PasswordFormData>();

  const handleProfileUpdate = async (values: ProfileFormData) => {
    setLoading(true);
    try {
      const response = await apiPatch<ApiResponse<User>>(
        ENDPOINTS.USER.UPDATE_PROFILE,
        values
      );
      if (response.success) {
        updateUser(response.data);
        notification.success({
          message: "Perfil actualizado",
          description: "Tu información ha sido actualizada correctamente.",
        });
      }
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);

      let errorMessage = "No se pudo actualizar el perfil";
      if (error.response?.data?.errors?.length > 0) {
        errorMessage = error.response.data.errors.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      notification.error({
        message: "Error al actualizar perfil",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordFormData) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: "Error en la contraseña",
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    if (values.newPassword.length < 8) {
      notification.error({
        message: "Error en la contraseña",
        description: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiPost<ApiResponse<null>>(
        ENDPOINTS.USER.CHANGE_PASSWORD,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }
      );

      if (response.success) {
        notification.success({
          message: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada correctamente.",
        });
        passwordForm.resetFields();
      }
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);

      let errorMessage = "No se pudo actualizar la contraseña";
      if (error.response?.data?.code === "INVALID_CURRENT_PASSWORD") {
        errorMessage = "La contraseña actual es incorrecta";
      } else if (error.response?.data?.code === "WEAK_PASSWORD") {
        errorMessage = "La nueva contraseña es demasiado débil";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      notification.error({
        message: "Error al cambiar contraseña",
        description: errorMessage,
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
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            document_type: user?.document_type || "",
            document_number: user?.document_number || "",
          }}
          onFinish={handleProfileUpdate}
        >
          <Form.Item
            label="Nombre completo"
            name="name"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nombre completo",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo electrónico",
              },
              {
                type: "email",
                message: "Por favor ingresa un correo electrónico válido",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Tipo de documento" name="document_type">
            <Select placeholder="Selecciona tipo de documento">
              <Select.Option value="cc">Cédula de Ciudadanía</Select.Option>
              <Select.Option value="ce">Cédula de Extranjería</Select.Option>
              <Select.Option value="passport">Pasaporte</Select.Option>
              <Select.Option value="nit">NIT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Número de documento" name="document_number">
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
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña actual",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nueva contraseña"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nueva contraseña",
              },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Por favor confirma tu nueva contraseña",
              },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
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
