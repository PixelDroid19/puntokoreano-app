import { Divider } from "antd";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const brands = [
    {
      name: "musso",
      image: "https://www.puntokoreano.com/images/logos/musso.png",
      marco: "bg-marco-amarillo",
    },
    {
      name: "korando",
      image: "https://www.puntokoreano.com/images/logos/korando.png",
      marco: "bg-marco-morado",
    },
    {
      name: "rexton",
      image: "https://www.puntokoreano.com/images/logos/rexton.png",
      marco: "bg-marco-amarillo",
    },
    {
      name: "kyron",
      image: "https://www.puntokoreano.com/images/logos/kyron.png",
      marco: "bg-marco-morado",
    },
    {
      name: "rodius",
      image: "https://www.puntokoreano.com/images/logos/rodius.png",
      marco: "bg-marco-amarillo",
    },
    {
      name: "actyon",
      image: "https://www.puntokoreano.com/images/logos/actyon.png",
      marco: "bg-marco-morado",
    },
    {
      name: "tivoli",
      image: "https://www.puntokoreano.com/images/logos/tivoli.png",
      marco: "bg-marco-amarillo",
    },
    {
      name: "stavic",
      image: "https://www.puntokoreano.com/images/logos/stavic.png",
      marco: "bg-marco-morado",
    },
  ];

  return (
    <div className="mx-5 max-w-[1320px] md:mx-10 lg:px-10 xl:mx-auto">
      <section className="my-5 md:flex md:justify-between md:items-center">
        <div className="md:flex md:flex-col md:items-start md:w-1/2">
          <h1 className="text-2xl underline decoration-[#CD42E9] text-center uppercase xl:text-4xl">
            Blog Interactivo
          </h1>
          <p className="text-base text-center mt-2 md:text-start md:mt-0">
            Descubre consejos para prolongar la vida util de las piezas de tu
            vehiculo y deja tus inquetudes.
          </p>
        </div>
        <div className="flex items-center justify-around md:gap-3">
          <img
            src="https://puntokoreano.com/images/logos/kgm_mobility.png"
            alt=""
            width={160}
            className="mr-4"
          />
          <Divider
            type="vertical"
            className={`border-[#001529] border-2 h-16 -ml-4`}
          />
          <img
            src="https://puntokoreano.com/images/SSangYong_blue.png"
            alt=""
            width={100}
          />
        </div>
      </section>
      <section className="my-5 md:flex md:flex-wrap md:justify-between md:gap-y-8 xl:justify-around">
        {brands.map((brand) => {
          return (
            <div
              key={brand.name}
              className="transition duration-300 hover:-translate-y-4 hover:shadow-2xl cursor-pointer my-8 min-w-80 md:my-0 lg:min-w-[450px] 2xl:min-w-[45%] sm:mx-auto"
            >
              <div
                data-aos={"fade-up"}
                className={`${brand.marco} bg-no-repeat bg-contain flex justify-center sm:mx-auto`}
                onClick={() => navigate(`/blog/${brand.name}/vehicles`)}
              >
                <img
                  src={brand.image}
                  alt=""
                  className="w-32 h-24 sm:w-52 sm:h-40 object-contain mx-auto"
                />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
export default Blog;
