import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { StoryData, Chapter } from '../types';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoryLayoutProps {
  data: StoryData;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

const GrainOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay">
    <svg className='w-full h-full'>
      <filter id='noiseFilter'>
        <feTurbulence 
          type='fractalNoise' 
          baseFrequency='0.8' 
          numOctaves='3' 
          stitchTiles='stitch' 
        />
      </filter>
      <rect width='100%' height='100%' filter='url(#noiseFilter)' />
    </svg>
  </div>
);

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-[#ED2144] origin-left z-[70]"
      style={{ scaleX }}
    />
  );
};

const ScrollIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 1 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-20"
  >
    <span className="text-[10px] uppercase tracking-[0.2em]">Begin Journey</span>
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ArrowDown size={20} />
    </motion.div>
  </motion.div>
);

// Individual Chapter Component to handle InView logic
const ChapterSection = ({ 
  chapter, 
  index, 
  onActive 
}: { 
  chapter: Chapter; 
  index: number; 
  onActive: (i: number) => void 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) onActive(index);
  }, [isInView, index, onActive]);

  const isEven = index % 2 === 0;

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-24 px-6 md:px-12">
      <div className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        
        {/* Text Content */}
        <div className={`lg:col-span-5 ${!isEven ? 'lg:order-2' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#ED2144] font-mono text-xl md:text-2xl font-bold">
                0{index + 1}
              </span>
              <div className="h-[2px] w-12 bg-[#ED2144]" />
            </div>

            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
              {chapter.title}
            </h2>

            <div className="prose prose-invert prose-xl text-gray-200 leading-relaxed">
              <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-5px] whitespace-pre-wrap">
                {chapter.content}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Visual Content */}
        <div className={`lg:col-span-7 ${!isEven ? 'lg:order-1' : ''}`}>
          {chapter.image && (
            <div className="flex flex-col gap-4">
              <motion.div 
                className="relative w-full aspect-[4/3] overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                {/* Curtain Reveal Effect */}
                <motion.div 
                  className="absolute inset-0 bg-[#121212] z-10"
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth cubic bezier
                  style={{ originY: 0 }}
                />
                
                <img 
                  src={chapter.image} 
                  alt={chapter.title}
                  className="w-full h-full object-cover scale-110 grayscale hover:grayscale-0 transition-all duration-1000"
                />
                
                {/* Decorative Border Frame */}
                <div className="absolute inset-4 border border-white/20 pointer-events-none" />
              </motion.div>
              
              {/* Caption */}
              {chapter.caption && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-lg text-gray-400 font-mono text-right italic"
                >
                  {chapter.caption}
                </motion.p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const StoryLayout: React.FC<StoryLayoutProps> = ({ data }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <article className="relative bg-[#121212] text-[#ededed] min-h-screen">
      <GrainOverlay />
      <ProgressBar />

      {/* Navigation Sidebar (Desktop) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-6">
        {data.chapters.map((_, i) => (
          <motion.div 
            key={i}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              const el = document.getElementById(`chapter-${i}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <motion.div 
              className={`h-px bg-white transition-all duration-300 ${activeChapter === i ? 'w-12 bg-[#ED2144]' : 'w-4 opacity-30 group-hover:w-8 group-hover:opacity-60'}`} 
            />
            <span className={`text-[10px] font-mono transition-opacity duration-300 ${activeChapter === i ? 'opacity-100 text-[#ED2144]' : 'opacity-0 group-hover:opacity-100'}`}>
              0{i + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10" />
          <img 
            src={data.heroImage} 
            alt={data.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1 border border-white/30 rounded-full backdrop-blur-md">
              <span className="text-xs font-mono tracking-[0.3em] uppercase">
                {data.country} Journey
              </span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-serif font-bold tracking-tighter mb-8 leading-[0.9]">
              {data.title.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-4 md:mr-8">{word}</span>
              ))}
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-200 font-light italic max-w-2xl mx-auto leading-relaxed">
              "{data.shortDescription}"
            </p>
          </motion.div>
        </motion.div>
        
        <ScrollIndicator />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-32">
        {data.chapters.map((chapter, index) => (
          <div id={`chapter-${index}`} key={index}>
            <ChapterSection 
              chapter={chapter} 
              index={index} 
              onActive={setActiveChapter} 
            />
          </div>
        ))}

        {/* Footer Navigation */}
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mb-8" />
          <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">End of Chapter</h3>
          <Link 
            to="/" 
            className="group flex items-center gap-4 text-3xl md:text-5xl font-serif hover:text-[#ED2144] transition-colors duration-300"
          >
            Return to Map
            <ArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" size={40} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default StoryLayout;