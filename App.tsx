import React, { useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ProgressBar } from './components/ProgressBar';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import { Gallery } from './pages/Gallery';
import { Admin } from './pages/Admin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    // We are scrolling the main content div, not window, so we handle that in Layout
  }, [pathname]);

  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Reset scroll on route change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 relative flex flex-col h-full">
        {/* Progress Bar only makes sense if we have enough content to scroll, handled inside component */}
        <ProgressBar target={scrollRef} />
        
        {/* Main Scrollable Area */}
        <main 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
        >
          {children}
          
          <footer className="py-8 text-center text-stone/40 text-xs uppercase tracking-widest">
            &copy; 2024 Serene Chronicles. Built with React & Tailwind.
          </footer>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;