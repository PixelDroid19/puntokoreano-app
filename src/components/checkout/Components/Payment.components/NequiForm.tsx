// NequiForm.tsx
import { useEffect, useState } from "react";
import { Form, Input, Alert, Spin } from "antd";
import axios from "axios";
import ENDPOINTS from "@/api";
import { PhoneCall, Smartphone } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";

interface NequiFormProps {
  onValidChange: (isValid: boolean, data: any) => void;
}

export const NequiForm = ({ onValidChange }: NequiFormProps) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { items, total } = useCartStore();
  const { shippingInfo } = useCheckoutStore();

  const handleNequiPayment = async (values: { phoneNumber: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Enviar toda la información necesaria al backend
      const { data } = await axios.post(ENDPOINTS.PAYMENT.WOMPI_NEQUI_PAYMENT.url, {
        phoneNumber: values.phoneNumber,
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: shippingInfo,
        amount: total
      });

      if (data.success) {
        // Iniciar polling para verificar el estado de la transacción
        startTransactionPolling(data.data.transactionId);
        onValidChange(true, {
          transactionId: data.data.transactionId,
          phoneNumber: values.phoneNumber
        });
      } else {
        throw new Error(data.message || 'Error procesando el pago');
      }
    } catch (error: any) {
      console.error('Error al procesar pago Nequi:', error);
      setError(error.response?.data?.message || 'Error al procesar el pago con Nequi');
      onValidChange(false, null);
      setLoading(false);
    }
  };

  const startTransactionPolling = (transactionId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${ENDPOINTS.PAYMENT.TRANSACTION_STATUS.url}/${transactionId}`);
        
        if (data.success) {
          const status = data.data.status;
          
          if (status === 'APPROVED') {
            clearInterval(interval);
            setLoading(false);
            onValidChange(true, { transactionId, status: 'APPROVED' });
          } else if (['DECLINED', 'ERROR'].includes(status)) {
            clearInterval(interval);
            setError('La transacción fue rechazada. Por favor intente nuevamente.');
            setLoading(false);
            onValidChange(false, null);
          }
        }
      } catch (error) {
        clearInterval(interval);
        setError('Error verificando el estado del pago');
        setLoading(false);
        onValidChange(false, null);
      }
    }, 3000);

    // Timeout después de 2 minutos
    setTimeout(() => {
      clearInterval(interval);
      setError('Tiempo de espera agotado. Por favor intente nuevamente.');
      setLoading(false);
      onValidChange(false, null);
    }, 120000);
  };

  useEffect(() => {
    return () => {
      // Limpiar cualquier polling pendiente al desmontar
      setLoading(false);
    };
  }, []);

  return (
    <div className="space-y-4">
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleNequiPayment}
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
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]"
            }
          `}
        >
          {loading ? (
            <>
              <Spin size="small" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Smartphone size={20} />
              <span>Pagar con Nequi</span>
            </>
          )}
        </button>
      </Form>

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

      {loading && (
        <Alert
          message="Procesando pago"
          description={
            <div className="space-y-2">
              <p>Por favor sigue estos pasos:</p>
              <ol className="list-decimal pl-4">
                <li>Revisa las notificaciones en tu celular</li>
                <li>Abre la app de Nequi</li>
                <li>Autoriza el pago en la app</li>
                <li>Espera la confirmación en esta página</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
          icon={<Smartphone className="text-blue-500" />}
        />
      )}

      <Alert
        message="Importante"
        description={
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Asegúrate de tener la app Nequi instalada y actualizada</li>
            <li>Debes tener fondos suficientes en tu cuenta</li>
            <li>Recibirás una notificación en tu celular para autorizar el pago</li>
            <li>El proceso puede tomar hasta 2 minutos</li>
          </ul>
        }
        type="info"
        showIcon
      />
    </div>
  );
};