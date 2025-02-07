import { useCheckoutStore } from "@/store/checkout.store";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface BillingFormData {
  person: "natural" | "juridica";
  nit?: string;
  registerdName?: string;
  email: string;
  name?: string;
  lastName?: string;
}

const { Option } = Select;

const Billing: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const { setShippingInfo, shippingInfo } = useCheckoutStore();
  const [form] = Form.useForm<BillingFormData>();

  // Recuperar datos guardados si existen
  const savedData = localStorage.getItem("checkoutBilling");
  const initialValues = savedData ? JSON.parse(savedData) : undefined;

  const onFinish = (values: BillingFormData) => {
    // Guardar datos en localStorage
    localStorage.setItem("checkoutBilling", JSON.stringify(values));

    // Actualizar el store
    setShippingInfo({
      ...shippingInfo,
      billing: values,
      type: "billing",
    });

    setCurrent(3);
  };

  const onFinishFailed = () => {
    setStatus("error");
  };

  const handleBack = () => {
    // Guardar datos actuales antes de retroceder
    const currentValues = form.getFieldsValue();
    localStorage.setItem("checkoutBilling", JSON.stringify(currentValues));
    setCurrent(1);
  };

  // Manejar cambio de tipo de persona
  const handlePersonChange = (value: BillingFormData["person"]) => {
    // Limpiar campos específicos cuando cambia el tipo de persona
    if (value === "natural") {
      form.setFieldsValue({
        nit: undefined,
        registerdName: undefined,
      });
    } else {
      form.setFieldsValue({
        name: undefined,
        lastName: undefined,
      });
    }
  };

  return (
    <Form<BillingFormData>
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      className="border rounded-lg p-4 mt-5 bg-white"
      initialValues={initialValues}
    >
      <h1 className="text-xl text-center font-bold">Facturación</h1>

      <Form.Item
        name="person"
        label="Tipo de persona"
        rules={[{ required: true, message: "Selecciona el tipo de persona" }]}
      >
        <Select onChange={handlePersonChange}>
          <Option value="natural">Persona Natural</Option>
          <Option value="juridica">Persona Jurídica</Option>
        </Select>
      </Form.Item>

      <Form.Item noStyle dependencies={["person"]}>
        {({ getFieldValue }) => {
          const personType = getFieldValue("person");

          if (personType === "juridica") {
            return (
              <>
                <Form.Item
                  name="registerdName"
                  label="Razón Social"
                  hasFeedback
                  validateDebounce={1000}
                  rules={[
                    {
                      required: true,
                      min: 2,
                      message:
                        "La Razón Social debe tener al menos 2 caracteres",
                    },
                  ]}
                >
                  <Input placeholder="Nombre de la empresa" />
                </Form.Item>
                <Form.Item
                  name="nit"
                  label="Número de Identificación Tributaria (NIT)"
                  hasFeedback
                  validateDebounce={1000}
                  rules={[
                    { required: true, message: "El NIT es requerido" },
                    {
                      pattern: /^[0-9-]+$/,
                      message: "NIT inválido",
                    },
                  ]}
                >
                  <Input placeholder="900.123.456-7" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  hasFeedback
                  validateDebounce={1000}
                  rules={[
                    {
                      required: true,
                      message: "El correo electrónico es requerido",
                    },
                    {
                      type: "email",
                      message: "Ingresa un correo electrónico válido",
                    },
                  ]}
                >
                  <Input placeholder="empresa@ejemplo.com" />
                </Form.Item>
              </>
            );
          }

          if (personType === "natural") {
            return (
              <>
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
                    {
                      required: true,
                      message: "El correo electrónico es requerido",
                    },
                    {
                      type: "email",
                      message: "Ingresa un correo electrónico válido",
                    },
                  ]}
                >
                  <Input placeholder="joedoe@gmail.com" />
                </Form.Item>
              </>
            );
          }

          return null;
        }}
      </Form.Item>

      <div className="flex gap-x-5 items-center flex-wrap">
        <button
          onClick={() => navigate("/store")}
          type="button"
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
            <FontAwesomeIcon icon={faArrowLeft} /> Envío
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#E2060F] text-white py-1 px-2 rounded-lg text-base hover:bg-[#001529] transition-all duration-300"
          >
            Pago <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </Form>
  );
};

export default Billing;
