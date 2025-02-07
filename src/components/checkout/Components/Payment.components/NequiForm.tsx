import { useState } from "react";
import { Form, Input, Alert, Spin } from "antd";
//import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import ENDPOINTS from "@/api";
import { PhoneCall } from "lucide-react";

interface NequiFormProps {
  onValidChange: (isValid: boolean, data: any) => void;
}

export const NequiForm = ({ onValidChange }: NequiFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  //  const { total } = useCartStore();

  // Función para obtener token de aceptación
  const getAcceptanceToken = async () => {
    const { data } = await axios.get(`${ENDPOINTS.PAYMENT.CONFIG.url}`);
    return data.data.acceptance_token;
  };

  // Función para crear token de Nequi
  const createNequiToken = async (phoneNumber: string) => {
    const { data } = await axios.post(ENDPOINTS.PAYMENT.TOKENIZE_NEQUI.url, {
      phoneNumber,
    });
    return data.data;
  };

  // Función para hacer polling del estado del token
  const pollTokenStatus = async (tokenId: string, maxAttempts = 20) => {
    let attempts = 0;
    const intervalMs = 3000; // 3 segundos entre intentos

    while (attempts < maxAttempts) {
      try {
        const { data } = await axios.get(
          `${ENDPOINTS.PAYMENT.TOKENIZE_CARD.url}/nequi-token/${tokenId}/poll`
        );

        if (data.data.status === "APPROVED") {
          return data.data;
        }

        if (data.data.status === "REJECTED" || data.data.status === "ERROR") {
          throw new Error("La transacción fue rechazada por Nequi");
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        attempts++;
      } catch (error) {
        console.error("Error polling Nequi token status:", error);
        throw error;
      }
    }

    throw new Error("Tiempo de espera agotado. Por favor intenta nuevamente.");
  };

  // Función para crear fuente de pago
  const createPaymentSource = async (
    tokenId: string,
    acceptanceToken: string
  ) => {
    const { data } = await axios.post(
      `${ENDPOINTS.PAYMENT.TOKENIZE_CARD.url}/nequi-payment-source`,
      {
        tokenId,
        customerEmail: user?.email || "",
        acceptanceToken,
      }
    );
    return data.data;
  };

  const handleNequiTokenization = async (values: { phoneNumber: string }) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener token de aceptación
      setTokenStatus("Iniciando proceso de pago...");
      const acceptanceToken = await getAcceptanceToken();

      // 2. Crear token de Nequi
      setTokenStatus("Conectando con Nequi...");
      const tokenData = await createNequiToken(values.phoneNumber);

      // 3. Polling del estado
      setTokenStatus("Esperando tu aprobación en la app Nequi...");
      const approvedToken = await pollTokenStatus(tokenData.tokenId);

      // 4. Crear fuente de pago
      setTokenStatus("Finalizando el proceso...");
      const paymentSource = await createPaymentSource(
        approvedToken.id,
        acceptanceToken
      );

      // 5. Notificar éxito
      setTokenStatus("¡Pago autorizado con éxito!");
      onValidChange(true, {
        phoneNumber: values.phoneNumber,
        token: paymentSource.id,
        source_id: paymentSource.sourceId,
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error al procesar el pago con Nequi"
      );
      onValidChange(false, null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleNequiTokenization}
        disabled={loading}
      >
        <Form.Item
          label="Número de Celular Nequi"
          name="phoneNumber"
          rules={[
            { required: true, message: "Ingrese el número de celular" },
            {
              pattern: /^3\d{9}$/,
              message: "Ingrese un número válido de Nequi (10 dígitos)",
            },
          ]}
          extra="Este debe ser el mismo número registrado en tu cuenta Nequi"
        >
          <Input
            prefix={<PhoneCall className="text-gray-400" size={18} />}
            placeholder="3001234567"
            maxLength={10}
            className="h-11"
          />
        </Form.Item>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full px-4 py-2.5 rounded-lg transition-all duration-300
            flex items-center justify-center gap-2 font-medium
            ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]"
            }
          `}
        >
          {loading ? (
            <>
              <Spin className="mr-2" />
              Procesando...
            </>
          ) : (
            "Continuar con Nequi"
          )}
        </button>
      </Form>

      {loading && tokenStatus && (
        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
          <Spin />
          <span className="text-blue-700">{tokenStatus}</span>
        </div>
      )}

      {error && (
        <Alert
          message="Error en el proceso"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      <Alert
        message="Importante"
        description={
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Asegúrate de tener la app Nequi instalada y actualizada</li>
            <li>Debes tener fondos suficientes en tu cuenta</li>
            <li>Recibirás una notificación en tu app para autorizar el pago</li>
            <li>El proceso puede tomar hasta 2 minutos</li>
          </ul>
        }
        type="info"
        showIcon
      />
    </div>
  );
};
