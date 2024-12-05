import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardProducts from "./CardProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";
import { Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  inline?: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  group: string;
  subgroup: string;
  stock: number;
  code: number;
  shipping: string[];
  images: string[];
  active: boolean;
}

import "swiper/css";
import ENDPOINTS from "@/api";

const SectionProducts = ({ inline }: Props) => {
  const sm = useMediaQuery({ query: "(min-width: 640px)" });
  const md = useMediaQuery({ query: "(min-width: 768px)" });
  const lg = useMediaQuery({ query: "(min-width: 1024px)" });
  const xl = useMediaQuery({ query: "(min-width: 1280px)" });
  const xl2 = useMediaQuery({ query: "(min-width: 1536px)" });
  const xl3 = useMediaQuery({ query: "(min-width: 1800px)" });

  const { data } = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => {
      return axios
        .get(ENDPOINTS.PRODUCTS.GET_ALL.url)
        .then((response) => response.data);
    },
  });

  return (
    <div
      className={`mx-5 mb-10 max-w-[1280px] lg:px-0 xl:mx-auto lg:mx-auto`}
      key={"section-1"}
    >
      <div className="flex items-center gap-2 mt-2 py-2 border-b border-b-[#e5e5e5] mb-5">
        <FontAwesomeIcon
          icon={faCircle}
          className="text-[#E2060F] text-sm p-1 border rounded-full border-[#E2060F]"
        />
        <h2 className="text-xl uppercase lg:text-2xl">
          <strong>Productos</strong> populares
        </h2>
      </div>
      {inline && (
        <Swiper
          data-aos={inline && "fade-left"}
          navigation
          loop
          modules={[Navigation]}
          slidesPerView={
            xl3 ? 3 : xl2 ? 3 : xl ? 3 : lg ? 3 : md ? 2 : sm ? 2 : 1
          }
          spaceBetween={20}
          style={
            {
              "--swiper-navigation-size": "30px",
            } as React.CSSProperties
          }
        >
          {data?.data?.products.map((product: Product) => (
            <SwiperSlide key={product._id}>
              <CardProducts inline product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {!inline && (
        <div
          className={`flex justify-center flex-wrap gap-8 lg:justify-evenly ${
            inline && "flex-nowrap"
          }`}
        >
          {data?.data?.products.map((product: Product) => (
            <div key={product._id}>
              <CardProducts product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SectionProducts;
