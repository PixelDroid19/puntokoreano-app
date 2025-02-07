import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface Article {
  title: string;
  slug: string;
  image: string;
  author: string;
  description: string;
  date: string;
  maintenance_type?: string;
  views?: number;
}

interface Props {
  article: Article;
}

const CardArticle = ({ article }: Props) => {
  const navigate = useNavigate();
  
  const handleArticleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/blog/article/${article.slug}`);
  };

  return (
    <div className="transition duration-300 hover:-translate-y-4 hover:shadow-2xl border w-full p-5 max-w-[390px] rounded-lg hover:border-[#E2060F] hover:bg-[#FAF0F7] my-4 cursor-pointer sm:w-64 md:w-80 lg:w-[290px] xl:w-[380px] 2xl:w-full">
      <div
        data-aos="fade-up"
       onClick={handleArticleClick}
      >
        <figure className="relative mb-2">
          <div className="bg-[#E2060F] w-min text-center px-5 py-2 rounded-lg text-white absolute top-2 left-2 lg:text-sm">
            {article.date}
          </div>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover" // Add consistent image sizing
          />
        </figure>
        <section>
          <p className="text-gray-400 uppercase">BY: {article.author}</p>
          <h1 className="text-xl font-bold hover:text-[#E2060F]">
            {article.title}
          </h1>
          <p className="text-gray-400 line-clamp-3">
            {" "}
            {/* Limit text to 3 lines */}
            {article.description}
          </p>
          {article.maintenance_type && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
              {article.maintenance_type}
            </span>
          )}
          <div className="flex justify-between items-center mt-2">
            <button className="flex items-center text-base uppercase gap-2 hover:text-[#E2060F]">
              Leer más <FontAwesomeIcon icon={faArrowRight} />
            </button>
            {article.views !== undefined && (
              <span className="text-sm text-gray-500">
                {article.views} visitas
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default CardArticle;
