import { useState, useEffect } from "react";
import { Form, Radio, Spin, Input, Select, notification } from "antd";

import axios from "axios";
import ENDPOINTS from "@/api";

interface Bank {
  financial_institution_code: string;
  financial_institution_name: string;
}

export const PSEForm = ({ onValidChange }) => {
  const [form] = Form.useForm();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axios.get(ENDPOINTS.PAYMENT.METHODS.url);
        if (data.success && data.data.banks) {
          setBanks(data.data.banks);
        } else {
          throw new Error("No se pudieron obtener los bancos");
        }
      } catch (error) {
        console.error("Error al obtener bancos:", error);
        notification.error({
          message: "Error",
          description:
            "No se pudieron cargar los bancos. Por favor intente más tarde.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = async () => {
    try {
      const values = await form.validateFields();
      onValidChange(true, values);
    } catch {
      onValidChange(false, {});
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onValuesChange={handleChange}>
      <Form.Item
        label="Banco"
        name="bankCode"
        rules={[{ required: true, message: "Seleccione un banco" }]}
      >
        <Select
          placeholder="Seleccione su banco"
          showSearch
          optionFilterProp="children"
        >
          {banks.map((bank) => (
            <Select.Option
              key={bank.financial_institution_code}
              value={bank.financial_institution_code}
            >
              {bank.financial_institution_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tipo de Persona"
        name="userType"
        rules={[{ required: true, message: "Seleccione el tipo de persona" }]}
        initialValue={0}
      >
        <Radio.Group>
          <Radio value={0}>Natural</Radio>
          <Radio value={1}>Jurídica</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Tipo de Documento"
        name="documentType"
        rules={[{ required: true, message: "Seleccione el tipo de documento" }]}
      >
        <Select placeholder="Seleccione tipo">
          <Select.Option value="CC">Cédula de Ciudadanía</Select.Option>
          <Select.Option value="CE">Cédula de Extranjería</Select.Option>
          <Select.Option value="NIT">NIT</Select.Option>
          <Select.Option value="PP">Pasaporte</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Número de Documento"
        name="documentNumber"
        rules={[
          { required: true, message: "Ingrese el número de documento" },
          { pattern: /^\d{6,12}$/, message: "Número de documento inválido" },
        ]}
      >
        <Input placeholder="Ej: 1234567890" maxLength={12} />
      </Form.Item>

      <Form.Item
        label="Nombres"
        name="firstName"
        rules={[
          { required: true, message: "Ingrese sus nombres" },
          {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
            message: "Nombres inválidos",
          },
        ]}
      >
        <Input placeholder="Ej: Juan Pablo" />
      </Form.Item>

      <Form.Item
        label="Apellidos"
        name="lastName"
        rules={[
          { required: true, message: "Ingrese sus apellidos" },
          {
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
            message: "Apellidos inválidos",
          },
        ]}
      >
        <Input placeholder="Ej: Pérez Rodríguez" />
      </Form.Item>

      <Form.Item
        label="Correo Electrónico"
        name="email"
        rules={[
          { required: true, message: "Ingrese su correo electrónico" },
          { type: "email", message: "Ingrese un correo electrónico válido" },
        ]}
      >
        <Input placeholder="correo@ejemplo.com" />
      </Form.Item>

      <Form.Item
        label="Teléfono Celular"
        name="phoneNumber"
        rules={[
          { required: true, message: "Ingrese su número de celular" },
          {
            pattern: /^3\d{9}$/,
            message: "Ingrese un número válido (10 dígitos)",
          },
        ]}
      >
        <Input placeholder="3001234567" maxLength={10} />
      </Form.Item>
    </Form>
  );
};
