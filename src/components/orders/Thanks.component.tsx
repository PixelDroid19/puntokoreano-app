import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailBuy from "./components/DetailBuy.component";
import { useNavigate } from "react-router-dom";
import { notification, Spin } from "antd";
import ENDPOINTS from "@/api";
import { useCheckoutStore } from "@/store/checkout.store";
import { useEffect, useState } from "react";
import axios from "axios";

const ThanksOrder = () => {
  const navigate = useNavigate();
  const { orderId, orderStatus } = useCheckoutStore();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        navigate("/store");
        return;
      }

      try {
        const { data } = await axios.get(
          ENDPOINTS.ORDERS.GET_ORDER.url.replace(":id", orderId)
        );
        setOrderDetails(data.data);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "No se pudo obtener el detalle de la orden",
        });
      }
    };

    checkPaymentStatus();
  }, [orderId, navigate]);

  return (
    <div className="mx-5 my-5 lg:mx-[50px] lg:flex lg:flex-col lg:justify-center lg:gap-2">
      {orderDetails ? (
        <>
          <img
            className="block mx-auto"
            src="https://puntokoreano.com/images/box_success.png"
            alt="box"
          />
          <h1 className="font-bold text-2xl text-center">
            Gracias por tu compra
          </h1>
          <p className="text-center text-gray-400 text-base">
            Pedido #{orderDetails.order_number}
          </p>
          <DetailBuy orderDetails={orderDetails} />

          <button
            onClick={() => navigate("/store")}
            className="bg-[#E2060F] text-base text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto mt-10 hover:bg-[#001529] transition-all duration-300"
          >
            Seguir Comprando
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </>
      ) : (
        <Spin size="large" tip="Cargando detalles del pedido..." />
      )}
    </div>
  );
};

export default ThanksOrder;
