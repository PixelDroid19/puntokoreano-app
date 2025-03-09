// Sections.tsx
import { useRef, useState, useEffect } from "react";
import { Carousel, Badge, Statistic, Spin } from "antd";
import * as AntIcons from '@ant-design/icons';
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
import axios from "axios";
import ENDPOINTS from "@/api";
import './styles/Sections.component.css'
interface Achievement {
  icon_url: string;
  value: string;
  title: string;
  active: boolean;
  order: number;
  _id: string;
}

interface Stat {
  icon: JSX.Element;
  value: string;
}

interface HighlightedService {
  title: string;
  description: string;
  image: string;
  stats: Stat[];
  _id?: string;
  identifier?: string;
}

// Mapping de iconos para asignar dinámicamente según el nombre
const iconMap: Record<string, JSX.Element> = {
  Award: <Award className="w-8 h-8" />,
  PenTool: <PenTool className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Clock: <Clock className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Building: <Building className="w-8 h-8" />,
  MapPin: <MapPin className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />
};

const Sections = () => {
  const carouselRef = useRef<typeof Carousel>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [highlightedServices, setHighlightedServices] = useState<HighlightedService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para asignar iconos según el nombre recibido de la API
  const getIconByName = (iconName: string): JSX.Element => {
    // Check if it's a Lucide icon first
    if (iconMap[iconName]) {
      return iconMap[iconName];
    }
    
    // Check if it's an Ant Design icon
    const AntIcon = (AntIcons as any)[iconName];
    if (AntIcon) {
      return <AntIcon className="w-8 h-8" />;
    }
    
    // Default icon if not found
    return <Award className="w-8 h-8" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch achievements
        const achievementsResponse = await axios.get(ENDPOINTS.SETTINGS.GET_ACHIEVEMENTS.url);
        
        // Use achievements data directly since it matches our interface
        const mappedAchievements = achievementsResponse.data.data;
        
        setAchievements(mappedAchievements);
        
        // Fetch highlighted services
        const servicesResponse = await axios.get(ENDPOINTS.SETTINGS.GET_HIGHLIGHTED_SERVICES.url);
        
        // Mapear los servicios y asignar iconos a las estadísticas
        const mappedServices = servicesResponse.data.data.map((service: any) => ({
          ...service,
          stats: service.stats?.map((stat: any) => ({
            ...stat,
            icon: stat.icon ? getIconByName(stat.icon) : <Clock />
          })) || []
        }));
        
        setHighlightedServices(mappedServices);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        
        // Fallback a datos estáticos en caso de error
        setAchievements([
          {
            value: "20+",
            title: "Años de Experiencia",
            icon_url: "",
            active: true,
            order: 1,
            _id: "1"
          },
          {
            value: "10,000+",
            title: "Clientes Satisfechos",
            icon_url: "",
            active: true,
            order: 2,
            _id: "2"
          },
          {
            value: "5,000+",
            title: "Repuestos Disponibles",
            icon_url: "",
            active: true,
            order: 3,
            _id: "3"
          },
          {
            value: "100%",
            title: "Garantía de Calidad",
            icon_url: "",
            active: true,
            order: 4,
            _id: "4"
          }
        ]);
        
        setHighlightedServices([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
      </div>
    );
  }

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
                key={service._id || index}
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
          liderándo el servicio automotriz 
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div 
                key={achievement._id || index}
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-50 text-blue-600 p-4 rounded-full inline-flex justify-center items-center mb-4">
                  <img src={achievement.icon_url} alt={achievement.title} className="w-8 h-8" />
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
