import { Button, Divider } from "antd";
import ssangyong from "../../../assets/SSangYong_blue.png";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

import "./styles.css";

const Sections = () => {
  const navigate = useNavigate();
  const isBigger = useMediaQuery({ query: "(min-width: 1535px)" });

  return (
    <div data-aos="fade-up" className={`container-sections relative z-10`}>
      <div className={`container-title`}>
        <div>
          <h2>Conoce nuestros espacios digitales</h2>
          <p>Cada vez un paso mas cerca de nuestros clientes</p>
        </div>
        <div className="flex flex-1 items-center justify-center lg:justify-end gap-4">
          <img
            src="https://puntokoreano.com/images/logos/kgm_mobility.png"
            alt=""
            width={160}
            className={`mr-4`}
          />
          <Divider
            type="vertical"
            className={`border-[#2F2482] border-2 h-16 -ml-4`}
          />
          <img src={ssangyong} alt="" width={120} className={``} />
        </div>
      </div>

      <div data-aos="fade-up" className={`container-main-sections`}>
        <div
          onClick={() => navigate("/store/search")}
          className={`flex flex-col-reverse gap-4  mt-8 md:-skew-x-12 md:flex-row lg:justify-between border-2 border-solid border-[#5c4dce] p-4 rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 cursor-pointer`}
        >
          <div className={`md:flex-1 flex flex-col justify-between`}>
            <h2
              className={`text-2xl tracking-wide text-center uppercase md:text-justify 2xl:text-3xl font-glegoo mt-3`}
            >
              Tienda Virtual
            </h2>
            <p
              className={`text-center md:text-justify md:w-80 lg:w-96 2xl:text-xl font-exo`}
            >
              {<b>Encuentra la pieza que necesitas aquí!</b>}
              <br />
              Contamos con una gran variedad de repuestos para tu vehículo a muy
              buenos precios entra aquí para conocer mas...
            </p>
            <Button
              danger
              size={isBigger ? "large" : "middle"}
              className={`rounded-full mx-auto block mt-4 w-fit uppercase md:mx-0 2xl:text-xl`}
            >
              {" "}
              Click here{" "}
            </Button>
          </div>
          <div
            className={`h-36 w-72 mx-auto md:mr-4 lg:w-[26rem] lg:h-60 lg:mr-8 xl:w-[34rem] 2xl:h-80 2xl:w-[40rem] 2xl:mr-12`}
          >
            <img
              src="https://puntokoreano.com/images/carrousel/KORANDO.jpg"
              alt=""
              className="brightness-[.4] w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          onClick={() => navigate("/about")}
          className={`flex flex-col-reverse gap-4 mt-8 md:-skew-x-12 md:flex-row lg:justify-between border-2 border-solid border-[#5c4dce] p-4 rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 cursor-pointer`}
        >
          <div className={`md:flex-1 flex flex-col justify-between`}>
            <h2
              className={`text-2xl tracking-wide text-center uppercase md:text-justify 2xl:text-3xl font-glegoo`}
            >
              ¿Quienes somos?
            </h2>
            <p
              className={`text-center md:text-justify md:w-80 lg:w-96 2xl:text-xl font-exo`}
            >
              {<b>Has parte de nuestra familia PUNTO KOREANO</b>}
              <br />
              Conócenos a través de nuestra historia y visita nuestra tienda
              física.
            </p>
            <Button
              onClick={() => navigate("/about")}
              danger
              size={isBigger ? "large" : "middle"}
              className={`rounded-full mx-auto block mt-4 uppercase w-fit md:mx-0 2xl:text-xl`}
            >
              {" "}
              Click here{" "}
            </Button>
          </div>
          <div
            className={`h-36 w-72 bg-gray-500 mx-auto md:mr-4 lg:w-[26rem] lg:h-60 lg:mr-8 xl:w-[34rem] 2xl:h-80 2xl:w-[40rem] 2xl:mr-12`}
          >
            <img
              src="https://puntokoreano.com/images/carrousel/REXTON.webp"
              alt=""
              className="brightness-[.4] w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          onClick={() => navigate("blog")}
          className={`flex flex-col-reverse gap-4 mt-8 md:-skew-x-12 md:flex-row border-2 border-solid border-[#5c4dce] p-4 rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 cursor-pointer`}
        >
          <div className={`md:flex-1 flex flex-col justify-between`}>
            <h2
              className={`text-2xl tracking-wide text-center uppercase md:text-justify 2xl:text-3xl font-glegoo`}
            >
              Blog Interactivo
            </h2>
            <p
              className={`text-center md:text-justify md:w-80 lg:w-96 2xl:text-xl font-exo`}
            >
              {
                <b>
                  Haste conocedor de los tips de cuidado mas importantes para tu
                  vehículo
                </b>
              }
            </p>
            <Button
              danger
              size={isBigger ? "large" : "middle"}
              className={`rounded-full mx-auto block mt-4 uppercase w-fit md:mx-0 2xl:text-xl`}
            >
              {" "}
              Click here{" "}
            </Button>
          </div>
          <div
            className={`h-36 w-72 bg-gray-500 mx-auto md:mr-4 lg:w-[26rem] lg:h-60 lg:mr-8 xl:w-[34rem] 2xl:h-80 2xl:w-[40rem] 2xl:mr-12`}
          >
            <img
              src="https://puntokoreano.com/images/carrousel/TORRES.jpg"
              alt=""
              className="brightness-[.4] w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sections;
