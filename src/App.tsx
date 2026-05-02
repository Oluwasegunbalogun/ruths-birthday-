import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ContributePage } from './pages/ContributePage';
import { ExperiencePage } from './pages/ExperiencePage';
import { Toaster } from './components/ui/sonner';

function App() {
  useEffect(() => {
    document.title = "Ruth's Birthday Story";

    // Handle page reload redirect to home
    const navigationEntries = window.performance.getEntriesByType('navigation');
    const isReload = navigationEntries.length > 0 && 
      (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload';

    if (isReload && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, []);

  return (
    <Router>
      <main className="font-sans selection:bg-[#FF2D55]/20 selection:text-[#FF2D55] bg-[#FFF6F9] min-h-screen relative overflow-x-hidden">
        {/* Global Background Image - Increased visibility */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200807142_BK_GROUND.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.3, // Increased visibility across all pages
          }}
        />
        
        {/* Content Wrapper */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/her" element={<ExperiencePage />} />
          </Routes>
        </div>
        
        <Toaster position="top-center" richColors />
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
          body {
            scrollbar-width: thin;
            scrollbar-color: #FF2D5520 transparent;
            overflow-x: hidden;
            background-color: #FFF6F9;
          }
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #FF2D5520;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #FF2D5540;
          }
          .bg-grid-white {
            background-size: 40px 40px;
            background-image: radial-gradient(circle, rgba(255, 45, 85, 0.05) 1px, transparent 1px);
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 45, 85, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #FF2D5520;
            border-radius: 10px;
          }
          .text-pop {
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          }
          .heading-pop {
            text-shadow: 0 4px 20px rgba(0,0,0,0.8);
          }
        `}} />
      </main>
    </Router>
  );
}

export default App;