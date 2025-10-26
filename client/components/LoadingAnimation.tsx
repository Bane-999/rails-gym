import React, { useState, useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  const brailleChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharIndex((prev) => (prev + 1) % brailleChars.length);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap font-mono leading-relaxed">
      <div>
        <span className="text-green-500">user@rails-gym:~$</span>
        <span className="text-slate-300 ml-2">run_code</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-slate-300">
          {brailleChars[charIndex]}
        </span>
        <span className="text-slate-300">
          Running RSpec in Docker Sandbox...
        </span>
      </div>
    </div>
  );
};

export default LoadingAnimation;
