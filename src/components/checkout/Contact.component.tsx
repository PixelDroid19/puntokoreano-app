import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Card, Space, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { notification } from "antd";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "@/pages/store/utils/formatPrice";
import { ShoppingCart, Package } from "lucide-react";

interface Props {
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
}

interface FormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

const Contact: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user, isAuthenticated } = useAuthStore();
  const { items, total, totalItems } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Prellenar y guardar datos del usuario autenticado
        const userData = {
          name: user.name,
          lastName: (user as any).lastName || (user as any).last_name || "",
          email: user.email,
          phone: user.phone || "",
          userId: user.id,
          isAuthenticated: true,
        };

        form.setFieldsValue(userData);
        localStorage.setItem("checkoutContact", JSON.stringify(userData));

        // Avanzar automáticamente al siguiente paso
        setCurrent(1);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Error al cargar los datos del usuario",
        });
      }
    }
  }, [isAuthenticated, user, form]);

  const onFinish = (values: FormData) => {
    try {
      const contactData = {
        ...values,
        isAuthenticated: false,
        userId: null,
      };

      localStorage.setItem("checkoutContact", JSON.stringify(contactData));
      setCurrent(1);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Error al guardar los datos de contacto",
      });
      setStatus("error");
    }
  };

  const onFinishFailed = () => {
    setStatus("error");
  };

  // Recuperar datos guardados
  const savedData = localStorage.getItem("checkoutContact");
  const initialValues = savedData ? JSON.parse(savedData) : undefined;

  // 🆕 Renderizar resumen del carrito
  const renderCartSummary = () => (
    <Card className="mt-6" size="small">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <ShoppingCart className="mr-2 w-5 h-5" />
          Tu Carrito
        </h3>
        <span className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-gray-500">x{item.quantity}</span>
            </div>
            <span className="text-sm font-medium">
              $ {formatNumber(item.price * item.quantity, "es-CO", "COP")}
            </span>
          </div>
        ))}
      </div>
      
      <Divider className="my-3" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$ {formatNumber(total, "es-CO", "COP")} COP</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Envío</span>
          <span>Se calculará en el siguiente paso</span>
        </div>
        <Divider className="my-2" />
        <div className="flex justify-between font-medium text-lg">
          <span>Total estimado</span>
          <span className="text-green-600">$ {formatNumber(total, "es-CO", "COP")} COP +envío</span>
        </div>
      </div>
    </Card>
  );

  // Vista para usuarios autenticados
  if (isAuthenticated && user) {
    return (
      <div>
        <div className="border rounded-lg p-4 mt-5 bg-white">
          <h1 className="text-xl text-center font-bold mb-4">
            Información de contacto
          </h1>
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-lg">Comprando como:</p>
              <p className="text-gray-700">
                {user.name} {(user as any).lastName || (user as any).last_name || ""}
              </p>
              <p className="text-gray-600">{user.email}</p>
              {user.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>

          <section className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/store")}
              className="flex items-center gap-2 bg-blue-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Seguir comprando
            </button>

            <button
              onClick={() => setCurrent(1)}
              className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg hover:bg-[#001529] transition-colors"
            >
              Envío <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </section>
        </div>

        {/* 🆕 Resumen del carrito para usuarios autenticados */}
        {renderCartSummary()}
      </div>
    );
  }

  // Formulario para usuarios no autenticados
  return (
    <div>
      <Form
        form={form}
        name="contact_form"
        className="border rounded-lg p-4 mt-5 bg-white"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={initialValues}
      >
        <h1 className="text-xl text-center font-bold mb-4">
          Información de contacto
        </h1>
        <p className="text-center mb-6">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-[#E2060F] cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </span>
        </p>

        <Form.Item
          label="Nombre"
          name="name"
          hasFeedback
          validateDebounce={1000}
          rules={[
            { required: true, message: "El nombre es requerido" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                const cleaned = value.trim();
                
                if (cleaned.length < 2) {
                  return Promise.reject("El nombre debe tener al menos 2 caracteres");
                }
                
                if (cleaned.length > 30) {
                  return Promise.reject("El nombre no puede exceder 30 caracteres");
                }
                
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(cleaned)) {
                  return Promise.reject("El nombre solo puede contener letras");
                }
                
                if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
                  return Promise.reject("El nombre no puede estar vacío");
                }
                
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => 
            e.target.value
              .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]/g, "")
              .replace(/\s+/g, " ")
              .slice(0, 30)
          }
        >
          <Input placeholder="Juan Carlos" maxLength={30} />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="lastName"
          hasFeedback
          validateDebounce={1000}
          rules={[
            { required: true, message: "El apellido es requerido" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                const cleaned = value.trim();
                
                if (cleaned.length < 2) {
                  return Promise.reject("El apellido debe tener al menos 2 caracteres");
                }
                
                if (cleaned.length > 30) {
                  return Promise.reject("El apellido no puede exceder 30 caracteres");
                }
                
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(cleaned)) {
                  return Promise.reject("El apellido solo puede contener letras");
                }
                
                if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
                  return Promise.reject("El apellido no puede estar vacío");
                }
                
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => 
            e.target.value
              .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]/g, "")
              .replace(/\s+/g, " ")
              .slice(0, 30)
          }
        >
          <Input placeholder="Pérez García" maxLength={30} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo Electrónico"
          hasFeedback
          validateDebounce={1000}
          rules={[
            { required: true, message: "El correo electrónico es requerido" },
            { type: "email", message: "Ingresa un correo electrónico válido" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                if (value.length > 100) {
                  return Promise.reject("El correo no puede exceder 100 caracteres");
                }
                
                if (/[<>'"{}\\]/.test(value)) {
                  return Promise.reject("El correo contiene caracteres no válidos");
                }
                
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => 
            e.target.value
              .replace(/[<>'"{}\\]/g, "")
              .slice(0, 100)
              .toLowerCase()
          }
        >
          <Input 
            placeholder="juan.perez@gmail.com" 
            maxLength={100}
            type="email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Número celular"
          hasFeedback
          validateDebounce={1000}
          rules={[
            { required: true, message: "El número celular es requerido" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                const cleaned = value.replace(/\D/g, "");
                
                if (cleaned.length !== 10) {
                  return Promise.reject("El número debe tener exactamente 10 dígitos");
                }
                
                if (!cleaned.startsWith("3")) {
                  return Promise.reject("El número celular debe comenzar con 3");
                }
                
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => 
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 10)
          }
        >
          <Input 
            placeholder="3126734589" 
            maxLength={10}
            autoComplete="tel"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, "");
            }}
          />
        </Form.Item>

        <section className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 bg-blue-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Seguir comprando
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#E2060F] text-white py-2 px-4 rounded-lg hover:bg-[#001529] transition-colors"
          >
            Envío <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </section>
      </Form>

      {/* 🆕 Resumen del carrito para usuarios no autenticados */}
      {renderCartSummary()}
    </div>
  );
};

export default Contact;
