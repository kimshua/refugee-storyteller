import React from 'react';
import { motion } from 'framer-motion';

// REPLACE THIS WITH YOUR OWN IMAGE URL
// If you have a local file, you can put it in your public folder and use "/my-image.jpg"
const AUTHOR_IMAGE = "https://www.dropbox.com/scl/fi/wf29hbjoftwn0u56jfakw/DSC08821.jpg?rlkey=uqwx2c5j6f6e2fnojupmrv4oy&st=5jbuny75&raw=1";

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 px-6 max-w-3xl mx-auto flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
          About
        </h1>
        
        <div className="space-y-8 text-lg text-gray-400 font-light leading-relaxed">
          <p>
            <strong className="text-white font-medium">Refugee Storyteller</strong> is a digital experiment designed to humanize the statistics. 
            Too often, refugees are reduced to numbers or geopolitical talking points. 
            This project aims to use interactive web technologies to give weight, texture, and voice to their journeys.
          </p>
          
          <div className="p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm flex flex-col md:flex-row gap-8 items-start">
            
            {/* Author Image Section */}
            <div className="w-full md:w-1/3 shrink-0">
               <div className="aspect-square bg-white/5 rounded-lg border border-white/10 overflow-hidden relative group">
                  <img 
                    src={AUTHOR_IMAGE} 
                    alt="Author" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
               </div>
            </div>

            {/* Author Info */}
            <div className="flex-1">
                <h3 className="text-xl text-white font-serif mb-4">The Author</h3>
                <p className="mb-4 text-sm md:text-base">
                I am a digital designer and human rights advocate based in Seoul. 
                My work focuses on the intersection of technology and empathy.
                </p>
                <p className="text-xs font-mono text-gray-500">
                Stack: React, TypeScript, Tailwind, Framer Motion.
                </p>
            </div>
          </div>

          <p>
            The stories depicted from North Korea, Afghanistan, Myanmar, Ukraine, and Syria represent real challenges faced by these communities in South Korea today. From the identity crisis of defectors to the legal limbo of asylum seekers.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;