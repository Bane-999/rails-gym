import React from 'react';
import { ArrowLeft, Database, Dumbbell, Play, Search, ShieldCheck } from 'lucide-react';
import { Category, Exercise } from '../types';

interface CategoryDetailProps {
  category: Category;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onBack: () => void;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, exercises, onSelect, onBack }) => {
  const getCategoryIcon = (value: string) => {
    switch (value) {
      case 'Migration':
        return <Database className="h-6 w-6" />;
      case 'Validation':
        return <ShieldCheck className="h-6 w-6" />;
      case 'ActiveRecord':
        return <Search className="h-6 w-6" />;
      default:
        return <Dumbbell className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-white/5 bg-slate-900/20 px-12 py-10 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="rounded-xl border border-transparent p-3 text-slate-400 transition-all hover:border-white/5 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-500">{getCategoryIcon(category)}</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{category}</h1>
            <p className="text-sm text-slate-400">Select an exercise to start practicing.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-12 py-10">
        <div className="mx-auto grid max-w-5xl gap-3">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.id}
              onClick={() => onSelect(exercise)}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-slate-800/20 p-5 text-left transition-all duration-200 hover:border-white/10 hover:bg-slate-800/50"
            >
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-red-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-slate-900 font-mono text-sm text-slate-500 transition-colors group-hover:text-white">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-semibold text-slate-200 group-hover:text-white">{exercise.title}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`rounded-full border border-white/5 bg-slate-900 px-2 py-0.5 font-medium ${
                        exercise.difficulty === 'Easy' ? 'text-green-400' : exercise.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="rounded border border-white/5 bg-slate-900/50 px-2 py-0.5 font-mono text-[10px] text-slate-500">
                      {exercise.defaultOpenPath}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex h-8 w-8 translate-x-2 items-center justify-center rounded-full bg-white/5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <Play className="h-3.5 w-3.5 fill-current text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
