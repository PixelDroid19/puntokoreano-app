import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useRef, useState } from "react";
import { Image } from "antd";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./styles/ImagesView.css";

interface ImagesViewProps {
  images: string[];
}

const ImagesView = ({ images }: ImagesViewProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperElRef = useRef<SwiperRef>(null);

  return (
    <div className="relative max-w-2xl">
      <div className="bg-white rounded-lg" style={{ height: "378.264px" }}>
        {/* Swiper principal */}
        <Swiper
          loop={true}
          navigation={true}
          spaceBetween={10}
          modules={[FreeMode, Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-[300px]" // Altura ajustada para el swiper principal
        >
          {images.map((image, idx) => (
            <SwiperSlide key={`${image}-${idx}`}>
              <div className="h-full flex justify-center items-center p-4">
                <Image
                  src={image}
                  alt={`Imagen ${idx + 1}`}
                  className="object-contain max-h-full w-auto"
                  preview={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Swiper de miniaturas */}
        <div className="px-4">
          <Swiper
            ref={swiperElRef}
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper h-[60px]" // Altura ajustada para miniaturas
          >
            {images.map((image, idx) => (
              <SwiperSlide key={`${image}-${idx}-2`}>
                <div
                  className={`
                    h-full border rounded-lg overflow-hidden cursor-pointer
                    ${
                      activeIndex === idx
                        ? "border-[#E2060F]"
                        : "border-gray-200"
                    }
                    hover:border-[#E2060F] transition-colors duration-200
                  `}
                >
                  <div className="h-full w-full flex items-center justify-center p-1">
                    <img
                      src={image}
                      alt={`Miniatura ${idx + 1}`}
                      className="object-contain max-h-full w-auto"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Barra de colores inferior */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-[#E8832F]" />
        <div className="flex-1 bg-[#302582]" />
        <div className="flex-1 bg-[#9C089F]" />
      </div>
    </div>
  );
};

export default ImagesView;
