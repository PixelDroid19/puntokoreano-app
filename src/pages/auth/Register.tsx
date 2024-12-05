// src/pages/auth/Register.tsx
import { useAuth } from "@/hooks/useAuth";
import { Button, Form, Input, Select, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
}

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: "Error de validación",
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await register(values);
      if (result.success) {
        notification.success({
          message: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Error de registro",
          description: result.error,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Ocurrió un error al intentar registrarte",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://puntokoreano.com/images/logos/logo_1.png"
            alt="Logo"
            className="mx-auto w-24 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Crear Cuenta</h1>
        </div>

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre completo"
            name="name"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nombre completo",
              },
              {
                min: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            ]}
          >
            <Input size="large" />
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
                message: "Por favor ingresa un correo válido",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingresa una contraseña",
              },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Por favor confirma tu contraseña",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[
              {
                pattern: /^[0-9+\s-]+$/,
                message: "Por favor ingresa un número de teléfono válido",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              label="Tipo de documento"
              name="document_type"
              className="w-1/3"
            >
              <Select size="large">
                <Select.Option value="cc">Cédula</Select.Option>
                <Select.Option value="ce">Cédula de extranjería</Select.Option>
                <Select.Option value="passport">Pasaporte</Select.Option>
                <Select.Option value="nit">NIT</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Número de documento"
              name="document_number"
              className="flex-1"
              rules={[
                {
                  pattern: /^[0-9-]+$/,
                  message: "Por favor ingresa solo números",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#E2060F] hover:bg-[#001529]"
              size="large"
              loading={loading}
            >
              Registrarse
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-gray-600">¿Ya tienes una cuenta?</span>{" "}
            <Link to="/login" className="text-[#E2060F] hover:text-[#001529]">
              Iniciar sesión
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;