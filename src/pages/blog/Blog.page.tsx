// Blog.tsx

import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useBrands } from "@/hooks/useBlog";

const Blog = () => {
  const navigate = useNavigate();
  const { data: brandsResponse, isLoading, isError } = useBrands();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingOutlined className="text-4xl" />
      </div>
    );
  }

  if (isError) {
    return <div>Error cargando las marcas</div>;
  }

  return (
    <div className="mx-5 max-w-[1320px] md:mx-10 lg:px-10 xl:mx-auto">
      {/* ... Header section ... */}
      <section className="my-5 md:flex md:flex-wrap md:justify-between md:gap-y-8 xl:justify-around">
        {brandsResponse?.data.map((brand) => (
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
                alt={brand.name}
                className="w-32 h-24 sm:w-52 sm:h-40 object-contain mx-auto"
              />
            </div>
            {/* Optional: Show stats */}
            <div className="text-sm text-gray-500 mt-2">
              {brand.stats.articleCount} artículos · {brand.stats.totalViews}{" "}
              visitas
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Blog;
