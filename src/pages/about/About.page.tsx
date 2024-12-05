import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import VirtualCard from "@/components/cards/VirtualCard.component";
import { useMediaQuery } from "react-responsive";
import DigitalCardDesktop from "@/components/cards/DigitalCardDesktop";
import { Parallax } from "react-parallax";
import ConsultantCard from "./components/ConsultantCard.jsx";
const About = () => {
  // const { isError, data } = useQuery({
  //     queryKey: ['consultants'],
  //     queryFn: async() => {
  //         return await axios.get(`${import.meta.env.VITE_API_REST_URL}/api/consultants`);
  //     }
  // });

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const consultants = [
    {
      name: "Henderson Prieto",
      position: "Asesor",
      image: "https://puntokoreano.com/images/asesores/henderson.jpg",
    },
    {
      name: "Marco Rodriguez",
      position: "Asesor",
      image: "https://puntokoreano.com/images/asesores/marco.jpg",
    },
    {
      name: "Camilo Prieto",
      position: "Asesor",
      image: "https://puntokoreano.com/images/asesores/camilo.jpg",
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-secondary_1 to-secondary_2 max-w-[1320px] mx-5 lg:mx-auto">
        <h2 className="text-2xl text-center text-white font-bold py-4 uppercase lg:text-4xl font-glegoo">
          ¿Quienes somos?
        </h2>
      </div>
      <div className="relative h-fit lg:h-max">
        <Parallax
          bgImage="https://puntokoreano.com/images/carrousel/TIVOLI.jpg"
          strength={500}
          bgImageStyle={{ objectFit: "cover" }}
        >
          <div className="flex flex-col items-center justify-center px-10 max-w-[1320px] mx-auto my-5 h-full lg:h-[500px] relative z-20">
            <h1 className="text-3xl text-white font-medium font-glegoo">
              Objeto Social
            </h1>
            <p className="text-xl text-white mt-10 text-center lg:max-w-3xl">
              Ofrecer a nuestros clientes un entorno confiable para la
              adquisición de autopartes Ssangyong transformando el concepto
              “tradicional” de compra y venta en una experiencia de atención
              cordial, amable, honesta y personalizada, proporcionada por parte
              de nuestro personal, suministrando a su vez información técnica y
              objetiva para el pronto hallazgo de la solución a las posibles
              dificultades mecánicas presentes en los vehículos y de esta manera
              garantizar ventas 100% justificadas.
            </p>
          </div>
        </Parallax>
        <div className="absolute top-0 left-0 w-full h-full bg-[#0000008a] z-10"></div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5">
        <div className="bg-gradient-to-r from-secondary_1 to-secondary_2 max-w-[1280px] mx-auto">
          <h2 className="text-2xl text-center text-white font-bold py-4 uppercase lg:text-4xl font-glegoo my-5">
            Nuestros asesores
          </h2>
        </div>
        <div
          data-aos="fade-up"
          className="lg:flex lg:flex-wrap lg:justify-around"
        >
          {consultants.map((asesor, idx) => (
            <ConsultantCard
              key={`${idx}-${asesor.name}`}
              asesor={asesor}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>

      <div
        data-aos="fade-up"
        className="max-w-[1320px] mx-auto px-5 lg:px-10 mb-20"
      >
        <div className="bg-gradient-to-r from-secondary_1 to-secondary_2 max-w-[1280px] mx-auto">
          <h2 className="text-2xl text-center text-white font-bold py-4 uppercase lg:text-4xl font-glegoo my-5">
            Donde nos ubicamos
          </h2>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d591.1331551163539!2d-74.07226717546645!3d4.655642602154403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a4dea43cd65%3A0x8c8013ea1b146459!2sPUNTO%20KOREANO%20S.A.S!5e0!3m2!1ses-419!2sco!4v1720207300180!5m2!1ses-419!2sco"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
export default About;
