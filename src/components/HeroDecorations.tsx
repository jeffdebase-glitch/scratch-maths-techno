import React from 'react';
import { motion } from 'motion/react';
import scratchCatImg from '../assets/images/regenerated_image_1778393185993.png';

export const ScratchBlocks = () => (
  <div className="flex flex-col gap-0.5 -rotate-2">
    <div className="bg-[#FFAB19] text-white text-[9px] font-bold px-2 py-1 rounded-t-md rounded-br-md shadow-sm border-b-2 border-amber-600 flex items-center gap-1.5 transform translate-x-0">
      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
      quand cliqué
    </div>
    <div className="bg-[#4C97FF] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm border-b-2 border-blue-600 flex items-center gap-1.5 transform translate-x-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
      +10
    </div>
    <div className="bg-[#9966FF] text-white text-[9px] font-bold px-2 py-1 rounded-b-md rounded-tr-md shadow-sm border-b-2 border-violet-600 flex items-center justify-between gap-3 transform translate-x-1">
      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
      <span className="text-xs">→</span>
    </div>
  </div>
);

export const MathTiles = () => (
  <div className="flex gap-3 items-center">
    <motion.div 
      initial={{ rotate: -5 }}
      whileHover={{ rotate: 0, y: -3 }}
      className="w-10 h-10 bg-orange-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-lg -rotate-6 border-b-4 border-orange-700"
    >
      π
    </motion.div>
    <motion.div 
      initial={{ rotate: 8 }}
      whileHover={{ rotate: 0, y: -3 }}
      className="w-10 h-10 bg-blue-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-base rotate-12 border-b-4 border-blue-700"
    >
      √x
    </motion.div>
    <motion.div 
      initial={{ rotate: -12 }}
      whileHover={{ rotate: 0, y: -3 }}
      className="w-10 h-10 bg-green-500 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-base -rotate-12 border-b-4 border-green-700"
    >
      {'{ }'}
    </motion.div>
  </div>
);

export const ScratchCat = () => (
  <img 
    src={scratchCatImg} 
    alt="Scratch Cat"
    className="w-24 h-24 lg:w-32 lg:h-32 drop-shadow-xl object-contain" 
  />
);

export const GeometricBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
    <div className="absolute top-10 left-1/4 w-12 h-12 border-2 border-indigo-600 rounded-full rotate-12" />
    <div className="absolute top-40 left-1/3 w-10 h-10 border-2 border-indigo-600 rotate-45" />
    <div className="absolute bottom-20 left-1/2 w-14 h-14 border-2 border-indigo-600 rounded-xl -rotate-12" />
    <svg className="absolute inset-0 w-full h-full">
      <path d="M 0 100 Q 250 50 500 200 T 1000 150 T 1500 250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 15" className="text-indigo-400 opacity-20" />
    </svg>
    {/* Small accents */}
    <div className="absolute top-1/4 right-1/4 text-2xl font-bold text-indigo-400">+</div>
    <div className="absolute bottom-1/3 right-1/3 text-2xl font-bold text-indigo-400">×</div>
    <div className="absolute top-1/2 right-10 text-xl font-bold text-indigo-400">◇</div>
  </div>
);
