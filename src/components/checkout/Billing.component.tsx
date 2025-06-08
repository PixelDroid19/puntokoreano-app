import { useCheckoutStore } from "@/store/checkout.store";
import { faArrowLeft, faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Descriptions, Divider } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const Review: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const { shippingInfo } = useCheckoutStore();

  // Recuperar datos guardados
  const contactData = localStorage.getItem("checkoutContact");
  const shippingData = localStorage.getItem("checkoutShipping");
  
  const contactInfo = contactData ? JSON.parse(contactData) : null;
  const shippingDetails = shippingData ? JSON.parse(shippingData) : null;

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
    setCurrent(3);
  };

  const handleBack = () => {
    setCurrent(1);
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
              {shippingDetails.shippingMethod === "standard" ? "Envío estándar" :
               shippingDetails.shippingMethod === "express" ? "Envío exprés" : 
               "Recogida en tienda"}
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

        {/* Costo de envío si está disponible */}
        {shippingInfo?.shipping_cost !== undefined && (
          <Card size="small" title="Costo de envío" className="shadow-sm">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Costo">
                ${shippingInfo.shipping_cost.toLocaleString("es-CO")} COP
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
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
          >
            Continuar al pago <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
