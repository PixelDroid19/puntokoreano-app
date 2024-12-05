import { Divider } from "antd";
import korea from "../../../assets/bandera_korea.png";
import alemania from "../../../assets/banera_alemania.png";
import colombia from "../../../assets/bandera_colombia.webp";
import { useMediaQuery } from "react-responsive";

import './styles.css';

export const Footer = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 769px)' });

    return (
        <div className="container-footer">
            <div className="flex flex-nowrap w-full">
                <div className="h-2 bg-gradient-to-l from-[#BA861D] to-black flex-1" />
                <div className="h-2 bg-gradient-to-l from-[#21449A] to-black flex-1" />
                <div className="h-2 bg-gradient-to-l from-[#BA231D] to-black flex-1" />
            </div>
            <img src="https://puntokoreano.com/images/footer/footer_banner.jpg" alt="cars" className="object-cover object-bottom h-[25vh] w-full grayscale md:h-[40vh] lg:h-[50vh]" />
            <div className="bg-[#161418]">
            <div className={`container-info`}>
                <h3 className="2xl:text-2xl">PUNTO KOREANO</h3>
                <Divider type={isTablet ? "horizontal" : "vertical"} className="border-white my-3 lg:h-10"/>
                <h3 className="2xl:text-2xl">CL 63F #25 - 15 BOGOTA D.C </h3>
                <Divider type={isTablet ? "horizontal" : "vertical"} className="border-white my-3 lg:h-10" />
                <h3 className="2xl:text-2xl">TEL: 7027821 - 7027735</h3>
                <Divider type={isTablet ? "horizontal" : "vertical"} className="border-white my-3 lg:h-10" />
                <h3 className="text-center lg:text-left lg:w-48 xl:w-64 2xl:text-2xl">Distribuidor autorizado Ssangyong Motor Colombia</h3>
                <Divider type={isTablet ? "horizontal" : "vertical"} />
                <div className="flex gap-4">
                    <img src={colombia} className="w-10 h-10 2xl:w-12 2xl:h-12" alt="Bandera Colombia"/>
                    <img src={korea} className="w-10 h-10 2xl:w-12 2xl:h-12" alt="Bandera Korea"/>
                    <img src={alemania} className="w-10 h-10 2xl:w-12 2xl:h-12" alt="Bandera Alemania"/>
                </div>
            </div>
            </div>
        </div>
    )
};
export default Footer;