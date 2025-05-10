import { Divider } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useRef } from 'react';
import { animate, createScope } from 'animejs';

import './styles.css';

const Banner = () => {
    const isLg = useMediaQuery({
        query: '(min-width: 1024px)'
    });
    
    const bannerRef = useRef<HTMLDivElement>(null);
    const scopeRef = useRef<any>(null);

    useEffect(() => {
        if (bannerRef.current) {
            // Crear un scope para las animaciones
            scopeRef.current = createScope({ root: bannerRef });
            
            // Añadir animaciones al scope
            scopeRef.current.add(scope => {
                // Animación para banderas - primera bandera
                animate('.banner-flag:first-child', {
                    opacity: [0, 1],
                    translateX: [-30, 0],
                    duration: 1000,
                    easing: 'spring(1, 80, 10, 0)',
                    delay: 0
                });
                
                // Animación para banderas - segunda bandera
                animate('.banner-flag:last-child', {
                    opacity: [0, 1],
                    translateX: [30, 0],
                    duration: 1000,
                    easing: 'spring(1, 80, 10, 0)',
                    delay: 300
                });
                
                // Animación para el texto con delays escalonados
                const textElements = document.querySelectorAll('.banner-text');
                textElements.forEach((el, i) => {
                    animate(el, {
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 800,
                        easing: 'spring(1, 80, 10, 0)',
                        delay: 300 + (i * 150)
                    });
                });
                
                // Animación para logo
                animate('.container-brand img', {
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    rotateY: [45, 0],
                    duration: 800,
                    easing: 'spring(1, 90, 10, 0)',
                    delay: 500
                });
                
                return scope;
            });
            
            // Limpiar al desmontar - método mejorado para evitar errores
            return () => {
                try {
                    // Solo intentar revertir si el scope existe
                    if (scopeRef.current && typeof scopeRef.current.revert === 'function') {
                        scopeRef.current.revert();
                    }
                } catch (error) {
                    console.error('Error al revertir animaciones:', error);
                }
            };
        }
    }, []);

    return (
        <section className='container-banner' ref={bannerRef}>
            <div className='banner-content'>
                <img 
                    className='banner-flag' 
                    src="https://puntokoreano.com/images/flags/flag_korea.png" 
                    alt="Bandera de Korea" 
                />
                <Divider className='divider' type={ isLg ? 'vertical' : 'horizontal'} />

                <h2 className='banner-text'>Distribuidor</h2>

                <figure className='container-brand'>
                    <img src="https://puntokoreano.com/images/logos/ssangyoung_white.png" alt="Logo Ssangyong" />
                    <figcaption className='banner-text'>
                        Originalidad, sinceridad y respaldo
                    </figcaption>
                </figure>

                <h2 className='banner-text'>Autorizado</h2>

                <Divider className='divider' type={ isLg ? 'vertical' : 'horizontal'}  />
                <img 
                    className='banner-flag' 
                    src="https://puntokoreano.com/images/flags/flag_alemania.png" 
                    alt="Bandera de Alemania" 
                />
            </div>
        </section>
    )
};
export default Banner;