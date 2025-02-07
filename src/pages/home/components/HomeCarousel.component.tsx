import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./styles.css";

export const HomeCarousel = () => {
  return (
    <Swiper
      navigation={false}
      loop
      modules={[Pagination, Autoplay]}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 2500,
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
      <SwiperSlide>
        <img
          src="https://puntokoreano.com/images/carrousel/KORANDO.jpg"
          alt="korando"
          className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover brightness-[.4]"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://puntokoreano.com/images/carrousel/REXTON.webp"
          alt="rexton"
          className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover brightness-[.4]"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://puntokoreano.com/images/carrousel/TIVOLI.jpg"
          alt="tivoli"
          className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover brightness-[.4]"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="https://puntokoreano.com/images/carrousel/TORRES.jpg"
          alt="torres"
          className="h-full sm:h-96 xl:h-[80vh] lg:h-[60vh] w-full object-cover brightness-[.4]"
        />
      </SwiperSlide>
    </Swiper>
  );
};
export default HomeCarousel;
