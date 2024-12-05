import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, InputNumber, Select } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface FormData {
  shippingMethod: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const Shipping: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const { Option } = Select;

  const onFinish = (values: FormData) => {
    // Guardar datos de envío
    localStorage.setItem("checkoutShipping", JSON.stringify(values));
    setCurrent(2);
  };

  const onFinishFailed = () => {
    setStatus("error");
  };

  const handleBack = () => {
    setCurrent(0);
  };

  // Recuperar datos guardados si existen
  const savedData = localStorage.getItem("checkoutShipping");
  const initialValues = savedData ? JSON.parse(savedData) : undefined;

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      className="border rounded-lg p-4 mt-5 bg-white"
      initialValues={initialValues}
    >
      <h1 className="text-xl text-center font-bold">Datos de envío</h1>

      <Form.Item
        name="shippingMethod"
        extra="Puede afectar el costo total de su pedido"
        label="Tipo de envío"
        hasFeedback
        validateDebounce={1000}
        rules={[{ required: true, message: "Selecciona un método de envío" }]}
      >
        <Select>
          <Option value="express">Envío exprés</Option>
          <Option value="standard">Envío estándar</Option>
          <Option value="pickup">Recogida en tienda</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="address"
        label="Dirección"
        hasFeedback
        validateDebounce={1000}
        rules={[{ required: true, message: "La dirección es requerida" }]}
      >
        <Input placeholder="DG 1 BIS #23-56 sur torre 1 apto 506" />
      </Form.Item>

      <Form.Item
        name="city"
        label="Ciudad"
        hasFeedback
        validateDebounce={1000}
        rules={[{ required: true, message: "La ciudad es requerida" }]}
      >
        <Input placeholder="Bogotá" />
      </Form.Item>

      <Form.Item
        name="country"
        label="País"
        hasFeedback
        validateDebounce={1000}
        rules={[{ required: true, message: "El país es requerido" }]}
      >
        <Select>
          <Option value="colombia">Colombia</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Código Postal"
        hasFeedback
        validateDebounce={1000}
        rules={[{ required: true, message: "El código postal es requerido" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <section className="flex gap-x-5 items-center flex-wrap">
        <button
          type="button"
          onClick={() => navigate("/store")}
          className="flex items-center gap-2 bg-blue-700 text-white font-medium py-1 px-2 rounded-lg text-base"
        >
          Seguir comprando
        </button>

        <div className="flex gap-x-5 items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 bg-[#E2060F] text-white py-1 px-2 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Contacto
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#E2060F] text-white py-1 px-2 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
          >
            Facturación <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </section>
    </Form>
  );
};

export default Shipping;
