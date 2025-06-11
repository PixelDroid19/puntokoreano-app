import { useCheckoutStore } from "@/store/checkout.store";
import { useCartStore } from "@/store/cart.store";
import { faArrowLeft, faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Descriptions, Divider, Spin, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ENDPOINTS from "@/api";
import { formatNumber } from "@/pages/store/utils/formatPrice";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface ShippingCalculation {
  cost: number;
  method: string;
  estimatedDays: string;
  freeShipping: boolean;
  details?: {
    threshold?: number;
  };
}

const Review: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const { shippingInfo } = useCheckoutStore();
  const { items } = useCartStore();
  
  const [shippingCost, setShippingCost] = useState<ShippingCalculation | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Recuperar datos guardados
  const contactData = localStorage.getItem("checkoutContact");
  const shippingData = localStorage.getItem("checkoutShipping");
  
  const contactInfo = contactData ? JSON.parse(contactData) : null;
  const shippingDetails = shippingData ? JSON.parse(shippingData) : null;

  // 🆕 Calcular costo de envío cuando se monta el componente (solo una vez)
  useEffect(() => {
    const calculateShippingCost = async () => {
      if (!shippingDetails || !items?.length) return;
      
      // 🔒 Prevenir cálculo si ya se calculó
      if (shippingCost !== null) return;

      setCalculatingShipping(true);
      setShippingError(null);

      try {
        const response = await axios.post(ENDPOINTS.ORDERS.CALCULATE_SHIPPING_COST.url, {
          shipping_address: {
            city: shippingDetails.city,
            state: shippingDetails.state,
            country: shippingDetails.country || "Colombia"
          },
          shipping_method: shippingDetails.shippingMethod,
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity,
          }))
        });

        if (response.data.success) {
          setShippingCost(response.data.data);
        } else {
          setShippingError("No se pudo calcular el costo de envío");
        }
      } catch (error) {
        console.error("Error calculando envío:", error);
        setShippingError("Error al calcular el costo de envío");
        notification.error({
          message: "Error de envío",
          description: "No se pudo calcular el costo de envío. Usando estimación.",
        });
        
        // Fallback con costo estimado
        setShippingCost({
          cost: 15000, // Costo estimado
          method: shippingDetails.shippingMethod,
          estimatedDays: "3-5",
          freeShipping: false
        });
      } finally {
        setCalculatingShipping(false);
      }
    };

    calculateShippingCost();
  }, []); // 🆕 Dependencias vacías para ejecutar solo una vez

  if (!contactInfo || !shippingDetails) {
    setStatus("error");
    return (
      <div className="border rounded-lg p-4 mt-5 bg-white">
        <h1 className="text-xl text-center font-bold text-red-600">
          Error: Información incompleta
        </h1>
        <p className="text-center mt-4">
          Por favor, complete todos los pasos anteriores.
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => setCurrent(0)} type="primary">
            Comenzar desde el inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    // Guardar información de shipping calculada en localStorage para el siguiente paso
    if (shippingCost) {
      const shippingWithCost = {
        ...shippingDetails,
        calculatedShipping: shippingCost
      };
      localStorage.setItem("checkoutShipping", JSON.stringify(shippingWithCost));
    }
    setCurrent(3);
  };

  const handleBack = () => {
    setCurrent(1);
  };

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case "standard":
        return "Envío estándar";
      case "express":
        return "Envío exprés";
      case "pickup":
        return "Recogida en tienda";
      default:
        return method;
    }
  };

  return (
    <div className="border rounded-lg p-4 mt-5 bg-white">
      <h1 className="text-xl text-center font-bold mb-6">Revisión de tu pedido</h1>
      
      <div className="space-y-6">
        {/* Información de contacto */}
        <Card size="small" title="Información de contacto" className="shadow-sm">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Nombre">
              {contactInfo.name} {contactInfo.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {contactInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Teléfono">
              {contactInfo.phone}
            </Descriptions.Item>
          </Descriptions>
          <Button 
            type="link" 
            icon={<FontAwesomeIcon icon={faEdit} />}
            onClick={() => setCurrent(0)}
            className="mt-2"
          >
            Editar
          </Button>
        </Card>

        {/* Información de envío */}
        <Card size="small" title="Dirección de envío" className="shadow-sm">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Dirección">
              {shippingDetails.street}
            </Descriptions.Item>
            <Descriptions.Item label="Ciudad">
              {shippingDetails.city}
            </Descriptions.Item>
            <Descriptions.Item label="Departamento">
              {shippingDetails.state}
            </Descriptions.Item>
            <Descriptions.Item label="Código postal">
              {shippingDetails.zip}
            </Descriptions.Item>
            <Descriptions.Item label="País">
              {shippingDetails.country || "Colombia"}
            </Descriptions.Item>
            <Descriptions.Item label="Método de envío">
              {getShippingMethodName(shippingDetails.shippingMethod)}
            </Descriptions.Item>
          </Descriptions>
          <Button 
            type="link" 
            icon={<FontAwesomeIcon icon={faEdit} />}
            onClick={() => setCurrent(1)}
            className="mt-2"
          >
            Editar
          </Button>
        </Card>

        {/* 🆕 Costo de envío calculado dinámicamente */}
          <Card size="small" title="Costo de envío" className="shadow-sm">
          {calculatingShipping ? (
            <div className="flex items-center space-x-2">
              <Spin size="small" />
              <span>Calculando costo de envío...</span>
            </div>
          ) : shippingError ? (
            <div className="text-red-600">
              <p>{shippingError}</p>
              <p className="text-sm text-gray-500 mt-1">
                Se aplicará el costo estimado en el siguiente paso
              </p>
            </div>
          ) : shippingCost ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Costo">
                {shippingCost.freeShipping ? (
                  <span className="text-green-600 font-medium">¡Envío gratis!</span>
                ) : (
                  <span>$ {formatNumber(shippingCost.cost, "es-CO", "COP")} COP</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Entrega estimada">
                {shippingCost.estimatedDays} días hábiles
              </Descriptions.Item>
              <Descriptions.Item label="Método">
                {getShippingMethodName(shippingCost.method)}
              </Descriptions.Item>
              {shippingCost.freeShipping && (
                <Descriptions.Item label="Motivo">
                  <span className="text-green-600 text-sm">
                    Tu pedido califica para envío gratis
                  </span>
                </Descriptions.Item>
              )}
              {!shippingCost.freeShipping && shippingCost.details && (
                <Descriptions.Item label="Detalles">
                  <div className="text-xs text-gray-500">
                    {shippingCost.details.threshold && (
                      <p>
                        💡 Envío gratis desde $ {formatNumber(shippingCost.details.threshold, "es-CO", "COP")} COP
                      </p>
                    )}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          ) : (
            <p className="text-gray-500">
              No se pudo calcular el costo de envío
            </p>
          )}
        </Card>

        {/* Información heredada del shippingInfo del store (si existe) */}
        {shippingInfo?.shipping_cost !== undefined && !shippingCost && (
          <Card size="small" title="Costo de envío (estimado)" className="shadow-sm">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Costo">
                $ {shippingInfo.shipping_cost.toLocaleString("es-CO")} COP
              </Descriptions.Item>
              {shippingInfo.estimated_delivery && (
                <Descriptions.Item label="Entrega estimada">
                  {new Date(shippingInfo.estimated_delivery).toLocaleDateString("es-CO")}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </div>

      <Divider />

      <div className="flex gap-x-5 items-center flex-wrap justify-between">
        <button
          onClick={() => navigate("/store")}
          type="button"
          className="flex items-center gap-2 bg-blue-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Seguir comprando
        </button>

        <div className="flex gap-x-4 items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Envío
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={calculatingShipping}
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg text-base hover:bg-[#001529] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {calculatingShipping ? (
              <>
                <Spin size="small" /> Calculando...
              </>
            ) : (
              <>
            Continuar al pago <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
