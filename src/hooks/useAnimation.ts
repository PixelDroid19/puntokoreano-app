import { useEffect, useRef } from 'react';
import { animate, createScope } from 'animejs';

type AnimationOptions = Parameters<typeof animate>[1];

export const useAnimation = (
  selector: string | Element | NodeListOf<Element>,
  options: AnimationOptions,
  dependencies: any[] = []
) => {
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        // Crear un scope para las animaciones
        const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
        
        if (el) {
          scopeRef.current = createScope();
          
          scopeRef.current.add((scope: any) => {
            // Ejecutar la animación
            try {
              animationRef.current = animate(selector, options);
              
              // Agregar métodos al scope como funciones
              scope.add('play', () => {
                try {
                  animationRef.current?.play();
                } catch (error) {
                  console.error('Error al reproducir animación:', error);
                }
              });
              
              scope.add('pause', () => {
                try {
                  animationRef.current?.pause();
                } catch (error) {
                  console.error('Error al pausar animación:', error);
                }
              });
              
              scope.add('restart', () => {
                try {
                  animationRef.current?.restart();
                } catch (error) {
                  console.error('Error al reiniciar animación:', error);
                }
              });
            } catch (error) {
              console.error('Error al crear animación:', error);
            }
            
            return scope;
          });
        }
      } catch (error) {
        console.error('Error al configurar animaciones:', error);
      }
    }

    // Limpieza al desmontar
    return () => {
      try {
        // Solo intentar revertir si el scope existe
        if (scopeRef.current && typeof scopeRef.current.revert === 'function') {
          scopeRef.current.revert();
        } else if (animationRef.current && typeof animationRef.current.pause === 'function') {
          // Como alternativa, al menos pausar la animación
          animationRef.current.pause();
        }
      } catch (error) {
        console.error('Error al limpiar animaciones:', error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Métodos expuestos con manejo de errores
  return {
    play: () => {
      try {
        return animationRef.current?.play();
      } catch (error) {
        console.error('Error al reproducir animación:', error);
      }
    },
    pause: () => {
      try {
        return animationRef.current?.pause();
      } catch (error) {
        console.error('Error al pausar animación:', error);
      }
    },
    restart: () => {
      try {
        return animationRef.current?.restart();
      } catch (error) {
        console.error('Error al reiniciar animación:', error);
      }
    },
  };
};

export default useAnimation; 