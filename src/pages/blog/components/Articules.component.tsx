import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Group from "../../../components/layout/Group.component";
import CardArticle from "./CardArticle.component";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Articules = () => {
    const articles = [
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog1.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog2.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog3.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog4.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog5.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog6.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog1.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
        {
            "title": "Dolor sit amet adipisicing elit.",
            "image": "https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog2.webp",
            "author": "Joe Doe",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi deleniti cum amet saepe nulla quas veritatis.",
            "date": "20 Octubre"
        },
    ];

    return (
        <section className="mx-5 mb-5 max-w-[1320px] lg:px-10 xl:mx-auto">
            <Group title={<><strong>BLOG</strong> & ARTICLE</>}/>
            <div className="sm:flex sm:flex-wrap sm:justify-around lg:gap-2">
                {
                    articles.map( (article, idx) => <div key={`${idx}-${article.title}`}><CardArticle article={article} /></div> )
                }
            </div>
            <div className="bg-[#F7F7F7] flex items-center justify-center py-2 gap-2 rounded-lg">
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg cursor-pointer" />
                <button className="py-2 px-4 bg-[#E2060F] text-white font-bold border rounded-full">
                    1
                </button>
                <button className="py-2 px-4 bg-white hover:bg-[#E2060F] hover:text-white transition-all duration-300 font-bold border rounded-full">
                    2
                </button>
                <button className="py-2 px-4 bg-white hover:bg-[#E2060F] hover:text-white transition-all duration-300 font-bold border rounded-full">
                    3
                </button>
                <button className="py-2 px-4 bg-white hover:bg-[#E2060F] hover:text-white transition-all duration-300 font-bold border rounded-full">
                    4
                </button>
                <FontAwesomeIcon icon={faArrowRight} className="text-lg cursor-pointer" />
            </div>
        </section>
    )
};
export default Articules;