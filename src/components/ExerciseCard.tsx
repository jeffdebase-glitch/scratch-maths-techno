import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Exercise } from '../types';
import { GeometricThumbnail } from './GeometricThumbnail';

interface Props {
  exercise: Exercise;
  variant?: 'featured' | 'compact';
  onClick?: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<Props> = ({ exercise, variant = 'compact', onClick }) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Facile': return 'text-green-600 bg-green-50 border-green-100';
      case 'Moyen': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Difficile': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getDifficultyDot = (level: string) => {
    switch (level) {
      case 'Facile': return 'bg-green-500';
      case 'Moyen': return 'bg-amber-500';
      case 'Difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (variant === 'featured') {
    return (
      <div
        onClick={() => onClick?.(exercise)}
        className="h-full bg-white rounded-2xl p-4 flex flex-col relative border border-slate-100 transition-all duration-300 featured-card group hover:-translate-y-1 hover:shadow-xl hover:border-indigo-100 cursor-pointer"
      >
        <span className="absolute top-3 left-3 bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md z-20">
          {exercise.id}
        </span>
        
        <div className="mt-4 flex-shrink-0">
          <GeometricThumbnail type={exercise.thumbnailDescription} className="rounded-xl group-hover:scale-[1.02] transition-transform duration-300" />
        </div>

        <h3 className="mt-3 font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {exercise.title}
        </h3>

        <div className="flex justify-between items-center mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${exercise.difficulty === 'Facile' ? 'text-green-600' : exercise.difficulty === 'Moyen' ? 'text-amber-600' : 'text-red-600'}`}>
            {exercise.difficulty}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < exercise.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
        </div>

        <button
          className="mt-4 w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-2 group-hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <span>Lancer l'activité</span>
          <ExternalLink size={12} strokeWidth={3} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(exercise)}
      className="bg-white rounded-xl border border-slate-100 p-2 flex flex-col items-center justify-center transition-all duration-300 text-center space-y-1 relative group hover:scale-[1.03] hover:border-indigo-200 hover:shadow-md cursor-pointer"
    >
      <span className="absolute top-1 left-1 text-[8px] font-black text-indigo-300">
        {exercise.id}
      </span>
      <div className="w-full">
         <GeometricThumbnail type={exercise.thumbnailDescription} className="w-10 h-8 mx-auto rounded-sm group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="text-[10px] font-bold text-slate-700 truncate w-full group-hover:text-indigo-600 transition-colors">
        {exercise.title}
      </div>
      <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <Star key={i} size={8} className={i < exercise.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
        ))}
      </div>
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <ExternalLink size={10} className="text-indigo-400" strokeWidth={3} />
      </div>
    </div>
  );
};
