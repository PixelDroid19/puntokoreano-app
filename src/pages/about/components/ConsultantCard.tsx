// components/cards/ConsultantCard.tsx
import React, { useState, memo, useMemo } from 'react';
import ReactCardFlip from 'react-card-flip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import VirtualCard from "../../../components/cards/VirtualCard.component";
import DigitalCardDesktop from "../../../components/cards/DigitalCardDesktop";
import { PublicConsultant } from "@/types/about.types";

interface ConsultantCardProps {
  consultant: PublicConsultant;
  isDesktop: boolean;
}

// Componente FlipIndicator memoizado
const FlipIndicator = memo(() => (
  <div className="absolute top-4 right-4 bg-black/90 text-[#E2000E] p-2 
    rounded-full shadow-lg animate-pulse z-10 hover:scale-110 
    transition-transform duration-300">
    <FontAwesomeIcon icon={faRotate} className="text-xl" color='white' />
  </div>
));

FlipIndicator.displayName = "FlipIndicator";

// Componente CardContainer memoizado
const CardContainer = memo<{ 
  children: React.ReactNode; 
  isBack?: boolean; 
  onClick: () => void;
  cardBaseStyles: string;
}>(({ children, isBack, onClick, cardBaseStyles }) => (
  <div className={`${cardBaseStyles} ${isBack ? 'bg-white' : ''}`} onClick={onClick}>
    <FlipIndicator />
    <div className="w-full h-full bg-white rounded-xl overflow-hidden">{children}</div>
  </div>
));

CardContainer.displayName = "CardContainer";

// Componente principal memoizado
const ConsultantCard = memo<ConsultantCardProps>(({ consultant, isDesktop }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Memoizar el handler de click
  const handleClick = useMemo(() => () => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Memoizar los estilos base de la tarjeta
  const cardBaseStyles = useMemo(() => `
    relative w-[320px] h-[551px] border-4 border-[#5c4dce] p-1 
    rounded-2xl shadow-2xl mx-auto mb-10 cursor-pointer 
    transition-transform duration-300 hover:scale-[1.02]
    sm:w-[340px] md:w-[360px] lg:w-[320px] xl:w-[340px]
  `, []);

  // Memoizar la imagen del consultor para evitar flickering
  const consultantImage = useMemo(() => (
    <img
      src={consultant.image}
      alt={consultant.name}
      className="w-full h-full rounded-xl object-cover"
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.svg";
      }}
    />
  ), [consultant.image, consultant.name]);

  // Memoizar la información del consultor
  const consultantInfo = useMemo(() => (
    <section className="absolute bottom-0 left-0 text-white text-xl 
      bg-black/50 w-full rounded-b-xl px-6 py-3 backdrop-blur-sm">
      <h3 className="text-end font-semibold">{consultant.name}</h3>
      <p className="text-end">{consultant.position}</p>
    </section>
  ), [consultant.name, consultant.position]);

  // Memoizar el contenido del reverso de la tarjeta
  const backCardContent = useMemo(() => (
    isDesktop ? (
      <DigitalCardDesktop consultant={consultant} />
    ) : (
      <VirtualCard consultant={consultant} />
    )
  ), [isDesktop, consultant]);

  return (
    <div className="perspective-1000">
      <ReactCardFlip 
        isFlipped={isFlipped} 
        flipDirection="horizontal"
        containerClassName="w-full h-full"
      >
        {/* Front */}
        <CardContainer
          onClick={handleClick}
          cardBaseStyles={cardBaseStyles}
        >
          {consultantImage}
          {consultantInfo}
        </CardContainer>

        {/* Back */}
        <CardContainer 
          isBack={true}
          onClick={handleClick}
          cardBaseStyles={cardBaseStyles}
        >
          {backCardContent}
        </CardContainer>
      </ReactCardFlip>
    </div>
  );
});

ConsultantCard.displayName = "ConsultantCard";

export default ConsultantCard;