import React from 'react';
import { motion } from 'framer-motion';
import StorySelector from '../components/StorySelector';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col">
      
      {/* Intro Hook */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mt-8 md:mt-16 mb-16 md:mb-24"
      >
        <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter text-white mb-6">
          Voices from afar.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
          Select a journey below to step into their world. That I saw.
        </p>
      </motion.section>

      {/* Story Selector Section */}
      <motion.section 
        className="w-full flex-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <StorySelector />
        
        <div className="mt-8 text-center text-xs text-gray-600 font-mono uppercase tracking-widest">
           Five Stories • One Destination
        </div>
      </motion.section>

    </div>
  );
};

export default Home;