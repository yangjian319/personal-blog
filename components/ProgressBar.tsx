import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  target: React.RefObject<HTMLDivElement>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ target }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!target.current) return;

      const element = target.current;
      const totalScroll = element.scrollTop;
      const windowHeight = element.scrollHeight - element.clientHeight;
      
      if (windowHeight === 0) return setProgress(0);

      const currentProgress = totalScroll / windowHeight;
      setProgress(Number(currentProgress.toFixed(2)) * 100);
    };

    const element = target.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      // Trigger once to set initial state
      handleScroll();
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [target]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div 
        className="h-full bg-charcoal transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};