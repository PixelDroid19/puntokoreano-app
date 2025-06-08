import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { notification } from "antd";
import { useAuthStore } from "@/store/auth.store";

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

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Prellenar y guardar datos del usuario autenticado
        const userData = {
          name: user.name,
          lastName: user.lastName,
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

  // Vista para usuarios autenticados
  if (isAuthenticated && user) {
    return (
      <div className="border rounded-lg p-4 mt-5 bg-white">
        <h1 className="text-xl text-center font-bold mb-4">
          Información de contacto
        </h1>
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-lg">Comprando como:</p>
            <p className="text-gray-700">
              {user.name} {user.lastName}
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
    );
  }

  // Formulario para usuarios no autenticados
  return (
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
          {
            required: true,
            min: 2,
            message: "El nombre debe tener al menos 2 caracteres",
          },
        ]}
      >
        <Input placeholder="Joe" />
      </Form.Item>

      <Form.Item
        label="Apellido"
        name="lastName"
        hasFeedback
        validateDebounce={1000}
        rules={[
          {
            required: true,
            min: 2,
            message: "El apellido debe tener al menos 2 caracteres",
          },
        ]}
      >
        <Input placeholder="Doe" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Correo Electrónico"
        hasFeedback
        validateDebounce={1000}
        rules={[
          { required: true, message: "El correo electrónico es requerido" },
          { type: "email", message: "Ingresa un correo electrónico válido" },
        ]}
      >
        <Input placeholder="joedoe@gmail.com" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Número celular"
        hasFeedback
        validateDebounce={1000}
        rules={[
          { required: true, message: "El número celular es requerido" },
          {
            pattern: /^[0-9]{10}$/,
            message: "Ingrese un número válido de 10 dígitos",
          },
        ]}
      >
        <Input type="number" placeholder="3126734589" maxLength={10} />
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
  );
};

export default Contact;
