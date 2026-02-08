import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Background from './components/Background';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import About from './pages/About';
import StoryPage from './pages/StoryPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="antialiased text-foreground min-h-screen selection:bg-white/20">
        <Background />
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/story/:id" element={<StoryPage />} />
          </Routes>
        </main>

        <AudioPlayer />
        
        <footer className="py-8 text-center text-xs text-gray-600 font-mono">
          © {new Date().getFullYear()} Refugee Storyteller. Designed with code.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;