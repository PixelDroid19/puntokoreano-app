import React from "react";
import { Form, Input, Select } from "antd";
import { ValidationUtils, TextFormatters } from "@/utils/validations";

interface CardFormProps {
  onValidChange: (isValid: boolean, paymentData?: any) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ onValidChange }) => {
  const [form] = Form.useForm();

  // Inicializar como inválido
  React.useEffect(() => {
    onValidChange(false);
  }, []);

  // Manejar cambios en el formulario
  const handleValuesChange = async () => {
    // Usar un pequeño delay para permitir que Ant Design termine de validar
    setTimeout(async () => {
      try {
        const values = await form.validateFields();
        
        // Verificar que todos los campos requeridos están completos
        if (values.cardNumber && values.expiry && values.cvv && values.cardHolder && values.installments) {
          // Convertir datos al formato esperado
          const [expMonth, expYear] = values.expiry.split('/');
          const paymentData = {
            number: values.cardNumber.replace(/\s/g, ""),
            exp_month: expMonth,
            exp_year: `20${expYear}`,
            cvc: values.cvv,
            card_holder: values.cardHolder.trim(),
            installments: parseInt(values.installments) || 1,
          };
          
          onValidChange(true, paymentData);
        } else {
          onValidChange(false);
        }
      } catch (error) {
        onValidChange(false);
      }
    }, 100);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      className="space-y-4"
    >
      <Form.Item
        label="Número de Tarjeta"
        name="cardNumber"
        rules={[
          { required: true, message: "Ingrese el número de tarjeta" },
                      {
              validator: (_, value) => {
                const error = ValidationUtils.validateCardNumber(value);
                if (error) {
                  return Promise.reject(error);
                }
                return Promise.resolve();
              },
            },
        ]}
        getValueFromEvent={(e) => TextFormatters.formatCardNumber(e.target.value)}
      >
        <Input 
          placeholder="4242 4242 4242 4242" 
          maxLength={23} // 19 dígitos + 4 espacios
          autoComplete="cc-number"
        />
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item
          label="Fecha Expiración"
          name="expiry"
          rules={[
            { required: true, message: "Ingrese fecha de expiración" },
            {
              validator: (_, value) => {
                const error = ValidationUtils.validateExpiry(value);
                if (error) {
                  return Promise.reject(error);
                }
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => TextFormatters.formatExpiry(e.target.value)}
        >
          <Input 
            placeholder="MM/YY" 
            maxLength={5}
            autoComplete="cc-exp"
          />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          rules={[
            { required: true, message: "Ingrese el CVV" },
            {
              validator: (_, value) => {
                const error = ValidationUtils.validateCVV(value);
                if (error) {
                  return Promise.reject(error);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input 
            type="password" 
            maxLength={4}
            autoComplete="cc-csc"
            onInput={(e) => {
              // Solo permitir números
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, "");
            }}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Nombre en la Tarjeta"
        name="cardHolder"
        rules={[
          { required: true, message: "Ingrese el nombre del titular" },
          {
            validator: (_, value) => {
              const error = ValidationUtils.validateCardHolder(value);
              if (error) {
                return Promise.reject(error);
              }
              return Promise.resolve();
            },
          },
        ]}
        getValueFromEvent={(e) => TextFormatters.formatCardHolder(e.target.value)}
        extra="Ejemplo: JUAN CARLOS PEREZ GOMEZ"
      >
        <Input 
          placeholder="Como aparece en la tarjeta" 
          maxLength={50}
          autoComplete="cc-name"
        />
      </Form.Item>

      <Form.Item 
        label="Cuotas" 
        name="installments" 
        initialValue={1}
        rules={[
          { required: true, message: "Seleccione el número de cuotas" }
        ]}
      >
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
