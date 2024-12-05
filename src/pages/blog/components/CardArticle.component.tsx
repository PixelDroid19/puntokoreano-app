import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface Props {
    article: Record<string, string>;
}

const CardArticle = ({ article }: Props) => {
    const navigate = useNavigate();

    return (
        <div className="transition duration-300 hover:-translate-y-4 hover:shadow-2xl border w-full p-5 max-w-[390px] rounded-lg hover:border-[#E2060F] hover:bg-[#FAF0F7] my-4 cursor-pointer sm:w-64 md:w-80 lg:w-[290px] xl:w-[380px] 2xl:w-full">
            <div
            data-aos="fade-up"
            onClick={() => navigate('/blog/post/1')}
            >
                <figure className="relative mb-2">
                    <div className=" bg-[#E2060F] w-min text-center px-5 py-2 rounded-lg text-white absolute top-2 left-2 lg:text-sm">
                        { article.date }
                    </div>
                    <img src={ article.image } alt="image" />
                </figure>
                <section>
                    <p className="text-gray-400 uppercase">
                        BY: { article.author }
                    </p>
                    <h1 className="text-xl font-bold hover:text-[#E2060F]">
                        { article.title }
                    </h1>
                    <p className="text-gray-400">
                        { article.description }
                    </p>
                    <button className="flex items-center text-base uppercase gap-2 mt-2 hover:text-[#E2060F]">
                        Leer mas <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </section>
            </div>
        </div>
    )
};
export default CardArticle;