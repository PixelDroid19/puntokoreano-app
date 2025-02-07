import { Form, Input, Select } from "antd";

export const DaviPlataForm = ({ onValidChange }) => {
  const [form] = Form.useForm();

  const handleChange = async () => {
    try {
      const values = await form.validateFields();
      onValidChange(true, values);
    } catch {
      onValidChange(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleChange}>
      <Form.Item
        label="Tipo de Documento"
        name="documentType"
        rules={[{ required: true }]}
      >
        <Select placeholder="Seleccione tipo">
          <Select.Option value="CC">Cédula de Ciudadanía</Select.Option>
          <Select.Option value="CE">Cédula de Extranjería</Select.Option>
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
        <Input />
      </Form.Item>
    </Form>
  );
};
