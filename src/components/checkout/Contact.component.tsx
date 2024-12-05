import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface FormData {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

const Contact: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();

  const onFinish = (values: FormData) => {
    // Guardar datos del contacto
    localStorage.setItem("checkoutContact", JSON.stringify(values));
    setCurrent(1);
  };

  const onFinishFailed = () => {
    setStatus("error");
  };

  // Recuperar datos guardados si existen
  const savedData = localStorage.getItem("checkoutContact");
  const initialValues = savedData ? JSON.parse(savedData) : undefined;

  return (
    <Form
      name="contact_form"
      className="border rounded-lg p-4 mt-5 bg-white"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      initialValues={initialValues}
    >
      <h1 className="text-xl text-center font-bold">Información de contacto</h1>
      <p className="text-center">
        ¿Ya tienes cuenta?
        <span
          className="text-[#E2060F] cursor-pointer ml-2"
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
        label="Número celular (opcional)"
        hasFeedback
        validateDebounce={1000}
        rules={[
          {
            min: 7,
            message: "El número celular debe tener al menos 7 caracteres",
          },
        ]}
      >
        <Input type="number" placeholder="3126734589" />
      </Form.Item>

      <section className="flex gap-5">
        <button
          type="button"
          onClick={() => navigate("/store")}
          className="flex items-center gap-2 bg-blue-700 text-white font-medium py-1 px-2 rounded-lg text-base"
        >
          Seguir comprando
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 bg-[#E2060F] text-white py-1 px-2 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
        >
          Envío <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </section>
    </Form>
  );
};

export default Contact;
