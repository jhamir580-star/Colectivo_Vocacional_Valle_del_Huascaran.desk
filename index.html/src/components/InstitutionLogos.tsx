import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

// Helper to resolve public logo assets cleanly in any hosting environment
// (root domain, GitHub Pages subpaths e.g. /repo-name/, localhost, and preview containers)
export const getLogoUrl = (filename: string): string => {
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}logos/${filename}`;
};

// Reusable Safe Image with fallback to clean institutional typography badge if load fails
const SafeLogoImage = ({
  src,
  alt,
  fallbackText,
  fallbackColor = '#0f766e',
  className = 'w-full h-full object-contain'
}: {
  src: string;
  alt: string;
  fallbackText: string;
  fallbackColor?: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center rounded-lg text-white font-extrabold text-[10px] sm:text-xs text-center p-0.5 leading-none shadow-xs select-none"
        style={{ backgroundColor: fallbackColor }}
      >
        <span>{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

// 1. UNI - Universidad Nacional de Ingeniería (Logo Original Oficial)
export const UniLogo = ({ className = 'w-12 h-12', alt = 'Universidad Nacional de Ingeniería (UNI)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('uni.png')} 
      alt={alt} 
      fallbackText="UNI"
      fallbackColor="#800020"
    />
  </div>
);

// 2. UNMSM - Universidad Nacional Mayor de San Marcos (Escudo Oficial Original)
export const UnmsmLogo = ({ className = 'w-12 h-12', alt = 'Universidad Nacional Mayor de San Marcos (UNMSM)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('unmsm.svg')} 
      alt={alt} 
      fallbackText="UNMSM"
      fallbackColor="#0c2340"
    />
  </div>
);

// 3. UCS - Universidad Científica del Sur (Logo Original Oficial)
export const UcsLogo = ({ className = 'w-12 h-12', alt = 'Universidad Científica del Sur (UCS)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('ucsur.png')} 
      alt={alt} 
      fallbackText="UCS"
      fallbackColor="#002b49"
    />
  </div>
);

// 4. UNASAM - Universidad Nacional Santiago Antúnez de Mayolo (Huaraz - Escudo Oficial Original)
export const UnasamLogo = ({ className = 'w-12 h-12', alt = 'Universidad Nacional Santiago Antúnez de Mayolo (UNASAM)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('unasam_emblem.png')} 
      alt={alt} 
      fallbackText="UNASAM"
      fallbackColor="#0a3d62"
    />
  </div>
);

// 5. UCV - Universidad César Vallejo (Escudo Original Oficial)
export const UcvLogo = ({ className = 'w-12 h-12', alt = 'Universidad César Vallejo (UCV)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('ucv_shield.png')} 
      alt={alt} 
      fallbackText="UCV"
      fallbackColor="#c8102e"
    />
  </div>
);

// 6. FFAA - Fuerzas Armadas del Perú (Emblema Oficial Comando Conjunto CCFFAA)
export const FfaaLogo = ({ className = 'w-12 h-12', alt = 'Fuerzas Armadas del Perú (CCFFAA)' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('ffaa_emblem.svg')} 
      alt={alt} 
      fallbackText="FFAA"
      fallbackColor="#166534"
    />
  </div>
);

// 7. SENATI - Servicio Nacional de Adiestramiento en Trabajo Industrial (Logo Oficial Original)
export const SenatiLogo = ({ className = 'w-12 h-12', alt = 'SENATI' }: LogoProps) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200/80 p-1.5 shrink-0 overflow-hidden ${className}`}>
    <SafeLogoImage 
      src={getLogoUrl('senati.svg')} 
      alt={alt} 
      fallbackText="SENATI"
      fallbackColor="#003a70"
    />
  </div>
);

// Master Logo Switcher Component
export const InstitutionLogo = ({ id, className }: { id: string; className?: string }) => {
  switch (id.toUpperCase()) {
    case 'UNI':
      return <UniLogo className={className} />;
    case 'UNMSM':
      return <UnmsmLogo className={className} />;
    case 'UCS':
      return <UcsLogo className={className} />;
    case 'UNASAM':
      return <UnasamLogo className={className} />;
    case 'UCV':
      return <UcvLogo className={className} />;
    case 'FFAA':
      return <FfaaLogo className={className} />;
    case 'SENATI':
      return <SenatiLogo className={className} />;
    default:
      return <UnasamLogo className={className} />;
  }
};
