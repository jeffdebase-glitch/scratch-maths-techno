import React from 'react';

interface Props {
  type: string;
  className?: string;
}

export const GeometricThumbnail: React.FC<Props> = ({ type, className = '' }) => {
  return (
    <div className={`relative aspect-[4/3] bg-white border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center grid-paper ${className}`}>
      <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] relative z-10 drop-shadow-sm">
        <g stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {type === 'carré' && (
            <rect x="20" y="20" width="60" height="60" />
          )}
          {type === 'triangle' && (
            <path d="M 50 15 L 85 75 L 15 75 Z" />
          )}
          {type === 'pentagone' && (
            <path d="M 50 15 L 83 40 L 71 78 L 29 78 L 17 40 Z" />
          )}
          {type === 'hexagone' && (
            <path d="M 50 15 L 80 32 L 80 68 L 50 85 L 20 68 L 20 32 Z" />
          )}
          {type === 'octogone' && (
            <path d="M 35 15 L 65 15 L 85 35 L 85 65 L 65 85 L 35 85 L 15 65 L 15 35 Z" />
          )}
          {type === 'décagone' && (
            <path d="M 50 10 L 69 16 L 82 32 L 86 52 L 79 71 L 62 84 L 38 84 L 21 71 L 14 52 L 18 32 L 31 16 Z" />
          )}
          {type === 'escaliers' && (
            <path d="M 15 85 L 15 70 L 30 70 L 30 55 L 45 55 L 45 40 L 60 40 L 60 25 L 75 25 L 75 10" />
          )}
          {type === 'créneaux' && (
            <path d="M 10 50 L 25 50 L 25 25 L 40 25 L 40 50 L 55 50 L 55 25 L 70 25 L 70 50 L 85 50" />
          )}
          {type === 'triples_créneaux' && (
            <path d="M 10 60 L 20 60 L 20 30 L 30 30 L 30 60 L 40 60 L 40 30 L 50 30 L 50 60 L 60 60 L 60 30 L 70 30 L 70 60 L 80 60" />
          )}
          {type === 'croix' && (
            <path d="M 40 15 L 60 15 L 60 40 L 85 40 L 85 60 L 60 60 L 60 85 L 40 85 L 40 60 L 15 60 L 15 40 L 40 40 Z" />
          )}
          {type === 'spirale_carrée_1' && (
            <path d="M 50 50 L 60 50 L 60 40 L 40 40 L 40 60 L 70 60 L 70 30 L 30 30 L 30 70 L 80 70" />
          )}
          {type === 'spirale_carrée_2' && (
            <path d="M 50 50 L 55 50 L 55 45 L 45 45 L 45 55 L 60 55 L 60 40 L 40 40 L 40 60 L 65 60 L 65 35 L 35 35 L 35 65 L 70 65 L 70 30 L 30 30" />
          )}
          {type === 'spirale_triangulaire' && (
            <path d="M 50 60 L 40 75 L 60 75 L 50 55 L 30 85 L 70 85 L 50 45 L 20 95 L 80 95" />
          )}
          {type === 'spirale_pentagonale' && (
            <path d="M 50 55 L 60 60 L 55 70 L 45 70 L 40 60 L 50 45 L 70 55 L 65 75 L 35 75 L 30 55 L 50 35 L 80 50" />
          )}
          {type === 'triangles_imbriqués' && (
            <g>
              <path d="M 50 20 L 80 75 L 20 75 Z" />
              <path d="M 50 40 L 65 65 L 35 65 Z" />
              <path d="M 50 55 L 55 60 L 45 60 Z" />
            </g>
          )}
          {type === 'hexagone_diagonales' && (
            <g>
              <path d="M 50 15 L 80 32 L 80 68 L 50 85 L 20 68 L 20 32 Z" />
              <path d="M 50 15 L 50 85" />
              <path d="M 80 32 L 20 68" />
              <path d="M 80 68 L 20 32" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
