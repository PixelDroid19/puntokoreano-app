import { useEffect, useState } from "react";

const DetailBuy = () => {
    const [ subTotal, setSubTotal ] = useState<number>(0);
    const [ total, setTotal ] = useState<number>(0);

    const getTotalAndSubTotal = () => {
        const total = valuesCart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        setSubTotal(total);
        setTotal(total);
    }

    useEffect(() => {
        getTotalAndSubTotal()
    }, [])

    const valuesCart = [
        {
            name: "Car & Motorbike Care.",
            image: "https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/small-product/product1.webp",
            quantity: 2,
            price: 25000
        },
        {
            name: "Enginer and Drivetrain",
            image: "https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/small-product/product2.webp",
            quantity: 5,
            price: 65000
        },
        {
            name: "Enginer and Drivetrain",
            image: "https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/small-product/product3.webp",
            quantity: 1,
            price: 100000
        },
        {
            name: "Enginer and Drivetrain",
            image: "https://risingtheme.com/html/demo-partsix/partsix/assets/img/product/small-product/product4.webp",
            quantity: 3,
            price: 10000
        },
    ];

    return (
        <section className="mt-5  sm:w-[550px] mx-auto">
            <div className="relative mt-12 bg-white shadow-xl rounded-2xl p-4">
                <figure className="absolute -top-6 left-[45%]">
                    <img src="https://puntokoreano.com/images/logo-512x512.png" alt="logo" width={50} />
                </figure>

                <h3 className="text-xl font-semibold text-center pt-6 pb-2">Punto Koreano</h3>
                <p className="text-base text-gray-400 text-center border-b pb-2">14 Julio de 2024</p>

                <p className="text-base text-gray-400 mt-2">Detalle de la operación</p>
                <div>
                    {
                        valuesCart.map((cart) => {
                            return (
                                <div className="border-b border-dotted mt-2 flex justify-between items-end pb-2">
                                    <div className="w-fit">
                                        <h4 className="text-lg font-bold">{ cart.name }</h4>
                                        <div className="flex justify-between text-gray-400">
                                            <p className="text-base">$ { cart.price.toLocaleString('es-CO') } COP</p>
                                            <p className="text-base">x{ cart.quantity }</p>
                                        </div>
                                    </div>
                                    <p className="text-base font-bold">$ { (cart.price * cart.quantity).toLocaleString('es-CO') } COP</p>
                                </div>
                            )
                        })
                    }
                    <div className="pt-4 text-base border-b">
                        <div className="flex justify-between pb-2">
                            <p className="text-gray-400">Subtotal</p>
                            <p>$ { subTotal.toLocaleString('es-CO') } COP</p>
                        </div>
                    </div>

                    <div className="pt-4 text-base border-b">
                        <div className="flex justify-between pb-2">
                            <p className="text-gray-400">Envío</p>
                            <p>$ { 0 } COP</p>
                        </div>
                    </div>

                    <div className="pt-4 text-base flex justify-between">
                        <p>Total</p>
                        <p>$ { total.toLocaleString('es-CO') } COP</p>
                    </div>
                </div>
            </div>
        </section>
    )
};
export default DetailBuy;