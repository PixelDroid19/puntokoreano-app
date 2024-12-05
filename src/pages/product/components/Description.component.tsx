
const DescriptionProduct = ({name, long_description, short_description}) => {
    console.log('name', name, 'Description',  short_description)
    return ( 
        <div className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl xl:px-10 xl:py-6">
              <h1 className="font-bold text-xl lg:text-2xl">{name}</h1>
            <p>{long_description}</p>
            <ul className="list-disc mx-5 lg:text-xl">
                <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</li>
                <li>Repudiandae voluptas officia iste repellat velit.</li>
                <li>Repudiandae voluptas officia iste repellat velit.</li>
                <li>Repudiandae voluptas officia iste repellat velit.</li>
            </ul>
            <h3 className="font-bold text-lg text-center lg:text-start lg:text-xl">Cauchos</h3>
            <img className="sm:w-96 sm:mx-auto block lg:mx-0" src="https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/big-product/product2.webp" />
            <h3 className="font-bold text-lg text-center lg:text-xl lg:text-start">Bujia</h3>
            <img className="sm:w-96 sm:mx-auto block lg:mx-0" src="https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/big-product/product5.webp" />
        </div>
    )
}
export default DescriptionProduct;