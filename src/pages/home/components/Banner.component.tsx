import { Divider } from 'antd';
import { useMediaQuery } from 'react-responsive';


import './styles.css';

const Banner = () => {
    const isLg = useMediaQuery({
        query: '(min-width: 1024px)'
    });

    return (
        <section className='container-banner'>
            <div className='banner-content'>
                <img src="https://puntokoreano.com/images/flags/flag_korea.png" alt="Bandera de Korea" />
                <Divider className='divider' type={ isLg ? 'vertical' : 'horizontal'} />

                <h2>Distribuidor</h2>

                <figure className='container-brand'>
                    <img src="https://puntokoreano.com/images/logos/ssangyoung_white.png" alt="Logo Ssangyong" />
                    <figcaption>
                        Originalidad, sinceridad y respaldo
                    </figcaption>
                </figure>

                <h2>Autorizado</h2>

                <Divider className='divider' type={ isLg ? 'vertical' : 'horizontal'}  />
                <img src="https://puntokoreano.com/images/flags/flag_alemania.png" alt="Bandera de Alemania" />
            </div>
        </section>
    )
};
export default Banner;