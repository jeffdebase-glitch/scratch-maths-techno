import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Info, Filter, ExternalLink, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EXERCISES } from './constants';
import { ExerciseCard } from './components/ExerciseCard';
import { Difficulty, Exercise } from './types';
import { ScratchBlocks, MathTiles, ScratchCat, GeometricBackground } from './components/HeroDecorations';

export default function App() {
  const [filter, setFilter] = useState<Difficulty | 'Tous'>('Tous');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const featuredExercises = EXERCISES;
  const filteredExercises = filter === 'Tous' 
    ? EXERCISES 
    : EXERCISES.filter(ex => ex.difficulty === filter);

  const [visibleCards, setVisibleCards] = useState(4);
  const scrollStep = 3;

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(4);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const maxCarouselIndex = Math.max(0, featuredExercises.length - visibleCards);

  // Clamp carousel index when visibleCards changes
  useEffect(() => {
    if (carouselIndex > maxCarouselIndex) {
      setCarouselIndex(maxCarouselIndex);
    }
  }, [visibleCards, maxCarouselIndex]);

  const nextSlide = () => {
    setCarouselIndex((prev) => {
      if (prev >= maxCarouselIndex) return 0;
      const next = prev + scrollStep;
      return Math.min(next, maxCarouselIndex);
    });
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => {
      if (prev <= 0) return maxCarouselIndex;
      const next = prev - scrollStep;
      return Math.max(next, 0);
    });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans pb-20 bg-[#F6F8FC]">
      {/* HEADER / HERO */}
      <header className="relative pt-4 pb-6 lg:pb-8 px-6 max-w-7xl mx-auto overflow-hidden">
        <GeometricBackground />
        
        {/* Top bar with buttons */}
        <div className="flex justify-end gap-2 mb-4 relative z-20">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all group">
            <HelpCircle size={14} className="group-hover:scale-110 transition-transform" />
            Aide
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all group">
            <Info size={14} className="group-hover:scale-110 transition-transform" />
            À propos
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 relative z-10">
          {/* Left Decor Section - Scratch Blocks */}
          <div className="flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700 hidden lg:block">
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50 shadow-sm">
              <ScratchBlocks />
            </div>
          </div>
          
          {/* Center Content Section */}
          <div className="flex-1 text-center lg:text-left px-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-2"
            >
              Scratch <span className="text-indigo-600">Maths</span> <span className="text-blue-500">Techno</span> : <br className="hidden xl:block" />
              <span className="text-indigo-600">en route vers le brevet</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex flex-col sm:flex-row items-center gap-4 text-base lg:text-lg text-slate-500 font-medium"
            >
              <div className="w-12 h-1 bg-indigo-500 rounded-full hidden lg:block" />
              Programmer avec Scratch pour résoudre des défis de maths
            </motion.div>

            {/* Math Tiles around title area for desktop */}
            <div className="mt-4 lg:hidden flex justify-center">
              <MathTiles />
            </div>
          </div>

          {/* Right Mascot Section */}
          <div className="relative flex-shrink-0">
             <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
             <div className="hidden lg:block absolute -top-12 -left-10">
               <MathTiles />
             </div>
             <motion.div
               animate={{ 
                 y: [0, -5, 0],
                 rotate: [0, 1, 0]
               }}
               transition={{ 
                 duration: 4, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
             >
               <ScratchCat />
             </motion.div>
          </div>
        </div>
      </header>


      {/* BANDEAU ÉTAPES */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-4 flex flex-wrap lg:flex-nowrap justify-between items-center shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">1</span>
            <span className="text-slate-600 font-semibold text-sm">Choisis un exercice</span>
          </div>
          <div className="hidden lg:block h-px flex-1 max-w-[40px] bg-slate-200" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</span>
            <span className="text-slate-600 font-semibold text-sm">Lance l’activité</span>
          </div>
          <div className="hidden lg:block h-px flex-1 max-w-[40px] bg-slate-200" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">3</span>
            <span className="text-slate-600 font-semibold text-sm">Scratch s'ouvre</span>
          </div>
          <div className="hidden lg:block h-px flex-1 max-w-[40px] bg-slate-200" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">4</span>
            <span className="text-slate-600 font-bold text-sm uppercase tracking-tight">Réalise le défi !</span>
          </div>
        </div>
      </section>

      {/* SECTION CARROUSEL "EXERCICES À LA UNE" */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center text-slate-800">
              <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3" />
              Exercices à la une
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={prevSlide}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={nextSlide}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden py-4 -my-4">
            <div 
              className="flex transition-transform duration-500 ease-out" 
              style={{ 
                transform: `translateX(-${(carouselIndex / featuredExercises.length) * 100}%)`,
                width: `${(featuredExercises.length / visibleCards) * 100}%`
              }}
            >
              {featuredExercises.map((ex) => (
                <div 
                  key={ex.id} 
                  className="px-2 flex-shrink-0" 
                  style={{ width: `${(100 / featuredExercises.length)}%` }}
                >
                  <ExerciseCard exercise={ex} variant="featured" onClick={setSelectedExercise} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(maxCarouselIndex / scrollStep) + 1 }).map((_, i) => {
              const stepIndex = Math.min(i * scrollStep, maxCarouselIndex);
              const isActive = Math.abs(carouselIndex - stepIndex) < scrollStep / 2 || 
                             (i === Math.ceil(maxCarouselIndex / scrollStep) && carouselIndex === maxCarouselIndex);
              
              return (
                <button 
                  key={i} 
                  onClick={() => setCarouselIndex(stepIndex)}
                  className={`h-2 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                  aria-label={`Aller à l'étape ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION "TOUS LES EXERCICES" */}
      <section className="px-6" id="all-exercises">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Filter size={20} />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-slate-900">Tous les exercices</h2>
            </div>
            
            <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
              {(['Tous', 'Facile', 'Moyen', 'Difficile'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                    filter === lvl 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-500 hover:bg-white/50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredExercises.map((ex) => (
                <motion.div
                  key={ex.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExerciseCard exercise={ex} variant="compact" onClick={setSelectedExercise} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredExercises.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full text-slate-300 mb-4">
                <Filter size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Aucun exercice trouvé</h3>
              <p className="text-slate-500">Essaie de changer les filtres pour voir d'autres défis.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 px-6 relative">
        <div className="max-w-7xl mx-auto py-12 border-t border-slate-100 text-center">
          <p className="text-slate-400 font-medium text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Tu peux revenir sur cette page à tout moment pour choisir un autre défi.</span>
            <span className="hidden sm:inline opacity-30 text-xs">•</span>
            <span className="opacity-80">CASULLI-Technologie- Collège la Courtille</span>
          </p>
        </div>
      </footer>

      {/* MODAL POPUP - INSTRUCTION AVANT OUVERTURE */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <Info size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  Avant de commencer...
                </h3>
                
                <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed">
                  Pense à cliquer sur <strong className="text-slate-800 font-extrabold">VOIR À L'INTÉRIEUR</strong> en haut à droite pour pouvoir modifier le programme et relever le défi !
                </p>

                {/* VISUAL INDICATION TRICK - Fake Scratch Toolbar */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 relative">
                  <div className="absolute -top-3 -right-3 md:-right-6 md:-top-6 animate-bounce pointer-events-none">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-center justify-between opacity-80 pointer-events-none px-2 h-10 w-full mb-2">
                     <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                        <div className="w-32 h-6 rounded bg-slate-200"></div>
                     </div>
                     <div className="flex items-center justify-center gap-2 rounded-md bg-[#855CD6] text-white px-3 py-1.5 shadow-[0_4px_0_0_#4C3088] ring-4 ring-red-400 ring-opacity-50">
                        <RefreshCw size={14} className="rotate-180" />
                        <span className="text-xs font-bold font-sans">Voir à l'intérieur</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      if (selectedExercise) {
                        window.open(selectedExercise.url, '_blank', 'noopener,noreferrer');
                        setSelectedExercise(null);
                      }
                    }}
                    className="flex-1 bg-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                  >
                    <span>Continuer vers Scratch</span>
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
