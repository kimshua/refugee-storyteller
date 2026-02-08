import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { STORIES } from '../constants';
import { ArrowRight } from 'lucide-react';

const StorySelector: React.FC = () => {
  // Memoize the sorted list to ensure stable rendering (Alphabetical Order)
  const sortedStories = useMemo(() => {
    return [...STORIES].sort((a, b) => a.country.localeCompare(b.country));
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation Effect
  useEffect(() => {
    // Don't rotate if user is hovering
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sortedStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, sortedStories.length]);

  return (
    <div 
      className="w-full h-[600px] flex flex-col md:flex-row gap-2 px-2 md:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {sortedStories.map((story, index) => {
        const isActive = activeIndex === index;

        return (
          <Link
            key={story.id}
            to={`/story/${story.id}`}
            onMouseEnter={() => setActiveIndex(index)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-500 ease-in-out"
            // Smoothly animate flex-grow and opacity changes
            style={{ 
              flex: isActive ? 3.5 : 0.5,
              opacity: isPaused && !isActive ? 0.6 : 1
            }}
          >
            {/* Active Indicator / Timer Bar */}
            {isActive && (
              <motion.div
                key={`${story.id}-${isPaused ? 'paused' : 'running'}`}
                className="absolute top-0 left-0 h-1.5 bg-[#ED2144] z-50"
                initial={{ width: isPaused ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: isPaused ? 0 : 5, ease: "linear" }}
              />
            )}

            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={story.heroImage}
                alt={story.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-100 grayscale-0' : 'scale-150 grayscale contrast-125'}`}
              />
              {/* Overlays */}
              <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-black/20' : 'bg-black/60'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            </div>

            {/* Vertical Label (Collapsed State) */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <h3 className="text-xl md:text-3xl font-serif font-bold text-white/50 uppercase tracking-widest whitespace-nowrap rotate-90 md:-rotate-90">
                {story.country}
              </h3>
            </div>

            {/* Expanded Content */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col justify-end h-full transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <motion.div
                initial={false}
                animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#ED2144] bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  {story.country}
                </span>
                
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  {story.title}
                </h2>
                
                <p className="text-sm md:text-lg text-gray-200 font-light max-w-lg mb-8 line-clamp-3 md:line-clamp-none">
                  {story.shortDescription}
                </p>

                <div className="flex items-center gap-3 text-sm font-medium tracking-wide group-hover:gap-6 transition-all duration-300">
                  <span className="border-b border-transparent group-hover:border-white transition-colors">Read Story</span>
                  <div className="bg-white text-black rounded-full p-2">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default StorySelector;