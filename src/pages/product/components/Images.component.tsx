import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useRef, useState } from "react";
import { Image } from "antd";
import '@justinribeiro/lite-youtube';

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./styles/ImagesView.css";

interface ImagesViewProps {
  images: string[];
  videoUrl?: string;
}

const ImagesView = ({ images, videoUrl }: ImagesViewProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperElRef = useRef<SwiperRef>(null);

  // Extraer video ID de la URL de YouTube
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Combinar imágenes con video si existe
  const allMedia = [...images];
  const hasVideo = videoUrl && videoUrl.trim() !== '';
  const videoId = hasVideo ? extractVideoId(videoUrl) : null;
  
  if (hasVideo && videoId) {
    allMedia.push('VIDEO_PLACEHOLDER');
  }

  return (
    <div className="relative">
      <div className="bg-white">
        {/* Swiper principal - Dimensiones exactas 600x600px */}
        <Swiper
          loop={allMedia.length > 1}
          navigation={allMedia.length > 1}
          spaceBetween={10}
          modules={[FreeMode, Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="product-detail-swiper" 
          style={{ width: "600px", height: "600px" }}
        >
          {allMedia.map((media, idx) => (
            <SwiperSlide key={`${media}-${idx}`}>
              <div className="product-image-detail-container">
                {media === 'VIDEO_PLACEHOLDER' && videoId ? (
                  <lite-youtube
                    videoid={videoId}
                    videotitle="Video del producto"
                    posterquality="maxresdefault"
                    className="product-detail-video"
                  />
                ) : media !== 'VIDEO_PLACEHOLDER' ? (
                  <img
                    src={media}
                    alt={`Imagen ${idx + 1}`}
                    className="product-detail-image"
                  />
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Swiper de miniaturas */}
        <div className="px-4 mt-4">
          <Swiper
            ref={swiperElRef}
            onSwiper={setThumbsSwiper}
            loop={allMedia.length > 1}
            spaceBetween={8}
            slidesPerView={'auto'}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper h-[70px]"
          >
            {allMedia.map((media, idx) => (
              <SwiperSlide key={`${media}-${idx}-2`} className="!w-[60px] pt-1">
                <div
                  className={`
                    w-[60px] h-[60px] border-2 rounded-md overflow-hidden cursor-pointer shadow-sm
                    ${
                      activeIndex === idx
                        ? "border-[#E2060F] shadow-md"
                        : "border-gray-200"
                    }
                    hover:border-[#E2060F] hover:shadow-md transition-all duration-200
                  `}
                >
                  {media === 'VIDEO_PLACEHOLDER' ? (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex flex-col items-center justify-center text-white">
                      <div className="flex items-center justify-center mb-0.5">
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-4 h-4"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium leading-none">Ver</span>
                    </div>
                  ) : (
                    <img
                      src={media}
                      alt={`Miniatura ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  )}
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
