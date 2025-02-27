import { Form, Input, Select } from "antd";

interface CardFormProps {
  onValidChange: (isValid: boolean, paymentData?: any) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ onValidChange }) => {
  const [form] = Form.useForm();

  // Formatters
  const formatCardNumber = (value: string) => {
    if (!value) return value;
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValidChange}
      className="space-y-4"
    >
      <Form.Item
        label="Número de Tarjeta"
        name="cardNumber"
        rules={[
          { required: true, message: "Ingrese el número de tarjeta" },
          {
            pattern: /^[0-9\s]{13,19}$/,
            message: "Número de tarjeta inválido",
          },
        ]}
        getValueFromEvent={(e) => formatCardNumber(e.target.value)}
      >
        <Input placeholder="4242 4242 4242 4242" maxLength={19} />
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item
          label="Fecha Expiración"
          name="expiry"
          rules={[
            { required: true, message: "Ingrese fecha de expiración" },
            {
              pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
              message: "Formato inválido (MM/YY)",
            },
          ]}
          getValueFromEvent={(e) => formatExpiry(e.target.value)}
        >
          <Input placeholder="MM/YY" maxLength={5} />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          rules={[
            { required: true, message: "Ingrese el CVV" },
            { pattern: /^[0-9]{3,4}$/, message: "CVV inválido" },
          ]}
        >
          <Input type="password" maxLength={4} />
        </Form.Item>
      </div>

      <Form.Item
        label="Nombre en la Tarjeta"
        name="cardHolder"
        rules={[
          { required: true, message: "Ingrese el nombre del titular" },
          {
            pattern: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]{3,50}$/,
            message: "Nombre inválido",
          },
        ]}
        getValueFromEvent={(e) => e.target.value.toUpperCase()}
      >
        <Input placeholder="Como aparece en la tarjeta" />
      </Form.Item>

      <Form.Item label="Cuotas" name="installments" initialValue={1}>
        <Select>
          {[...Array(36)].map((_, i) => (
            <Select.Option key={i + 1} value={String(i + 1)}>
              {i + 1} {i === 0 ? "cuota" : "cuotas"}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
