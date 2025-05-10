import React, { useEffect, useRef } from 'react';
import { createAnimationScope } from '@/utils/animations';

interface AnimationWrapperProps {
  children: React.ReactNode;
  animationFunction: (selector: string) => void;
  selector: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  animationFunction,
  selector,
  className = '',
  style = {},
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const scope = createAnimationScope(wrapperRef);
      // Aplicar la animación cuando el componente se monta
      animationFunction(selector);
      
      // Limpiar animaciones al desmontar
      return () => {
        scope.revert();
      };
    }
  }, [animationFunction, selector]);

  return (
    <div ref={wrapperRef} className={className} style={style}>
      {children}
    </div>
  );
};

export default AnimationWrapper; 