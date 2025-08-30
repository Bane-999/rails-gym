import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

interface TerminalProps {
  output: string;
  isRunning: boolean;
  passed: boolean | null;
  onNext?: () => void;
  nextLabel?: string;
}

const Terminal: React.FC<TerminalProps> = ({ output, isRunning, passed, onNext, nextLabel }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, isRunning, passed]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 font-mono text-sm border-t border-slate-700 relative">
      {/* Header - Classic Style */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">RSpec Output</span>
        </div>
        {isRunning && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Executing...</span>
            </div>
        )}
      </div>

      {/* Output Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 whitespace-pre-wrap font-mono leading-relaxed pb-32"
      >
        {output ? output : <span className="text-slate-600 italic">Ready to run... press "Run Code" to start.</span>}
      </div>

      {/* Modern "Flash" Floating Overlay */}
      {!isRunning && passed !== null && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20 px-6">
              <div className={`
                pointer-events-auto
                w-full max-w-3xl
                rounded-2xl border
                backdrop-blur-xl shadow-2xl shadow-black/50
                animate-slide-up
                p-1
                transition-all duration-500
                ${passed ? 'bg-green-950/60 border-green-500/30' : 'bg-red-950/60 border-red-500/30'}
              `}>
                <div className={`
                    rounded-xl px-6 py-4
                    flex items-center gap-6 justify-between
                    ${passed ? 'bg-gradient-to-r from-green-500/10 to-transparent' : 'bg-gradient-to-r from-red-500/10 to-transparent'}
                `}>
                    <div className="flex items-center gap-5">
                        <div className={`
                            relative flex items-center justify-center w-12 h-12 rounded-full border 
                            ${passed ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}
                        `}>
                            {passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg tracking-tight ${passed ? 'text-green-100' : 'text-red-100'}`}>
                                {passed ? 'Specs Passed' : 'Specs Failed'}
                            </h3>
                            <p className={`text-sm ${passed ? 'text-green-300/70' : 'text-red-300/70'}`}>
                                {passed ? 'Implementation verified successfully.' : 'Check the output for errors.'}
                            </p>
                        </div>
                    </div>

                    {passed && onNext && (
                    <button 
                        onClick={onNext}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-500 border-t border-white/20 shadow-lg shadow-green-900/40 hover:scale-105 hover:shadow-green-900/60 transition-all active:scale-95"
                    >
                        {nextLabel || "Next"} <ArrowRight className="w-4 h-4" />
                    </button>
                    )}
                </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Terminal;