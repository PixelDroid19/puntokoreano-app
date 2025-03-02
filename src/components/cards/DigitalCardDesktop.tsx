import { Consultant } from "@/types/about.types";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "antd";

interface DigitalCardDesktopProps {
  consultant: Consultant;
}

const DigitalCardDesktop = ({ consultant }: DigitalCardDesktopProps) => {
  return (
    <section className="max-w-sm mx-auto">
      {/* max-w-sm limits the card width */}
      <figcaption className="w-full h-40 relative">
        <img
          className="absolute h-40 w-full object-cover grayscale rounded-2xl"
          src={consultant.headerImage}
          alt={consultant.name}
        />
        <img
          className="relative w-20"
          src="https://puntokoreano.com/images/logos/logo_1.png"
          alt="Punto Koreano Logo"
        />
      </figcaption>

      <div className="relative bg-cardInfo rounded-2xl px-4 pt-4 pb-2 mt-2"> {/* Reduced padding */}
        <figure className="w-28 h-28 sm:w-36 sm:h-36 absolute -top-12 sm:-top-16 right-1">
          {/* Further reduced sizes */}
          <img
            className="w-full h-full object-cover object-top rounded-full border-2 border-solid border-secondary_1"
            src={consultant.image}
            alt={consultant.name}
          />
        </figure>

        <article>
          <h2 className="text-xl my-1">Tarjeta Virtual</h2>
          <p className="text-base font-bold my-1">{consultant.name}</p>
          <h3 className="text-xl my-1">{consultant.position}</h3>
          <p className="text-base font-bold my-1">Punto Koreano, Inc</p>
          {consultant.phone && (
            <p className="text-sm my-1">Tel: {consultant.phone}</p>
          )}
          {consultant.email && (
            <p className="text-sm my-1">Email: {consultant.email}</p>
          )}
        </article>
      </div>

      {consultant.qrCode && (
        <section className="flex justify-center my-3">
          <Image
            src={consultant.qrCode}
            width={90} 
            preview={false}
            alt="QR Code"
            className="max-w-[120px] w-full"
          />
        </section>
      )}

      <a
        href={`https://api.whatsapp.com/send/?phone=${consultant.whatsapp || consultant.phone
          }&text=Necesito+una+cotización`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
          <button
          className="flex gap-2 border-none bg-[#25D366] text-black
            items-center px-2 py-3 rounded-3xl mx-auto my-2 max-w-72
            w-full justify-center text-lg"
        >
          <FontAwesomeIcon icon={faMobileScreen} />
          Escanea y hablemos
        </button>
      </a>
    </section>
  );
};
export default DigitalCardDesktop;