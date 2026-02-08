import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { STORIES } from '../constants';

const DEFAULT_THEME: string | null = null; // Audio plays only on story pages
const BASE_VOLUME = 0.5; 
const FADE_DURATION = 1500; // ms
const FADE_INTERVAL = 50; // ms

const AudioPlayer: React.FC = () => {
  // Start unmuted as requested. Note: Browsers may block autoplay if unmuted without interaction.
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const location = useLocation();

  const isAboutPage = location.pathname === '/about';

  // 1. Determine Target Source
  const targetSrc = useMemo(() => {
    if (isAboutPage) return null;
    
    if (location.pathname.startsWith('/story/')) {
      const storyId = location.pathname.split('/').pop();
      const story = STORIES.find(s => s.id === storyId);
      if (story && story.audioUrl) {
        return story.audioUrl;
      }
    }
    return DEFAULT_THEME;
  }, [location.pathname, isAboutPage]);

  // 2. Volume Fading Helper
  const fadeTo = (targetVol: number) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = FADE_DURATION / FADE_INTERVAL;
    
    fadeIntervalRef.current = window.setInterval(() => {
      setVolume((prevVol) => {
        const diff = targetVol - prevVol;
        if (Math.abs(diff) < 0.01) {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            return targetVol;
        }
        
        const stepValue = diff / (steps * 0.8);
        let newVol = prevVol + stepValue;
        
        // Prevent overshoot
        if ((stepValue > 0 && newVol > targetVol) || (stepValue < 0 && newVol < targetVol)) {
            newVol = targetVol;
        }
        
        return Math.max(0, Math.min(1, newVol));
      });
    }, FADE_INTERVAL);
  };

  // 3. Sync Volume to Audio Element
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  // 4. Handle Source Changes & Playback
  useEffect(() => {
    if (audioRef.current) {
        if (targetSrc) {
            // Try to play whenever source changes
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay prevented by browser policy - expected behavior
                });
            }
            // If we are not muted, fade in to base volume
            if (!isMuted) {
                fadeTo(BASE_VOLUME);
            }
        } else {
            // Fade out if no source (e.g. About page)
            fadeTo(0);
        }
    }
  }, [targetSrc]);

  // 5. Handle Mute Toggle
  const toggleMute = () => {
    if (isMuted) {
        // Unmute
        setIsMuted(false);
        if (audioRef.current) {
            audioRef.current.muted = false; // Ensure element is unmuted
            audioRef.current.play().catch(() => {});
        }
        fadeTo(BASE_VOLUME);
    } else {
        // Mute (fade out first for effect, but state controls icon)
        setIsMuted(true);
        fadeTo(0);
        // We leave the audio playing but at volume 0 for smooth resumption
    }
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 flex flex-col items-end transition-opacity duration-500 ${isAboutPage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Native HTML5 Audio Tag - Hidden but functional */}
      <audio 
        ref={audioRef}
        src={targetSrc || undefined}
        autoPlay
        loop
        muted={isMuted} 
        playsInline
        className="hidden"
      />
      
      <div className="relative flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 ${
            !isMuted 
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
              : 'bg-black/50 text-white border-white/20 backdrop-blur-md'
          }`}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          
          {!isMuted && targetSrc && volume > 0 && (
            <span className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default AudioPlayer;