import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Select, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ENDPOINTS from "@/api";

const { Option } = Select;

// Colombia department/postal code mapping
const COLOMBIA_POSTAL_CODES = {
  "Bogotá D.C.": "110111",
  Antioquia: "050001",
  "Valle del Cauca": "760001",
  Cundinamarca: "250001",
  Atlántico: "080001",
  Santander: "680001",
  Amazonas: "910001",
  Vaupés: "970001",
  Guainía: "940001",
  Vichada: "990001",
} as const;

const SHIPPING_METHODS = [
  { value: "express", label: "Envío exprés", description: "1-2 días hábiles" },
  {
    value: "standard",
    label: "Envío estándar",
    description: "3-5 días hábiles",
  },
  {
    value: "pickup",
    label: "Recogida en tienda",
    description: "Sin costo adicional",
  },
];

const Shipping = ({ setStatus, setCurrent }) => {
  const { setShippingInfo, shippingInfo } = useCheckoutStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Get saved contact info
  const contactData = localStorage.getItem("checkoutContact");
  const contactInfo = contactData ? JSON.parse(contactData) : null;

  // Handle state/zip code relationship
  const handleStateChange = (state: keyof typeof COLOMBIA_POSTAL_CODES) => {
    const postalCode = COLOMBIA_POSTAL_CODES[state];
    form.setFieldsValue({
      zip: postalCode,
      state: state,
    });

    // También actualizar el shippingInfo para mantener consistencia
    const currentValues = form.getFieldsValue();
    localStorage.setItem(
      "checkoutShipping",
      JSON.stringify({
        ...currentValues,
        zip: postalCode,
      })
    );
  };

  const onFinish = async (values) => {
    try {
      // Verificar que tenemos el código postal correcto para el departamento
      const postalCode = COLOMBIA_POSTAL_CODES[values.state];
      if (!postalCode) {
        notification.error({
          message: "Error",
          description: "Departamento no válido o código postal no encontrado",
          placement: "topRight",
        });
        return;
      }

      const items = useCartStore.getState().items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Formatear la dirección completa
      const formattedStreet = values.street.trim();

      // Crear el objeto de dirección de envío con todos los campos necesarios
      const shippingAddress = {
        name: contactInfo?.name + " " + contactInfo?.lastName || "",
        street: formattedStreet,
        address: formattedStreet, // Campo duplicado para compatibilidad
        address_line_1: formattedStreet, // Campo específico para Wompi
        city: values.city.trim(),
        state: values.state,
        country: "Colombia",
        zip: postalCode,
        phone: (contactInfo?.phone || values.phone || "").replace(/\D/g, ""),
        email: contactInfo?.email?.trim(),
        shipping_method: values.shippingMethod,
        type: "shipping",
      };

      // Guardar en localStorage
      localStorage.setItem(
        "checkoutShipping",
        JSON.stringify({
          street: formattedStreet,
          city: values.city,
          state: values.state,
          country: "Colombia",
          zip: postalCode,
        })
      );

      const payload = {
        items: items,
        shipping_address: shippingAddress,
        shipping_method: values.shippingMethod,
      };

      console.log("Sending payload:", payload); // Para debugging

      const response = await axios.post(
        ENDPOINTS.ORDERS.CALCULATE_SHIPPING.url,
        payload
      );

      if (response.data.success) {
        setShippingInfo({
          ...shippingInfo,
          ...shippingAddress,
          shipping_method: values.shippingMethod,
          shipping_cost: response.data.data.shipping_cost,
          estimated_delivery: response.data.data.estimated_delivery,
        });

        setCurrent(2);
      } else {
        notification.error({
          message: "Error",
          description:
            response.data.message || "No se pudo calcular el costo de envío",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMsg =
        error.response?.data?.message ||
        "No se pudo calcular el costo de envío";
      notification.error({
        message: "Error",
        description: errorMsg,
        placement: "topRight",
      });
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={() => setStatus("error")}
      layout="vertical"
      className="border rounded-lg p-4 mt-5 bg-white"
      initialValues={{
        name: contactInfo ? `${contactInfo.name} ${contactInfo.lastName}` : "",
        phone: contactInfo?.phone || "",
        country: "Colombia",
        ...JSON.parse(localStorage.getItem("checkoutShipping") || "{}"),
      }}
    >
      {/* Rest of the JSX remains the same */}
      <h1 className="text-xl text-center font-bold mb-6">Datos de envío</h1>

      <Form.Item
        name="shippingMethod"
        label="Tipo de envío"
        extra="Puede afectar el costo total de su pedido"
        rules={[{ required: true, message: "Selecciona un método de envío" }]}
      >
        <Select>
          {SHIPPING_METHODS.map((method) => (
            <Option key={method.value} value={method.value}>
              {method.label} - {method.description}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {!contactInfo?.phone && (
        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[
            { required: true, message: "El teléfono es requerido" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Ingrese un número válido de 10 dígitos",
            },
          ]}
        >
          <Input placeholder="3001234567" maxLength={10} />
        </Form.Item>
      )}

      <Form.Item
        name="street"
        label="Dirección"
        rules={[
          { required: true, message: "La dirección es requerida" },
          { min: 4, message: "La dirección debe tener al menos 4 caracteres" },
          {
            validator: (_, value) => {
              if (value && value.trim().length < 4) {
                return Promise.reject(
                  "La dirección no puede contener solo espacios"
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="DG 1 BIS #23-56 sur torre 1 apto 506" />
      </Form.Item>

      <Form.Item
        name="city"
        label="Ciudad"
        rules={[
          { required: true, message: "La ciudad es requerida" },
          { min: 3, message: "La ciudad debe tener al menos 3 caracteres" },
        ]}
      >
        <Input placeholder="Bogotá" />
      </Form.Item>

      <Form.Item
        name="state"
        label="Departamento"
        rules={[{ required: true, message: "El departamento es requerido" }]}
      >
        <Select
          placeholder="Selecciona el departamento"
          onChange={handleStateChange}
        >
          {Object.keys(COLOMBIA_POSTAL_CODES).map((state) => (
            <Option key={state} value={state}>
              {state}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="country" label="País" rules={[{ required: true }]}>
        <Select disabled>
          <Option value="Colombia">Colombia</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="zip"
        label="Código Postal"
        rules={[
          { required: true, message: "El código postal es requerido" },
          {
            pattern: /^\d{6}$/,
            message: "El código postal debe tener 6 dígitos",
          },
        ]}
      >
        <Input placeholder="110111" maxLength={6} />
      </Form.Item>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <button
          type="button"
          onClick={() => navigate("/store")}
          className="bg-blue-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Seguir comprando
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrent(0)}
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg hover:bg-[#001529] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Contacto
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg hover:bg-[#001529] transition-colors"
          >
            Facturación <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </Form>
  );
};

export default Shipping;
