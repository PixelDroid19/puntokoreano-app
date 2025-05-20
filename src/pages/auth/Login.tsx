// src/pages/auth/Login.tsx
import { useAuth } from "@/hooks/useAuth";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://puntokoreano.com/images/logos/logo_1.png"
            alt="Logo"
            className="mx-auto w-24 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
                message: "Por favor ingresa tu contraseña",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#E2060F] hover:bg-[#001529]"
              size="large"
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <span className="text-gray-600">¿No tienes una cuenta?</span>{" "}
          <Link to="/register" className="text-[#E2060F] hover:text-[#001529]">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
