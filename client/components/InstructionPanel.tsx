import React, { useState } from 'react';
import { BookOpen, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Exercise } from '../types';

interface InstructionPanelProps {
  exercise: Exercise;
}

const InstructionPanel: React.FC<InstructionPanelProps> = ({ exercise }) => {
  const [showHint, setShowHint] = useState(false);

  // Reset hint state when exercise changes
  React.useEffect(() => {
    setShowHint(false);
  }, [exercise.id]);

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-100 mt-4 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block mt-2 text-slate-200">{line.replace(/\*\*/g, '')}</strong>;
      if (line.startsWith('```')) return null;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-300">{line.replace('- ', '')}</li>;
      const parts = line.split(/(`[^`]+`)/);
      return (
        <p key={i} className="mb-2 text-slate-300 leading-relaxed">
          {parts.map((part, j) => 
            part.startsWith('`') && part.endsWith('`') 
              ? <code key={j} className="bg-slate-800 text-red-300 px-1 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code> 
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="flex border-b border-slate-700 bg-slate-900">
        <div className="px-4 py-3 text-sm font-medium text-white flex items-center gap-2 border-b-2 border-red-500">
          <BookOpen className="w-4 h-4" />
          Task Instructions
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="animate-in fade-in duration-300">
            {renderMarkdown(exercise.description)}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex flex-col gap-2">
            <button 
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider mb-2"
            >
                <HelpCircle className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
            
            {showHint && (
                <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm italic animate-in slide-in-from-bottom-2 duration-200">
                   💡 {exercise.hint}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InstructionPanel;