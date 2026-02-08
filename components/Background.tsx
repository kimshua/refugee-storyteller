import React from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0], 
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -70, 0], 
          y: [0, 100, 0], 
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" 
      />

      {/* Particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full w-1 h-1"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>
      
      {/* Light Beam Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};

export default Background;