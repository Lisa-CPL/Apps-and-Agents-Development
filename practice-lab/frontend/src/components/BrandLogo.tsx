import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', layout = 'horizontal', iconOnly = false }) => {
  const isVertical = layout === 'vertical';
  
  const scale = {
    sm: 0.4,
    md: 0.8,
    lg: 1.2,
    xl: 1.8
  }[size];

  const width = (isVertical || iconOnly) ? 94 : 300;
  const height = isVertical ? 160 : 60;

  return (
    <div className={`${className} flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-4`}>
      <svg 
        width={width * scale} 
        height={height * scale} 
        viewBox={`0 0 ${width} ${height}`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Blue Bubble */}
        <path d="M2 10C2 5.58172 5.58172 2 10 2H38C42.4183 2 46 5.58172 46 10V34C46 38.4183 42.4183 42 38 42H16L6 52V42H10C5.58172 42 2 38.4183 2 34V10Z" fill="#0E4FB4" />
        {/* Red Bubble */}
        <path d="M48 10C48 5.58172 51.5817 2 56 2H84C88.4183 2 92 5.58172 92 10V34C92 38.4183 88.4183 42 84 42H70L60 52V42H56C51.5817 42 48 38.4183 48 34V10Z" fill="#C41E3A" />
        
        {(!isVertical && !iconOnly) && (
          <g>
            <text x="110" y="24" fontFamily="DM Sans, sans-serif" fontWeight="900" fontSize="24" fill="black">CROSSING</text>
            <text x="110" y="48" fontFamily="DM Sans, sans-serif" fontWeight="900" fontSize="24" fill="black">PARTY LINES</text>
          </g>
        )}
      </svg>
      {(isVertical && !iconOnly) && (
        <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-black tracking-tighter text-black leading-none">CROSSING</span>
            <span className="text-2xl font-black tracking-tighter text-black leading-none">PARTY LINES</span>
        </div>
      )}
    </div>
  );
};
