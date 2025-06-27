import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Select, notification, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ENDPOINTS from "@/api";

const { Option } = Select;

// 🆕 Interfaces para la configuración dinámica
interface ShippingMethod {
  value: string;
  label: string;
  description: string;
  baseCost: number;
  deliveryTime: { min: number; max: number };
}

interface ShippingConfig {
  departments: string[];
  methods: ShippingMethod[];
  freeShipping: {
    threshold: number;
    eligibleLocations: string[];
    eligibleMethods: string[];
  };
}

interface ShippingProps {
  setStatus: (status: "wait" | "process" | "finish" | "error" | undefined) => void;
  setCurrent: (current: number) => void;
}

const Shipping: React.FC<ShippingProps> = ({ setStatus, setCurrent }) => {
  const { setShippingInfo, shippingInfo } = useCheckoutStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 🆕 Estado para configuración de envíos
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // 🆕 Cargar configuración de envíos al montar el componente
  useEffect(() => {
    const loadShippingConfig = async () => {
      try {
        setLoadingConfig(true);
        const response = await axios.get(ENDPOINTS.ORDERS.SHIPPING_CONFIG.url);
        
        if (response.data.success) {
          setShippingConfig(response.data.data);
        } else {
          throw new Error(response.data.message || "Error cargando configuración");
        }
      } catch (error) {
        console.error("Error cargando configuración de envíos:", error);
        notification.error({
          message: "Error de configuración",
          description: "No se pudo cargar la configuración de envíos. Usando valores por defecto.",
          placement: "topRight",
        });
        
        // Fallback a configuración básica
        setShippingConfig({
          departments: ["Bogotá D.C.", "Antioquia", "Valle del Cauca", "Cundinamarca"],
          methods: [
            { value: "pickup", label: "Recoger en tienda", description: "Sin costo adicional", baseCost: 0, deliveryTime: {min: 0, max: 1} },
            { value: "cod", label: "Contra entrega", description: "Pago al recibir", baseCost: 8000, deliveryTime: {min: 2, max: 4} },
          ],
          freeShipping: { threshold: 300000, eligibleLocations: [], eligibleMethods: [] }
        });
      } finally {
        setLoadingConfig(false);
      }
    };

    loadShippingConfig();
  }, []);

  // Get saved contact info
  const contactData = localStorage.getItem("checkoutContact");
  const contactInfo = contactData ? JSON.parse(contactData) : null;

  // 🆕 Mapeo básico de códigos postales (fallback)
  const POSTAL_CODE_MAP: Record<string, string> = {
    "Bogotá D.C.": "110111",
    "Antioquia": "050001", 
    "Valle del Cauca": "760001",
    "Cundinamarca": "250001",
    "Atlántico": "080001",
    "Santander": "680001",
    "Amazonas": "910001",
    "Vaupés": "970001",
    "Guainía": "940001",
    "Vichada": "990001",
  };

  // Handle state/zip code relationship
  const handleStateChange = (state: string) => {
    const postalCode = POSTAL_CODE_MAP[state] || "110111";
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

  const onFinish = async (values: any) => {
    try {
      // Verificar que tenemos el código postal correcto para el departamento
      const postalCode = POSTAL_CODE_MAP[values.state] || "110111";
      if (!postalCode) {
        notification.error({
          message: "Error",
          description: "Departamento no válido o código postal no encontrado",
          placement: "topRight",
        });
        return;
      }

      // Verificar que tenemos la información de contacto
      if (!contactInfo?.phone) {
        notification.error({
          message: "Error",
          description: "Información de contacto incompleta. Por favor, regrese al paso anterior.",
          placement: "topRight",
        });
        return;
      }

      const items = useCartStore.getState().items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      // Formatear la dirección completa
      const formattedStreet = values.street.trim();

      // Crear el objeto de dirección de envío con datos de contacto
      const shippingAddress = {
        name: `${contactInfo.name} ${contactInfo.lastName}`,
        street: formattedStreet,
        address: formattedStreet,
        address_line_1: formattedStreet,
        city: values.city.trim(),
        state: values.state,
        country: "Colombia",
        zip: postalCode,
        phone: contactInfo.phone.replace(/\D/g, ""),
        email: contactInfo.email.trim(),
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
          shippingMethod: values.shippingMethod,
        })
      );

      const payload = {
        items: items,
        shipping_address: shippingAddress,
        shipping_method: values.shippingMethod,
      };


      const response = await axios.post(
        ENDPOINTS.ORDERS.CALCULATE_SHIPPING_COST.url,
        payload
      );

      if (response.data.success) {
        const shippingData = response.data.data;
        
        setShippingInfo({
          ...shippingInfo,
          ...shippingAddress,
          shipping_method: values.shippingMethod,
          shipping_cost: shippingData.cost,
          estimated_delivery: shippingData.estimatedDays,
          is_free_shipping: shippingData.freeShipping,
          shipping_details: shippingData.details,
        });

        if (shippingData.freeShipping) {
          notification.success({
            message: "¡Envío gratis!",
            description: "Tu pedido califica para envío gratuito",
            placement: "topRight",
          });
        }

        setCurrent(2);
      } else {
        notification.error({
          message: "Error",
          description:
            response.data.message || "No se pudo calcular el costo de envío",
          placement: "topRight",
        });
      }
    } catch (error: any) {
      
      const errorMsg =
        error.response?.data?.error ||
        "No se pudo calcular el costo de envío";
      notification.error({
        message:  error.response?.data?.message ,
        description: errorMsg,
        placement: "topRight",
      });
    }
  };

  // 🆕 Mostrar loading mientras se carga la configuración
  if (loadingConfig) {
    return (
      <div className="border rounded-lg p-4 mt-5 bg-white">
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
          <span className="ml-3">Cargando configuración de envíos...</span>
        </div>
      </div>
    );
  }

  // 🆕 Si no hay configuración, mostrar error
  if (!shippingConfig) {
    return (
      <div className="border rounded-lg p-4 mt-5 bg-white">
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error de configuración</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la configuración de envíos</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#E2060F] text-white px-4 py-2 rounded-lg hover:bg-[#001529] transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={() => setStatus("error")}
      layout="vertical"
      className="border rounded-lg p-4 mt-5 bg-white"
      initialValues={{
        country: "Colombia",
        ...JSON.parse(localStorage.getItem("checkoutShipping") || "{}"),
      }}
    >
      <h1 className="text-xl text-center font-bold mb-6">Datos de envío</h1>

      <Form.Item
        name="shippingMethod"
        label="Tipo de envío"
        extra="Puede afectar el costo total de su pedido"
        rules={[{ required: true, message: "Selecciona un método de envío" }]}
      >
        <Select>
          {shippingConfig?.methods.map((method) => (
            <Option key={method.value} value={method.value}>
              {method.label} - {method.description}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="street"
        label="Dirección"
        rules={[
          { required: true, message: "La dirección es requerida" },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              
              const cleaned = value.trim();
              
              // Verificar longitud mínima
              if (cleaned.length < 8) {
                return Promise.reject("La dirección debe tener al menos 8 caracteres");
              }
              
              // Verificar longitud máxima
              if (cleaned.length > 100) {
                return Promise.reject("La dirección no puede exceder 100 caracteres");
              }
              
              // Verificar que contenga al menos una letra y un número
              if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
                return Promise.reject("La dirección debe contener letras");
              }
              
              if (!/\d/.test(cleaned)) {
                return Promise.reject("La dirección debe contener al menos un número");
              }
              
              // Verificar que no contenga caracteres peligrosos
              if (/[<>'"{}\\]/.test(cleaned)) {
                return Promise.reject("La dirección contiene caracteres no válidos");
              }
              
              return Promise.resolve();
            },
          },
        ]}
        getValueFromEvent={(e) => 
          e.target.value
            .replace(/[<>'"{}\\]/g, "")
            .slice(0, 100)
        }
        extra="Ejemplo: Calle 123 #45-67 Apto 8B"
      >
        <Input 
          placeholder="Calle 123 #45-67 Apto 8B" 
          maxLength={100}
          autoComplete="street-address"
        />
      </Form.Item>

      <Form.Item
        name="city"
        label="Ciudad"
        rules={[
          { required: true, message: "La ciudad es requerida" },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              
              const cleaned = value.trim();
              
              // Verificar longitud mínima
              if (cleaned.length < 3) {
                return Promise.reject("La ciudad debe tener al menos 3 caracteres");
              }
              
              // Verificar longitud máxima
              if (cleaned.length > 50) {
                return Promise.reject("La ciudad no puede exceder 50 caracteres");
              }
              
              // Verificar que solo contenga letras, espacios y algunos caracteres especiales
              if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s\-\.]+$/.test(cleaned)) {
                return Promise.reject("La ciudad solo puede contener letras, espacios, guiones y puntos");
              }
              
              // Verificar que no sea solo espacios o caracteres especiales
              if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
                return Promise.reject("La ciudad debe contener al menos una letra");
              }
              
              return Promise.resolve();
            },
          },
        ]}
        getValueFromEvent={(e) => 
          e.target.value
            .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s\-\.]/g, "")
            .replace(/\s+/g, " ")
            .slice(0, 50)
        }
      >
        <Input 
          placeholder="Bogotá" 
          maxLength={50}
          autoComplete="address-level2"
        />
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
          {shippingConfig?.departments.map((state) => (
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
            Revisión <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </Form>
  );
};

export default Shipping;
