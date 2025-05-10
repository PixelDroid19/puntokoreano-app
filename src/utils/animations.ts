import { animate, createDraggable, createScope, createSpring } from 'animejs';
import type { AnimationParams } from 'animejs';

// Animación para entradas con fade de elementos
export const fadeInAnimation = (selector: string, delay: number = 0) => {
  return animate(selector, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'spring(1, 80, 10, 0)',
    delay,
  });
};

// Animación para botones hover
export const createButtonAnimation = (selector: string) => {
  // Aplicar efecto de escala suave en hover
  try {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        animate(element, {
          scale: 1.05,
          duration: 300,
          easing: 'spring(1, 80, 10, 0)',
        });
      });
      
      element.addEventListener('mouseleave', () => {
        animate(element, {
          scale: 1,
          duration: 300,
          easing: 'spring(1, 80, 10, 0)',
        });
      });
    });
  } catch (error) {
    console.error('Error al crear animaciones de botón:', error);
  }
};

// Animación para imágenes en carruseles
export const imageRevealAnimation = (selector: string, staggerDelay: number = 100) => {
  // Versión manual de stagger - aplicar a cada elemento con un retraso incremental
  try {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      animate(element, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        easing: 'spring(1, 80, 10, 0)',
        delay: index * staggerDelay
      });
    });
  } catch (error) {
    console.error('Error al crear animaciones de revelación de imágenes:', error);
  }
};

// Animación para tarjetas de productos
export const productCardAnimation = (selector: string) => {
  try {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        animate(element, {
          translateY: -8,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          duration: 400,
          easing: 'spring(1, 80, 10, 0)',
        });
      });
      
      element.addEventListener('mouseleave', () => {
        animate(element, {
          translateY: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          duration: 400,
          easing: 'spring(1, 80, 10, 0)',
        });
      });
    });
  } catch (error) {
    console.error('Error al crear animaciones de tarjetas de producto:', error);
  }
};

// Animación para notificaciones o alertas
export const notificationAnimation = (selector: string) => {
  return animate(selector, {
    scale: [0.5, 1.05, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'spring(1, 80, 10, 0)',
  });
};

// Animación para banners o secciones destacadas
export const bannerAnimation = (selector: string) => {
  return animate(selector, {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'spring(1, 90, 7, 0)',
  });
};

// Animación para logos o elementos de marca
export const logoAnimation = (selector: string) => {
  return animate(selector, {
    rotateY: [90, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'spring(1, 80, 10, 0)',
  });
};

// Animación para contador (útil en carrito de compras)
export const counterAnimation = (selector: string) => {
  return animate(selector, {
    scale: [0.5, 1.2, 1],
    duration: 600,
    easing: 'spring(1, 80, 10, 0)',
  });
};

// Crear scope para animaciones con manejo de errores mejorado
export const createAnimationScope = (rootRef: React.RefObject<HTMLElement>) => {
  try {
    if (!rootRef.current) {
      console.warn('La referencia del elemento raíz no está disponible');
      return {
        add: () => ({}),
        revert: () => {}
      };
    }
    
    return createScope({ root: rootRef }).add((scope: any) => {
      // Sobrescribir el método revert para hacerlo más seguro
      const originalRevert = scope.revert;
      scope.revert = () => {
        try {
          if (typeof originalRevert === 'function') {
            originalRevert.call(scope);
          }
        } catch (error) {
          console.error('Error durante la limpieza de animaciones:', error);
        }
      };
      
      return scope;
    });
  } catch (error) {
    console.error('Error al crear scope de animación:', error);
    return {
      add: () => ({}),
      revert: () => {}
    };
  }
}; 