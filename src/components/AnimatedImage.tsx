import React, { useEffect, useRef, useState } from 'react';
import { animate, createScope } from 'animejs';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  animationDelay?: number;
  threshold?: number;
  style?: React.CSSProperties;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  animationDelay = 0,
  threshold = 0.1,
  style = {},
}) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando la imagen entra en el viewport
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold, // 10% visible
      }
    );

    if (imageContainerRef.current) {
      observer.observe(imageContainerRef.current);
    }

    return () => {
      if (imageContainerRef.current) {
        observer.unobserve(imageContainerRef.current);
      }
    };
  }, [threshold, isVisible]);

  useEffect(() => {
    // Ejecutar la animación cuando se vuelve visible
    if (isVisible && imageContainerRef.current) {
      animationRef.current = createScope({ root: imageContainerRef });
      
      animationRef.current.add(scope => {
        animate('.animated-image', {
          opacity: [0, 1],
          scale: [0.85, 1],
          translateY: [15, 0],
          duration: 800,
          easing: 'spring(1, 80, 10, 0)',
          delay: animationDelay
        });
        
        // Añadir interacción al hover
        const imageElement = imageContainerRef.current?.querySelector('.animated-image');
        
        if (imageElement) {
          imageElement.addEventListener('mouseenter', () => {
            animate(imageElement, {
              scale: 1.03,
              duration: 300,
              easing: 'spring(1, 80, 10, 0)'
            });
          });
          
          imageElement.addEventListener('mouseleave', () => {
            animate(imageElement, {
              scale: 1,
              duration: 300,
              easing: 'spring(1, 80, 10, 0)'
            });
          });
        }
        
        return scope;
      });
      
      // Limpieza mejorada para evitar errores
      return () => {
        try {
          if (animationRef.current && typeof animationRef.current.revert === 'function') {
            animationRef.current.revert();
          }
        } catch (error) {
          console.error('Error al revertir animaciones de imágenes:', error);
        }
      };
    }
  }, [isVisible, animationDelay]);

  return (
    <div
      ref={imageContainerRef}
      className={`animated-image-container ${className}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className={`animated-image transition-all ${imageClassName} ${!isVisible ? 'opacity-0' : ''}`}
      />
    </div>
  );
};

export default AnimatedImage; 