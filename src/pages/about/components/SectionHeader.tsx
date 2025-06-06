import React, { memo, useMemo } from 'react';

interface SectionHeaderProps {
  title: string;
}

// Componente de franja memoizado
const ColorStripe = memo<{
  background: string;
  width: string;
  marginRight?: string;
  position: 'left' | 'right';
}>(({ background, width, marginRight, position }) => {
  const stripeStyles = useMemo(() => ({
    background,
    width,
    transform: 'skew(-20deg)',
    transformOrigin: position === 'left' ? 'top left' : 'top right',
    ...(marginRight && { marginRight }),
  }), [background, width, marginRight, position]);

  const positionClasses = position === 'left' 
    ? 'absolute top-0 left-0 h-full' 
    : 'absolute top-0 right-0 h-full';

  return (
    <div 
      className={positionClasses}
      style={stripeStyles}
    />
  );
});

ColorStripe.displayName = "ColorStripe";

// Componente principal memoizado
const SectionHeader = memo<SectionHeaderProps>(({ title, ...props }) => {
  // Memoizar las configuraciones de las franjas
  const stripes = useMemo(() => [
    {
      id: 'left-orange',
      background: '#F57615',
      width: '4%',
      position: 'left' as const,
    },
    {
      id: 'right-purple',
      background: '#722FA7',
      width: '4%',
      position: 'right' as const,
      marginRight: '-2.1%',
    },
    {
      id: 'right-pink',
      background: '#EC0382',
      width: '4%',
      position: 'right' as const,
      marginRight: '-6%',
    },
    {
      id: 'right-yellow',
      background: '#FAB21F',
      width: '4%',
      position: 'right' as const,
      marginRight: '-9.5%',
    },
  ], []);

  // Memoizar el estilo del contenedor principal
  const containerStyles = useMemo(() => ({
    background: '#922EC2',
  }), []);

  return (
    <div className="w-full relative" {...props}>
      <div 
        className="w-full h-20 relative"
        style={containerStyles}
      >
        {/* Renderizar franjas */}
        {stripes.map((stripe) => (
          <ColorStripe
            key={stripe.id}
            background={stripe.background}
            width={stripe.width}
            position={stripe.position}
            marginRight={stripe.marginRight}
          />
        ))}

        {/* Contenedor del título */}
        <div className="max-w-[1320px] mx-auto h-full">
          <h2 className="flex items-center justify-center h-full text-2xl text-white font-bold uppercase lg:text-4xl font-glegoo">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;