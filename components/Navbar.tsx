import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { STORIES } from '../constants';
import { ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<number | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150 && !isHovered) {
      setHidden(true);
      setDropdownOpen(false);
    } else {
      setHidden(false);
    }
  });

  // Reset dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 300ms delay to allow user to move cursor
  };

  // Sort stories alphabetically for the menu
  const sortedStories = [...STORIES].sort((a, b) => a.country.localeCompare(b.country));

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      <div className="w-full max-w-5xl backdrop-blur-md bg-black/50 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        {/* Logo */}
        <Link to="/" className="text-white font-medium tracking-tight text-lg hover:text-gray-300 transition-colors">
          Refugee Storyteller
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <Link 
            to="/" 
            className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : ''}`}
          >
            Home
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button className={`flex items-center gap-1 hover:text-white transition-colors ${location.pathname.includes('story') ? 'text-white' : ''}`}>
              Stories <ChevronDown size={14} />
            </button>
            
            {/* Dropdown */}
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 w-48 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-xl p-2"
              >
                {sortedStories.map((story) => (
                  <Link
                    key={story.id}
                    to={`/story/${story.id}`}
                    className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs"
                  >
                    {story.country}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

          <Link 
            to="/about" 
            className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white' : ''}`}
          >
            About me
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;