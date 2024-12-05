import {
  faCreditCard,
  faFileInvoice,
  faMapLocation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StepProps, Steps, StepsProps, notification } from "antd";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import Contact from "./Contact.component";
import Shipping from "./Shipping.component";
import Orders from "./Order.component";
import Billing from "./Billing.component";
import { useCartStore } from "@/store/cart.store";

const Checkout = () => {
  const navigate = useNavigate();
  const is576 = useMediaQuery({ query: "(min-width: 576px)" });
  const [current, setCurrent] = useState<number>(0);
  const [status, setStatus] = useState<StepsProps["status"]>("process");

  // Obtener items del carrito
  const { items } = useCartStore();

  // Validar que haya items en el carrito
  useEffect(() => {
    if (items.length === 0) {
      notification.warning({
        message: "Carrito vacío",
        description: "No hay productos en el carrito para proceder al pago",
      });
      navigate("/store");
    }
  }, [items, navigate]);

  const steps: StepProps[] = [
    {
      title: "Contacto",
      icon: <FontAwesomeIcon icon={faUser} className="text-base xl:text-xl" />,
      style: { width: 70 },
    },
    {
      title: "Envío",
      icon: (
        <FontAwesomeIcon
          icon={faMapLocation}
          className="text-base xl:text-xl"
        />
      ),
      style: { width: 70 },
    },
    {
      title: "Facturación",
      icon: (
        <FontAwesomeIcon
          icon={faFileInvoice}
          className="text-base xl:text-xl"
        />
      ),
      style: { width: 70 },
    },
    {
      title: "Pago",
      icon: (
        <FontAwesomeIcon icon={faCreditCard} className="text-base xl:text-xl" />
      ),
    },
  ];

  // Restablecer el estado del proceso cuando cambia el paso actual
  useEffect(() => {
    setStatus("process");
  }, [current]);

  // Persistir los datos del checkout entre pasos
  const saveCheckoutData = (step: string, data: any) => {
    localStorage.setItem(`checkout_${step}`, JSON.stringify(data));
  };

  // Obtener datos guardados de un paso específico
  const getCheckoutData = (step: string) => {
    const data = localStorage.getItem(`checkout_${step}`);
    return data ? JSON.parse(data) : null;
  };

  // Limpiar datos al completar o cancelar
  const clearCheckoutData = () => {
    localStorage.removeItem("checkout_contact");
    localStorage.removeItem("checkout_shipping");
    localStorage.removeItem("checkout_billing");
  };

  return (
    <section className="m-5 lg:mx-auto lg:flex lg:gap-4 xl:max-w-[1250px]">
      <div className="lg:w-3/5">
        <div className="flex sm:justify-center lg:max-w-[550px] xl:max-w-full">
          <Steps
            progressDot={!is576}
            style={is576 ? {} : { display: "flex", flexDirection: "row" }}
            status={status}
            current={current}
            items={steps}
            type={is576 ? "navigation" : "default"}
            size="small"
            responsive={false}
            direction="horizontal"
          />
        </div>
        {current === 0 && (
          <Contact
            setStatus={setStatus}
            setCurrent={setCurrent}
            initialData={getCheckoutData("contact")}
            onSave={(data) => saveCheckoutData("contact", data)}
          />
        )}
        {current === 1 && (
          <Shipping
            setStatus={setStatus}
            setCurrent={setCurrent}
            initialData={getCheckoutData("shipping")}
            onSave={(data) => saveCheckoutData("shipping", data)}
          />
        )}
        {current === 2 && (
          <Billing
            setStatus={setStatus}
            setCurrent={setCurrent}
            initialData={getCheckoutData("billing")}
            onSave={(data) => saveCheckoutData("billing", data)}
            onComplete={clearCheckoutData}
          />
        )}
      </div>
      <Orders />
    </section>
  );
};

export default Checkout;
