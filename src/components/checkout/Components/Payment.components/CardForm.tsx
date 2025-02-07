import { useEffect, useState } from "react";
import { Form, Input, Select, notification } from "antd";
import axios from "axios";
import ENDPOINTS from "@/api";
import { debounce } from "lodash";

interface CardFormProps {
  onValidChange: (isValid: boolean, paymentData?: any) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ onValidChange }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);

  // Manejar la tokenización de manera debounced
  const debouncedTokenize = debounce(async (values) => {
    try {
      setValidationInProgress(true);
      setLoading(true);

      // Obtener configuración de Wompi
      const { data: configResponse } = await axios.get(ENDPOINTS.PAYMENT.CONFIG.url);
      const publicKey = configResponse.data?.publicKey;

      if (!publicKey) {
        throw new Error("Missing Wompi public key");
      }

      // Formatear datos de la tarjeta
      const [month, year] = values.expiry.split("/");
      const cardData = {
        number: values.cardNumber.replace(/\s/g, ""),
        exp_month: month,
        exp_year: year,
        cvc: values.cvv,
        card_holder: values.cardHolder.toUpperCase(),
      };

      // Tokenizar tarjeta
      const { data: tokenResponse } = await axios.post(
        ENDPOINTS.PAYMENT.TOKENIZE_CARD.url, 
        cardData
      );

      // Preparar datos para el backend
      const paymentData = {
        method: "wompi",
        provider: "wompi",
        payment_method_type: "CARD",
        card_data: {
          ...cardData,
          token: tokenResponse.data.id
        },
        installments: Number(values.installments)
      };

      onValidChange(true, paymentData);
    } catch (error: any) {
      console.error("Card tokenization error:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error validando la tarjeta"
      });
      onValidChange(false);
    } finally {
      setLoading(false);
      setValidationInProgress(false);
    }
  }, 500);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedTokenize.cancel();
    };
  }, [debouncedTokenize]);

  // Validación del formulario
  const handleChange = async () => {
    try {
      const values = await form.validateFields();
      debouncedTokenize(values);
    } catch (error) {
      onValidChange(false);
    }
  };

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
      onValuesChange={handleChange}
      className="space-y-4"
    >
      <Form.Item
        label="Número de Tarjeta"
        name="cardNumber"
        rules={[
          { required: true, message: "Ingrese el número de tarjeta" },
          { pattern: /^[0-9\s]{13,19}$/, message: "Número de tarjeta inválido" }
        ]}
        getValueFromEvent={(e) => formatCardNumber(e.target.value)}
      >
        <Input
          placeholder="4242 4242 4242 4242"
          maxLength={19}
          disabled={loading}
        />
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item
          label="Fecha Expiración"
          name="expiry"
          rules={[
            { required: true, message: "Ingrese fecha de expiración" },
            { 
              pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
              message: "Formato inválido (MM/YY)"
            }
          ]}
          getValueFromEvent={(e) => formatExpiry(e.target.value)}
        >
          <Input 
            placeholder="MM/YY"
            maxLength={5}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          rules={[
            { required: true, message: "Ingrese el CVV" },
            { pattern: /^[0-9]{3,4}$/, message: "CVV inválido" }
          ]}
        >
          <Input 
            type="password"
            maxLength={4}
            disabled={loading}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Nombre en la Tarjeta"
        name="cardHolder"
        rules={[
          { required: true, message: "Ingrese el nombre del titular" },
          {
            pattern: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]{3,50}$/,
            message: "Nombre inválido"
          }
        ]}
        getValueFromEvent={(e) => e.target.value.toUpperCase()}
      >
        <Input 
          placeholder="Como aparece en la tarjeta"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        label="Cuotas"
        name="installments"
        initialValue="1"
      >
        <Select disabled={loading}>
          {[...Array(36)].map((_, i) => (
            <Select.Option key={i + 1} value={String(i + 1)}>
              {i + 1} {i === 0 ? "cuota" : "cuotas"}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {validationInProgress && (
        <div className="text-center text-gray-500">
          <p>Validando información de la tarjeta...</p>
        </div>
      )}
    </Form>
  );
};