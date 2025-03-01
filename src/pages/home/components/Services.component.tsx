import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

const Services = () => {
  const services = [
    {
      label: "Múltiples medios de pago",
      icon: "https://puntokoreano.com/images/icons/billetera.png",
      images: [
        "https://puntokoreano.com/images/others/american-express.png",
        "https://puntokoreano.com/images/others/master-card.png",
        "https://puntokoreano.com/images/others/visa.png",
        "https://puntokoreano.com/images/others/paypal.png",
      ],
    },
    {
      label: "Despachos a nivel nacional y rastreo de pedidos",
      icon: "https://puntokoreano.com/images/icons/delivery.png",
      images: [
        "https://puntokoreano.com/images/others/servientrega.png",
        "https://puntokoreano.com/images/others/rapidisimo.png",
        "https://puntokoreano.com/images/others/deprisa.png",
        "https://puntokoreano.com/images/others/envia.png",
      ],
      urls: [
        "https://www.servientrega.com/wps/portal/rastreo-envio",
        "https://rapidisimo.co",
        "https://www.deprisa.com/",
        "https://www.envia.co/rastrear-guia/",
      ],
    },
    {
      label: "Encuentranos en redes sociales",
      icon: "https://puntokoreano.com/images/icons/connection.png",
      images: [
        "https://puntokoreano.com/images/others/insta.png",
        "https://puntokoreano.com/images/others/face.png",
        "https://puntokoreano.com/images/others/wss.png",
      ],
      urls: [
        "https://www.instagram.com/puntokoreano_co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        "https://www.facebook.com/profile.php?id=100063998981869",
        "https://api.whatsapp.com/send?phone=%2B573214994559",
      ],
    },
    {
      label: "Dónde estamos ubicados",
      icon: "https://puntokoreano.com/images/icons/pin.png",
      images: [
        "https://puntokoreano.com/images/others/maps.png",
        "https://puntokoreano.com/images/others/waze.png",
      ],
      urls: [
        "https://maps.app.goo.gl/E8ZkPMiCA4vo4t3V9",
        "https://www.waze.com/en/live-map/directions/punto-koreano-calle-63f-25-15-bogota?place=w.187367471.1873871314.5569304",
      ],
    },
  ];

  return (
    <div className="container-services">
      <div className="container-service">
        {services.map((service, idx) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isOpen, setIsOpen] = useState<boolean>(false);

          return (
            <figure
              key={`${idx}-service`}
              onClick={() => setIsOpen(!isOpen)}
              onMouseLeave={() => setIsOpen(false)}
              className={`service cursor-pointer hover:-translate-y-4 ${
                isOpen && "bg-white rounded-2xl pb-6 absolute z-20 left-0 top-0"
              }`}
            >
              <img className="img" src={service.icon} alt={service.label} />
              <figcaption>{service.label}</figcaption>
              <FontAwesomeIcon icon={faChevronDown} className="text-xl" />
              <div
                className={`transition-all duration-500 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                {service.images.map((image, idx) => (
                  <a href={service?.urls?.[idx]} target="_blank">
                    <img
                      key={`${idx}-{brands}`}
                      src={image}
                      className="mb-2 w-28 mx-auto"
                    />
                  </a>
                ))}
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
};
export default Services;
