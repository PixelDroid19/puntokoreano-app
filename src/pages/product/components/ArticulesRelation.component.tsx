import CardArticle from "@/pages/blog/components/CardArticle.component";
import { useNavigate } from "react-router-dom";

interface Article extends Record<string, string> {
  title: string;
  image: string; 
  author: string;
  description: string;
  date: string;
 }

interface ArticuleRelationProps {
  related_products: Article[];
}

const ArticuleRelation = ({ related_products }: ArticuleRelationProps) => {
  const navigate = useNavigate();


  return (
    <div className="gap-2 mb-4 bg-white p-4 rounded-xl xl:px-10 xl:py-6">
      <div className="flex flex-wrap justify-around">
        {related_products.map((article, idx) => (
          <div key={`${idx}-${article.title}`}>
            <CardArticle article={article} />
          </div>
        ))}
      </div>

      <p
        onClick={() => navigate("/blog")}
        className="text-center text-xl font-semibold text-blue-600 cursor-pointer font-glegoo"
      >
        Leer más
      </p>
    </div>
  );
};
export default ArticuleRelation;
