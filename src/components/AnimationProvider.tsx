import React, { createContext, useContext, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { createButtonAnimation, productCardAnimation } from '@/utils/animations';

// Definir el contexto para animaciones
interface AnimationContextType {
  animate: typeof animate;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

// Hook para usar el contexto de animación
export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext debe ser usado dentro de un AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: React.ReactNode;
}

const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  // Referencia para almacenar limpiezas de animaciones
  const cleanupFunctions = useRef<Array<() => void>>([]);

  // Inicializar animaciones globales
  useEffect(() => {
    // Aplicar animaciones a botones en toda la aplicación
    createButtonAnimation('.btn, button.primary, button.secondary');
    
    // Aplicar animaciones a tarjetas de productos
    productCardAnimation('.product-card');
    
    // Animación para entrada de página
    const pageAnimation = animate('.page-container', {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      easing: 'spring(1, 80, 10, 0)',
    });
    
    // Animación para elementos de navegación - aplicar a cada elemento con delay incremental
    const navItems = document.querySelectorAll('nav .nav-item');
    const navAnimations: Array<ReturnType<typeof animate>> = [];
    
    navItems.forEach((item, index) => {
      const anim = animate(item, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        easing: 'spring(1, 80, 10, 0)',
        delay: 100 * index
      });
      navAnimations.push(anim);
    });
    
    // Registrar funciones de limpieza
    cleanupFunctions.current = [
      () => {
        if (pageAnimation && typeof pageAnimation.pause === 'function') {
          pageAnimation.pause();
        }
      },
      ...navAnimations.map(anim => () => {
        if (anim && typeof anim.pause === 'function') {
          anim.pause();
        }
      })
    ];
    
    // Limpiar todas las animaciones al desmontar
    return () => {
      try {
        cleanupFunctions.current.forEach(cleanup => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        });
      } catch (error) {
        console.error('Error al limpiar animaciones en AnimationProvider:', error);
      }
    };
  }, []);
  
  // Proporcionar contexto de animación a los componentes hijos
  return (
    <AnimationContext.Provider value={{ animate }}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationProvider; 