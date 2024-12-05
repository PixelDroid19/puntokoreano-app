const BlogPost = () => {
    return (
        <section className="mx-5 my-5 max-w-[1320px] lg:px-10 xl:mx-auto">
            <article className="text-base lg:text-lg">
                <h1 className="font-bold text-xl lg:text-2xl">Lorem ipsum dolor, sit amet consectetur elit saepe!</h1>
                <p className="my-2 lg:mt-0">Posted By: Joe Doe / On: Marzo 26</p>
                <figure>
                    <img
                    className="rounded-lg"
                    src="https://risingtheme.com/html/demo-partsix/partsix/assets/img/blog/blog-page-big1.webp"
                    alt=""
                    />

                    <figcaption className="font-bold text-lg lg:text-xl my-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus non sint saepe rem eveniet sit ea esse praesentium!
                    </figcaption>
                </figure>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita in recusandae sit officia ipsa, natus ad voluptatem doloribus dolorum placeat, rem deleniti est accusamus ipsum corporis voluptates soluta totam maiores nostrum reprehenderit quasi? Laboriosam itaque ab odit harum sed aut voluptates, illum unde. Saepe enim ad ut pariatur doloremque quas harum sequi, excepturi tempore exercitationem suscipit quam recusandae corrupti quibusdam. Laboriosam sapiente provident repellat blanditiis ratione nostrum illum asperiores quo cumque in quisquam, non iste aut illo vel, alias debitis!
                    <br /> <br />
                    Vel ipsa officiis nobis eveniet omnis consequuntur neque quasi, in, optio rerum suscipit totam odio. Alias necessitatibus nulla accusantium voluptatem ipsum voluptatum, vero in impedit nobis cupiditate ea, dicta eos facilis eaque optio laudantium non neque itaque? Possimus officia aut accusamus illum, adipisci, nihil numquam minus eum fugit, beatae minima facilis magni.
                </p>
                <br />
                <p className="font-bold italic text-center max-w-[500px] mx-auto text-lg">
                    Quisque semper nunc vitae erat pellentesque, ac placerat arcu consectetur. In venenatis elit ac ultrices convallis. Duis est nisi, tincidunt ac urna sed, cursus blandit lectus. In ullamcorper sit amet ligula ut eleifend. Proin dictum tempor ligula, ac feugiat metus. Sed finibus tortor eu scelerisque scelerisque.
                </p>
                <br />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus sapiente omnis sunt labore mollitia, quaerat incidunt sequi, ut alias accusamus nostrum magni fugit facilis dignissimos illum repellendus et numquam adipisci quos. Eos omnis maiores beatae cum a consequatur magnam sequi neque, at numquam qui ipsam unde veritatis voluptates quam dicta! Ipsam, mollitia illo fuga vel culpa reprehenderit quisquam maxime nesciunt. Sunt quaerat inventore aspernatur quibusdam corrupti numquam mollitia exercitationem rem alias consectetur hic iusto dignissimos nostrum odio, cumque impedit.
                </p>
            </article>
            <br />
            <div className="lg:flex lg:items-center lg:gap-3">
                <h2 className="font-bold text-center text-xl">Releated Tags:</h2>
                <div className="flex gap-2 justify-center mt-2 ">
                    <button className="border py-1 px-2 text-base hover:bg-[#E2060F] hover:text-white transition-all duration-300">
                        Popular
                    </button>
                    <button className="border py-1 px-2 text-base hover:bg-[#E2060F] hover:text-white transition-all duration-300">
                        Business
                    </button>
                    <button className="border py-1 px-2 text-base hover:bg-[#E2060F] hover:text-white transition-all duration-300">
                        Design
                    </button>
                    <button className="border py-1 px-2 text-base hover:bg-[#E2060F] hover:text-white transition-all duration-300">
                        Service
                    </button>
                </div>
            </div>
        </section>
    )
};
export default BlogPost;