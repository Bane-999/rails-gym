import React from 'react';
import { ArrowLeft, Play, Database, ShieldCheck, Search, Dumbbell } from 'lucide-react';
import { Exercise, Category } from '../types';

interface CategoryDetailProps {
  category: Category;
  exercises: Exercise[];
  onSelect: (ex: Exercise) => void;
  onBack: () => void;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, exercises, onSelect, onBack }) => {
    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'Migration': return <Database className="w-6 h-6" />;
            case 'Validation': return <ShieldCheck className="w-6 h-6" />;
            case 'ActiveRecord': return <Search className="w-6 h-6" />;
            default: return <Dumbbell className="w-6 h-6" />;
        }
    };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-12 py-10 border-b border-white/5 flex items-center gap-6 bg-slate-900/20 backdrop-blur-sm sticky top-0 z-10">
         <button 
           onClick={onBack}
           className="p-3 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/5"
         >
            <ArrowLeft className="w-5 h-5" />
         </button>
         <div className="flex items-center gap-4">
             <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                {getCategoryIcon(category)}
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{category}</h1>
                <p className="text-slate-400 text-sm">Select an exercise to start practicing.</p>
             </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-12 py-10">
        <div className="max-w-5xl mx-auto grid gap-3 animate-fade-in">
            {exercises.length === 0 ? (
                <div className="text-slate-500 italic p-8 text-center border border-dashed border-slate-800 rounded-xl">
                    No exercises found for this category yet.
                </div>
            ) : (
                exercises.map((ex, index) => (
                    <button 
                        key={ex.id}
                        onClick={() => onSelect(ex)}
                        className="group flex items-center justify-between p-5 bg-slate-800/20 border border-white/5 rounded-xl hover:bg-slate-800/50 hover:border-white/10 transition-all duration-200 text-left relative overflow-hidden"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 font-mono text-sm group-hover:text-white transition-colors">
                                {(index + 1).toString().padStart(2, '0')}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-200 group-hover:text-white mb-1.5">{ex.title}</h3>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className={`px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 font-medium
                                        ${ex.difficulty === 'Easy' ? 'text-green-400' : ''}
                                        ${ex.difficulty === 'Medium' ? 'text-yellow-400' : ''}
                                        ${ex.difficulty === 'Hard' ? 'text-red-400' : ''}
                                    `}>
                                        {ex.difficulty}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500 font-mono bg-slate-900/50 px-2 py-0.5 rounded text-[10px] border border-white/5">
                                        {ex.defaultOpenPath}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <Play className="w-3.5 h-3.5 fill-current text-white" />
                        </div>
                    </button>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
