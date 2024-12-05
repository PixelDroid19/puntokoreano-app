import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import VirtualCard from "../../../components/cards/VirtualCard.component";
import DigitalCardDesktop from "../../../components/cards/DigitalCardDesktop";

interface ConsultantCardProps {
  asesor: {
    name: string;
    image: string;
    position: string;
  };
  isDesktop: boolean;
}

const ConsultantCard = ({ asesor, isDesktop }: ConsultantCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Estilos base compartidos para mantener dimensiones consistentes
  const cardBaseStyles = `
    relative w-[320px] h-[551px] border-4 border-[#5c4dce] p-1 
    rounded-2xl shadow-2xl mx-auto mb-10 cursor-pointer 
    transition-transform duration-300 hover:scale-[1.02]
    sm:w-[340px] md:w-[360px] lg:w-[320px] xl:w-[340px]
  `;

  const FlipIndicator = () => (
    <div className="absolute top-4 right-4 bg-white/90 text-[#E2000E] p-2 
      rounded-full shadow-lg animate-pulse z-10 hover:scale-110 
      transition-transform duration-300">
      <FontAwesomeIcon icon={faRotate} className="text-xl" />
    </div>
  );

  // Contenedor fijo para el contenido de la tarjeta
  const CardContainer = ({ children }: { children: React.ReactNode }) => (
    <div className={cardBaseStyles} onClick={handleClick}>
      <FlipIndicator />
      <div className="w-full h-full">{children}</div>
    </div>
  );

  return (
    <div className="perspective-1000">
      <ReactCardFlip 
        isFlipped={isFlipped} 
        flipDirection="horizontal"
        containerClassName="w-full h-full"
      >
        {/* Frente de la tarjeta */}
        <CardContainer>
          <img
            src={asesor.image}
            alt={asesor.name}
            className="w-full h-full rounded-xl object-cover"
          />
          <section className="absolute bottom-0 left-0 text-white text-xl 
            bg-black/50 w-full rounded-b-xl px-6 py-3 backdrop-blur-sm">
            <h3 className="text-end font-semibold">{asesor.name}</h3>
            <p className="text-end">{asesor.position}</p>
          </section>
        </CardContainer>

        {/* Reverso de la tarjeta */}
        <CardContainer>
          <div className="w-full h-full">
            {isDesktop ? (
              <DigitalCardDesktop asesor={asesor} />
            ) : (
              <VirtualCard asesor={asesor} />
            )}
          </div>
        </CardContainer>
      </ReactCardFlip>
    </div>
  );
};

export default ConsultantCard;