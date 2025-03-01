// Sections.tsx
import { useRef } from "react";
import { Carousel, Badge, Statistic } from "antd";
import { 
  Award,
  PenTool, 
  ShieldCheck,
  Clock,
  Users,
  Building,
  MapPin,
  Star
} from "lucide-react";
import './styles/Sections.component.css'
interface Achievement {
  icon: JSX.Element;
  value: string;
  title: string;
  color: string;
}

const Sections = () => {
  const carouselRef = useRef<typeof Carousel>(null);

  // Datos de logros y estadísticas
  const achievements: Achievement[] = [
    {
      icon: <Award className="w-8 h-8" />,
      value: "20+",
      title: "Años de Experiencia",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "10,000+",
      title: "Clientes Satisfechos",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      value: "5,000+",
      title: "Repuestos Disponibles",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      value: "100%",
      title: "Garantía de Calidad",
      color: "bg-red-50 text-red-600"
    }
  ];

  // Datos de servicios destacados
  const highlightedServices = [
    {
      title: "Taller Especializado",
      description: "Servicio técnico certificado con las últimas herramientas de diagnóstico",
      image: "https://puntokoreano.com/images/carrousel/KORANDO.jpg",
      stats: [
        { icon: <Clock />, value: "Atención Rápida" },
        { icon: <PenTool />, value: "Técnicos Certificados" }
      ]
    },
    {
      title: "Centro de Repuestos",
      description: "La más amplia disponibilidad de repuestos originales SsangYong",
      image: "https://puntokoreano.com/images/carrousel/REXTON.webp",
      stats: [
        { icon: <Building />, value: "Stock Permanente" },
        { icon: <Star />, value: "Calidad Original" }
      ]
    },
    {
      title: "Servicio Premium",
      description: "Atención personalizada y seguimiento post-venta garantizado",
      image: "https://puntokoreano.com/images/carrousel/TORRES.jpg",
      stats: [
        { icon: <Users />, value: "Asesoría Experta" },
        { icon: <MapPin />, value: "Cobertura Nacional" }
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de Logros */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-glegoo mb-4">
          Espacios que te podrían interesar
          </h2>
          <div className="w-24 h-1 bg-[#E2060F] mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlightedServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h4 className="text-white text-xl font-bold font-glegoo text-center px-4">
                      {service.title}
                    </h4>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.stats.map((stat, idx) => (
                      <Badge 
                        key={idx}
                       /*  count={stat.value}
                        style={{ backgroundColor: '#E2060F' }}
                        className="flex items-center gap-2" */
                      >
                        {stat.icon}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Servicios Destacados */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12 font-glegoo">
          Lidereando servicio de asesoría automotriz  
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`${achievement.color} p-4 rounded-full inline-block mb-4`}>
                  {achievement.icon}
                </div>
                <Statistic 
                  value={achievement.value} 
                  title={achievement.title}
                  className="font-glegoo"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Calidad */}
        <div 
          className="mt-20 relative overflow-hidden rounded-2xl"
          data-aos="fade-up"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white 
          hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
          active:scale-95"></div>
          <div className="relative py-6 px-36 flex items-center justify-between text-white">
            <div className="flex-1 text-center">
              <h3 className="text-3xl font-bold mb-4 font-glegoo">
              AUTORIZACIÓN Y RESPALDO 
              </h3>
              <p className="text-xl max-w-2xl mx-auto">
              Somos distribuidores autorizados de la marca Ssangyong-KGM y contamos con el conocimiento técnico que garantiza un diagnostico de calidad. 
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div>
                <a href="https://www.kgm.com.co/almacenes-de-repuestosconcesionarios-centros-de-servicios/" target="_blank" rel="noopener noreferrer">
                  <img src="https://puntokoreano.com/images/mark_water.jpeg" alt="Verification Badge" className="w-40 h-40 object-cover z-10 rounded-full hover:opacity-90 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
