import React from 'react';

interface GarudXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'gradient' | 'dark';
  animated?: boolean;
  showText?: boolean;
}

const GarudXLogo: React.FC<GarudXLogoProps> = ({ 
  size = 'md', 
  variant = 'primary', 
  animated = false,
  showText = false 
}) => {
  // Size configurations
  const sizes = {
    sm: { 
      container: 'w-8 h-8', 
      text: 'text-lg',
      logoScale: '0.7'
    },
    md: { 
      container: 'w-12 h-12', 
      text: 'text-xl',
      logoScale: '1'
    },
    lg: { 
      container: 'w-16 h-16', 
      text: 'text-2xl',
      logoScale: '1.2'
    },
    xl: { 
      container: 'w-20 h-20', 
      text: 'text-3xl',
      logoScale: '1.5'
    }
  };

  // Color variants
  const variants = {
    primary: {
      bg: 'bg-gradient-to-br from-green-600 via-green-500 to-emerald-600',
      wing: 'fill-white',
      cross: 'fill-white',
      glow: 'shadow-green-400/30',
      text: 'text-green-600'
    },
    white: {
      bg: 'bg-white border-2 border-green-200',
      wing: 'fill-green-600',
      cross: 'fill-green-600',
      glow: 'shadow-gray-200/50',
      text: 'text-green-600'
    },
    gradient: {
      bg: 'bg-gradient-to-br from-green-500 via-blue-500 to-purple-600',
      wing: 'fill-white',
      cross: 'fill-white',
      glow: 'shadow-purple-400/30',
      text: 'text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text'
    },
    dark: {
      bg: 'bg-gray-900 border border-gray-700',
      wing: 'fill-green-400',
      cross: 'fill-green-400',
      glow: 'shadow-gray-800/50',
      text: 'text-gray-100'
    }
  };

  const sizeConfig = sizes[size];
  const variantConfig = variants[variant];

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Container */}
      <div 
        className={`
          ${sizeConfig.container} 
          ${variantConfig.bg} 
          rounded-2xl 
          flex items-center justify-center 
          shadow-lg ${variantConfig.glow} 
          ${animated ? 'transform transition-all duration-300 hover:scale-110 hover:rotate-3' : ''}
          relative overflow-hidden
        `}
      >
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-2xl"></div>
        
        {/* Custom Medical Eagle Logo */}
        <div className="relative z-10" style={{ transform: `scale(${sizeConfig.logoScale})` }}>
          <svg 
            viewBox="0 0 40 40" 
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Eagle Wings */}
            <g className={variantConfig.wing}>
              {/* Left Wing */}
              <path 
                d="M8 18c-2 1-4 3-4 6 0 2 1 3 3 3 1 0 2-1 4-2 2-1 4-2 5-4 1-2 0-3-1-4-1-1-3-1-5 0-1 0-2 1-2 1z"
                className="drop-shadow-sm"
              />
              {/* Right Wing */}
              <path 
                d="M32 18c2 1 4 3 4 6 0 2-1 3-3 3-1 0-2-1-4-2-2-1-4-2-5-4-1-2 0-3 1-4 1-1 3-1 5 0 1 0 2 1 2 1z"
                className="drop-shadow-sm"
              />
              {/* Eagle Body */}
              <ellipse cx="20" cy="20" rx="3" ry="8" className="drop-shadow-sm"/>
              {/* Eagle Head */}
              <circle cx="20" cy="14" r="3" className="drop-shadow-sm"/>
              {/* Eagle Beak */}
              <path d="M20 11l-1 2h2z" className="drop-shadow-sm"/>
            </g>
            
            {/* Medical Cross - Integrated into the eagle */}
            <g className={variantConfig.cross}>
              {/* Vertical bar of cross */}
              <rect x="19" y="16" width="2" height="8" rx="1" className="drop-shadow-sm"/>
              {/* Horizontal bar of cross */}
              <rect x="16" y="19" width="8" height="2" rx="1" className="drop-shadow-sm"/>
            </g>

            {/* Subtle inner glow */}
            <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
          </svg>
        </div>

        {/* Pulse animation for active states */}
        {animated && (
          <div className="absolute inset-0 rounded-2xl animate-pulse bg-white/10"></div>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizeConfig.text} ${variantConfig.text} leading-tight`}>
            GarudX
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-xs text-gray-500 font-medium tracking-wide">
              Healthcare Platform
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GarudXLogo;
