import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useArticlesByVehicle } from "@/hooks/useBlog";
import CardArticle from "./CardArticle.component";
import { ArticleResponse } from "@/types/blog";

const Articles = () => {
  const { brand, vehicle } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!brand || !vehicle) {
      navigate("/blog");
      return;
    }
  }, [brand, vehicle, navigate]);

  const { data: articlesResponse, isError } = useArticlesByVehicle(
    brand ?? "",
    vehicle ?? "",
    page
  );

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= (articlesResponse?.data?.pagination?.pages || 1)
    ) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (isError) {
    return (
      <div className="text-center p-8">
        <p>Error loading articles. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Artículos sobre {brand?.toUpperCase()} {vehicle?.replace(/-/g, " ")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesResponse?.data?.articles?.map(
          (article: ArticleResponse, idx) => (
            <CardArticle key={`${article.slug}-${idx}`} article={article} />
          )
        )}
      </div>

      {articlesResponse?.data?.pagination?.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: articlesResponse.data.pagination.pages }).map(
              (_, idx) => (
                <button
                  key={`page-${idx}`}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-8 h-8 rounded ${
                    page === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === articlesResponse?.data?.pagination?.pages}
            className="p-2 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </div>
  );
};
export default Articles;
