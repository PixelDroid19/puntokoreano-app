// src/components/checkout/Billing.component.tsx
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setStatus: React.Dispatch<
    React.SetStateAction<"wait" | "process" | "finish" | "error" | undefined>
  >;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface FormData {
  person: string;
  nit?: string;
  registerdName?: string;
  email?: string;
  name?: string;
  lastName?: string;
}

const Billing: React.FC<Props> = ({ setStatus, setCurrent }) => {
  const navigate = useNavigate();
  const { Option } = Select;
  const [person, setPerson] = useState<string | undefined>();

  // Recuperar datos guardados si existen
  const savedData = localStorage.getItem("checkoutBilling");
  const initialValues = savedData ? JSON.parse(savedData) : undefined;

  // Si hay datos guardados, establecer el tipo de persona
  useEffect(() => {
    if (initialValues?.person) {
      setPerson(initialValues.person);
    }
  }, [initialValues?.person]);

  const onFinish = (values: FormData) => {
    // Guardar datos de facturación
    localStorage.setItem("checkoutBilling", JSON.stringify(values));
    navigate("/store/finish-order");
  };

  const onFinishFailed = () => {
    setStatus("error");
  };

  const handleBack = () => {
    setCurrent(1);
  };

  const handleChangePerson = (value: string) => {
    setPerson(value);
  };

  return (
    <Form
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
        <Select onChange={handleChangePerson}>
          <Option value="natural">Persona Natural</Option>
          <Option value="juridica">Persona Jurídica</Option>
        </Select>
      </Form.Item>

      {person === "juridica" && (
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
                message: "La Razón Social debe tener al menos 2 caracteres",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nit"
            label="Número de Identificación Tributaria (NIT)"
            hasFeedback
            validateDebounce={1000}
            rules={[{ required: true, message: "El NIT es requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Correo electrónico"
            hasFeedback
            validateDebounce={1000}
            rules={[
              { required: true, message: "El correo electrónico es requerido" },
              {
                type: "email",
                message: "Ingresa un correo electrónico válido",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </>
      )}

      {person === "natural" && (
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
              { required: true, message: "El correo electrónico es requerido" },
              {
                type: "email",
                message: "Ingresa un correo electrónico válido",
              },
            ]}
          >
            <Input placeholder="joedoe@gmail.com" />
          </Form.Item>
        </>
      )}

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
