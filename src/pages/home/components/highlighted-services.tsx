import { Tooltip } from "antd"
import { RightOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { Users, Calendar, MapPin, Clock } from "lucide-react"

// Función para determinar el enlace
const getLinkForService = (identifier: string): string => {
  switch (identifier) {
    case "service-1741337764259": // Descuentos de temporada
      return "/store?hasDiscount=true&discountType=temporary"
    case "service-1741337935851": // Comunidad PUNTO KOREANO -> Login/Registro
      return "/login"
    case "service-1741338000661": // Políticas, Términos y Condiciones
      return "/about"
    default:
      return "#" // Enlace seguro por defecto
  }
}

// Función para obtener el icono por nombre
const getIconByName = (iconName: string | undefined): JSX.Element | null => {
  if (!iconName) return null

  switch (iconName) {
    case "users":
      return <Users className="h-4 w-4" />
    case "calendar":
      return <Calendar className="h-4 w-4" />
    case "map-pin":
      return <MapPin className="h-4 w-4" />
    case "clock":
      return <Clock className="h-4 w-4" />
    default:
      return null
  }
}

// Componente para la sección de servicios destacados
export const HighlightedServicesSection = ({
  highlightedServices,
}: {
  highlightedServices: Array<{
    _id: string
    identifier: string
    title: string
    description: string
    image: string
    stats?: Array<{
      icon?: string
      value?: string
    }>
  }>
}) => {
  if (highlightedServices.length === 0) {
    return null
  }

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 font-glegoo mb-4">Espacios que te podrían interesar</h2>
      <div className="w-24 h-1 bg-[#E2060F] mx-auto mb-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlightedServices.map((service, index) => (
          <Tooltip
            key={service._id || service.identifier}
            title="Haz clic para ver más detalles"
            placement="bottom"
            color="#333"
            mouseEnterDelay={0.5}
            overlayInnerStyle={{ fontSize: "12px" }}
          >
            <Link to={getLinkForService(service.identifier)} className="block group no-underline text-inherit">
              <div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative"
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
                    <h4 className="text-white text-xl font-bold font-glegoo text-center px-4">{service.title}</h4>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                  {/* Renderizar stats si existen */}
                  {service.stats && service.stats.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-gray-100">
                      {service.stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center text-gray-500 text-sm">
                          {getIconByName(stat.icon)}
                          {stat.value && <span className="ml-2">{stat.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Indicador de redirección no intrusivo */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-[#E2060F] text-sm font-medium">
                      <span className="mr-1">Ver más</span>
                      <RightOutlined className="text-xs" />
                    </div>
                  </div>
                </div>

                {/* Borde sutil que aparece en hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E2060F]/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default HighlightedServicesSection

