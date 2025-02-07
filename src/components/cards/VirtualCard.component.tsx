import { Consultant } from "@/types/about.types";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface VirtualCardProps {
  consultant: Consultant;
}

const VirtualCard = ({ consultant }: VirtualCardProps) => {
  // Function to format phone number for calls
  const formatPhoneForCall = (phone: string) => {
    return `tel:${phone.replace(/\D/g, "")}`;
  };

  // Function to format phone number for WhatsApp
  const formatWhatsAppLink = (phone: string) => {
    const whatsappNumber = consultant.whatsapp || phone;
    return `https://api.whatsapp.com/send/?phone=${whatsappNumber.replace(
      /\D/g,
      ""
    )}&text=Necesito+una+cotización`;
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        {/* Banner Image Section */}
        <div className="relative h-[40%] grayscale">
          <img
            className="w-full h-full object-cover rounded-t-xl brightness-50"
            src="https://puntokoreano.com/images/ssangyong-rexton-g4.webp"
            alt="banner"
          />
          {/* Company Logo - Optional */}
          {consultant.qrCode && (
            <img
              className="absolute top-4 left-4 w-16 h-auto"
              src="/logo_white.png"
              alt="Punto Koreano"
            />
          )}
        </div>

        {/* Consultant Information Section */}
        <div className="flex-1 bg-[#E8E6E7] rounded-b-xl relative flex flex-col">
          {/* Consultant Image */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <img
              className="w-32 h-32 rounded-full border-2 border-secondary_1 object-cover"
              src={consultant.image}
              alt={consultant.name}
            />
          </div>

          {/* Consultant Details */}
          <div className="mt-20 text-center px-4">
            <h3 className="text-xl font-bold border-b border-gray-500 pb-2 mb-2">
              {consultant.name}
            </h3>
            <p className="text-gray-500">
              {consultant.position} - Punto Koreano
            </p>

            {/* Additional Information */}
            {consultant.email && (
              <p className="text-gray-500 text-sm mt-2">{consultant.email}</p>
            )}
            {consultant.description && (
              <p className="text-gray-500 text-sm mt-2 italic">
                {consultant.description}
              </p>
            )}
          </div>

          {/* Contact Buttons */}
          <div className="mt-auto mb-6 flex justify-around">
            {/* Call Button */}
            <a
              href={formatPhoneForCall(consultant.phone)}
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
            >
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
            </a>

            {/* WhatsApp Button */}
            <a
              href={formatWhatsAppLink(consultant.phone)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
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
