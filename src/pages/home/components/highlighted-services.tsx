import React, { memo, useMemo } from "react";
import { Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Users, Calendar, MapPin, Clock } from "lucide-react";
import { useTermsStore } from "@/store/terms.store";

// Memoizar la función de mapeo de enlaces
const getLinkForService = (identifier: string): string => {
  switch (identifier) {
    case "service-1741337764259":
      return "/store?hasDiscount=true&discountType=temporary";
    case "service-1741337935851":
      return "/login";
    default:
      return "#";
  }
};

// Memoizar el mapeo de iconos
const iconMap = {
  users: <Users className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  "map-pin": <MapPin className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
} as const;

const getIconByName = (iconName: string | undefined): JSX.Element | null => {
  if (!iconName || !(iconName in iconMap)) return null;
  return iconMap[iconName as keyof typeof iconMap];
};

// Componente individual de servicio memoizado
const ServiceCard = memo(({
  service,
  index,
  onTermsClick,
}: {
  service: {
    _id: string;
    identifier: string;
    title: string;
    description: string;
    image: string;
    stats?: Array<{ icon?: string; value?: string; }>;
  };
  index: number;
  onTermsClick: (event: React.MouseEvent) => void;
}) => {
  const isTermsService = service.identifier === "service-1741338000661";

  // Memoizar el contenido interno de la tarjeta
  const cardContent = useMemo(() => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative group"
      data-aos="fade-up"
      data-aos-delay={index * 150}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h4 className="text-white text-xl font-bold font-glegoo text-center px-4">
            {service.title}
          </h4>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-600 mb-4 flex-grow">
          {service.description}
        </p>
        {service.stats && service.stats.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-gray-100">
            {service.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center text-gray-500 text-sm"
              >
                {getIconByName(stat.icon)}
                {stat.value && (
                  <span className="ml-2">{stat.value}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-[#E2060F] text-sm font-medium">
            <span className="mr-1">Ver más</span>
            <RightOutlined className="text-xs" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E2060F]/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
    </div>
  ), [service, index]);

  const tooltipTitle = isTermsService
    ? "Ver Términos y Condiciones"
    : "Haz clic para ver más detalles";

  return (
    <Tooltip
      title={tooltipTitle}
      placement="bottom"
      color="#333"
      mouseEnterDelay={0.5}
      overlayInnerStyle={{ fontSize: "12px" }}
    >
      {isTermsService ? (
        <div
          className="block group no-underline text-inherit cursor-pointer"
          onClick={onTermsClick}
        >
          {cardContent}
        </div>
      ) : (
        <Link
          to={getLinkForService(service.identifier)}
          className="block group no-underline text-inherit"
        >
          {cardContent}
        </Link>
      )}
    </Tooltip>
  );
});

ServiceCard.displayName = "ServiceCard";

// Componente principal memoizado
export const HighlightedServicesSection = memo(({
  highlightedServices,
}: {
  highlightedServices: Array<{
    _id: string;
    identifier: string;
    title: string;
    description: string;
    image: string;
    stats?: Array<{
      icon?: string;
      value?: string;
    }>;
  }>;
}) => {
  const { openTerms } = useTermsStore();

  // Memoizar el handler de términos
  const handleOpenTermsClick = useMemo(() => (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Opening terms modal");
    openTerms();
  }, [openTerms]);

  // Early return si no hay servicios
  if (highlightedServices.length === 0) {
    return null;
  }

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 font-glegoo mb-4">
        Espacios que te podrían interesar
      </h2>
      <div className="w-24 h-1 bg-[#E2060F] mx-auto mb-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlightedServices.map((service, index) => (
          <ServiceCard
            key={service._id || service.identifier}
            service={service}
            index={index}
            onTermsClick={handleOpenTermsClick}
          />
        ))}
      </div>
    </div>
  );
});

HighlightedServicesSection.displayName = "HighlightedServicesSection";

export default HighlightedServicesSection;
