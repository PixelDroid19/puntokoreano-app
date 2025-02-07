interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, ...props }) => {
  return (
    <div className="w-full relative" {...props}>
      <div className="w-full h-20 relative bg-[#922EC2]">
        {/* Franja naranja izquierda */}
        <div 
          className="absolute top-0 left-0 h-full w-[4%]"
          style={{
            background: '#F57615',
            transform: 'skew(-20deg)',
            transformOrigin: 'top left',
          }}
        />
        
        {/* Franja rosa/roja */}
        <div 
          className="absolute top-0 right-0 h-full"
          style={{
            background: '#722FA7',
            width: '4%',
            transform: 'skew(-20deg)',
            transformOrigin: 'top right',
            marginRight: '-2.1%',
          }}
        />
        
        {/* Franja naranja derecha */}
        <div 
          className="absolute top-0 right-0 h-full"
          style={{
            background: '#EC0382',
            width: '4%',
            transform: 'skew(-20deg)',
            transformOrigin: 'top right',
            marginRight: '-6%',
          }}
        />

         {/* Franja naranja derecha */}
         <div 
          className="absolute top-0 right-0 h-full"
          style={{
            background: '#FAB21F',
            width: '4%',
            transform: 'skew(-20deg)',
            transformOrigin: 'top right',
            marginRight: '-9.5%',
          }}
        />

        {/* Contenedor del título */}
        <div className="max-w-[1320px] mx-auto h-full">
          <h2 className="flex items-center justify-center h-full text-2xl text-white font-bold uppercase lg:text-4xl font-glegoo">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;