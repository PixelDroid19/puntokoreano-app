import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./styles.css";

export const HomeCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    if (carouselRef.current) {
      scopeRef.current = createScope({ root: carouselRef });
      
      scopeRef.current.add((scope) => {
        // Efecto de overlay animado
        animate(".carousel-overlay", {
          opacity: [0, 0.7],
          duration: 1000,
          easing: "spring(1, 90, 10, 0)",
        });

        // Animación para el título del carrusel
        animate(".carousel-title", {
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 1000,
          easing: "spring(1, 80, 10, 0)",
          delay: 300,
        });

        // Animación para la descripción del carrusel
        animate(".carousel-description", {
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 1000,
          easing: "spring(1, 80, 10, 0)",
          delay: 500,
        });

        // Animación para el botón del carrusel
        animate(".carousel-button", {
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 800,
          easing: "spring(1, 80, 10, 0)",
          delay: 700,
        });

        return scope;
      });

      // Limpiar al desmontar - método mejorado para evitar errores
      return () => {
        try {
          // Solo intentar revertir si el scope existe
          if (scopeRef.current && typeof scopeRef.current.revert === 'function') {
            scopeRef.current.revert();
          }
        } catch (error) {
          console.error('Error al revertir animaciones:', error);
        }
      };
    }
  }, []);

  return (
    <div ref={carouselRef} className="relative">
      <Swiper
        navigation={false}
        loop
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        style={
          {
            "--swiper-pagination-top": "0px",
            "--swiper-pagination-bullet-inactive-color": "white",
            "--swiper-pagination-bullet-inactive-opacity": "0.8",
          } as React.CSSProperties
        }
        className="h-64 sm:h-96 lg:h-[60vh] xl:h-[80vh]"
      >
        <SwiperSlide className="relative">
          <img
            src="https://puntokoreano.com/images/carrousel/KORANDO.jpg"
            alt="korando"
            className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover"
          />
          <div className="carousel-overlay absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
            <h2 className="carousel-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center opacity-0">
              Korando
            </h2>
            <p className="carousel-description text-lg sm:text-xl max-w-3xl text-center mb-6 opacity-0">
              Descubre el equilibrio perfecto entre potencia y sofisticación
            </p>
           
          </div>
        </SwiperSlide>
        <SwiperSlide className="relative">
          <img
            src="https://puntokoreano.com/images/carrousel/REXTON.webp"
            alt="rexton"
            className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover"
          />
          <div className="carousel-overlay absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
            <h2 className="carousel-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center opacity-0">
              Rexton
            </h2>
            <p className="carousel-description text-lg sm:text-xl max-w-3xl text-center mb-6 opacity-0">
              Diseñado para superar todos los límites de la aventura
            </p>
           
          </div>
        </SwiperSlide>
        <SwiperSlide className="relative">
          <img
            src="https://puntokoreano.com/images/carrousel/TIVOLI.jpg"
            alt="tivoli"
            className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover"
          />
          <div className="carousel-overlay absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
            <h2 className="carousel-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center opacity-0">
              Tivoli
            </h2>
            <p className="carousel-description text-lg sm:text-xl max-w-3xl text-center mb-6 opacity-0">
              Estilo urbano con un toque de elegancia
            </p>
            
          </div>
        </SwiperSlide>
        <SwiperSlide className="relative">
          <img
            src="https://puntokoreano.com/images/carrousel/TORRES.jpg"
            alt="torres"
            className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover"
          />
          <div className="carousel-overlay absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
            <h2 className="carousel-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center opacity-0">
              Torres
            </h2>
            <p className="carousel-description text-lg sm:text-xl max-w-3xl text-center mb-6 opacity-0">
              La nueva definición de aventura y confort
            </p>
        
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default HomeCarousel;
