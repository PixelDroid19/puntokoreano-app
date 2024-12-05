import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailBuy from "./components/DetailBuy.component";
import { useNavigate } from "react-router-dom";

const ThanksOrder = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-5 my-5 lg:mx-[50px] lg:flex lg:flex-col lg:justify-center lg:gap-2">
            <img className="block mx-auto" src="https://puntokoreano.com/images/box_success.png" alt="box" />
            <h1 className="font-bold text-2xl text-center">Gracias por tu compra</h1>
            <p className="text-center text-gray-400 text-base">
                Su pedido se ha realizado correctamente y está siendo procesado
            </p>

            <DetailBuy />

            <button
            onClick={() => navigate('/store')}
            className="bg-[#E2060F] text-base text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto mt-10 hover:bg-[#001529] transition-all duration-300">
                Seguir Comprando
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    )
};
export default ThanksOrder;