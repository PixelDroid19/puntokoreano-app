import { useNavigate } from "react-router-dom";

interface Props {
    applies?: boolean;
}

const VehiclesBrand = ({ applies = false }: Props) => {
    const navigate = useNavigate();

    const vehicles = [
        {
            "brand": "korando",
            "name": "Turbo Diesel 2.9",
            "year": "1996 - 2005",
            "image": "https://www.puntokoreano.com/images/korando_car.png"
        },
        {
            "brand": "korando",
            "name": "Turbo Diesel 2.3",
            "year": "2010 - 2013",
            "image": "https://www.puntokoreano.com/images/korando_car.png"
        },
        {
            "brand": "korando c",
            "name": "Turbo Diesel 2.9",
            "year": "1996 - 2005",
            "image": "https://www.puntokoreano.com/images/korando_car.png"
        },
        {
            "brand": "korando c",
            "name": "Turbo Diesel 2.9",
            "year": "1996 - 2005",
            "image": "https://www.puntokoreano.com/images/korando_car.png"
        },
        {
            "brand": "korando elite",
            "name": "Turbo Diesel 2.9",
            "year": "1996 - 2005",
            "image": "https://www.puntokoreano.com/images/korando_car.png"
        },
    ]
    return (
        <section className="mx-5 my-5 max-w-[1280px] xl:mx-auto">
            { !applies && <h1
            className="text-xl font-bold underline decoration-[#FFEC0C] uppercase text-center underline-offset-4 sm:text-2xl xl:text-3xl"
            >
                Selecciona el modelo de tu vehículo
            </h1>}
            <div className="md:flex md:flex-wrap 2xl:justify-around justify-center">
                {
                    vehicles.map((vehicle, idx) => {
                        return (
                            <div
                            data-aos="fade-up"
                            key={`${idx}-${vehicle.name}`}
                            className={`my-2 ${ applies ? 'w-72' : 'w-80'} mx-auto cursor-pointer sm:my-4 lg:w-[35%] max-w-[500px]`}
                            onClick={() => navigate(`/blog/${vehicle.brand}/${vehicle.name}/articles`)}
                            >
                                <figure className="border-b-2 border-[#001529]">
                                    <img src={vehicle.image} alt={vehicle.name} className={`${ !applies && "hover:scale-105 transition-[transform] duration-500"}`} />
                                </figure>
                                <div>
                                    <h2 className="text-xl uppercase font-medium">{ vehicle.brand }</h2>
                                    <h3 className="text-sm font-medium uppercase">{ vehicle.name }</h3>
                                    <p className="text-sm">{ vehicle.year }</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
};
export default VehiclesBrand;