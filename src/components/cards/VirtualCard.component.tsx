import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  asesor: {
    name: string;
    image: string;
    position: string;
  };
}

const VirtualCard = ({ asesor }: Props) => {
  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <div className="relative h-[40%] grayscale">
          <img
            className="w-full h-full object-cover rounded-t-xl brightness-50"
            src="https://puntokoreano.com/images/ssangyong-rexton-g4.webp"
            alt="banner"
          />
        </div>

        <div className="flex-1 bg-[#E8E6E7] rounded-b-xl relative flex flex-col">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <img
              className="w-32 h-32 rounded-full border-2 border-secondary_1 object-cover"
              src={asesor.image}
              alt={asesor.name}
            />
          </div>

          <div className="mt-20 text-center px-4">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-2">
              {asesor.name}
            </h3>
            <p className="text-gray-500">{asesor.position} - Punto Koreano</p>
          </div>

          <div className="mt-auto mb-6 flex justify-around">
            <div>
              <div
                className="bg-[#E2060F] p-3 rounded-full hover:bg-[#001529] 
                transition-colors"
              >
                <FontAwesomeIcon
                  size="2x"
                  className="text-white"
                  icon={faMobile}
                />
              </div>
              <p className="text-gray-500 text-center mt-2 font-bold">Llamar</p>
            </div>

            <a
              href="https://api.whatsapp.com/send/?phone=573223650548&text=Necesito+una+cotización"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-[#E2060F] p-3 rounded-full hover:bg-[#001529] 
                transition-colors"
              >
                <FontAwesomeIcon
                  size="2x"
                  className="text-white"
                  icon={faWhatsapp}
                />
              </div>
              <p className="text-gray-500 text-center mt-2 font-bold">
                Escribir
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
