import React from 'react';
import { Exercise } from '../types';
import { Dumbbell, Database, Search, ShieldCheck } from 'lucide-react';

interface ExerciseListProps {
  exercises: Exercise[];
  currentExerciseId: string;
  onSelect: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, currentExerciseId, onSelect }) => {
  
  const getIcon = (category: string) => {
    switch(category) {
      case 'Migration': return <Database className="w-4 h-4" />;
      case 'Validation': return <ShieldCheck className="w-4 h-4" />;
      case 'ActiveRecord': return <Search className="w-4 h-4" />;
      default: return <Dumbbell className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">
          RG
        </div>
        <h1 className="font-bold text-lg text-slate-100 tracking-tight">Rails Gym</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Exercises
        </div>
        <ul>
          {exercises.map((ex) => (
            <li key={ex.id}>
              <button
                onClick={() => onSelect(ex)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  currentExerciseId === ex.id 
                    ? 'bg-slate-800 border-l-2 border-red-500 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                <div className={`mt-0.5 ${currentExerciseId === ex.id ? 'text-red-400' : 'text-slate-500'}`}>
                  {getIcon(ex.category)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm leading-tight mb-1">{ex.title}</div>
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <span>{ex.category}</span>
                    <span className="text-slate-600">•</span>
                    <span className={getDifficultyColor(ex.difficulty)}>{ex.difficulty}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 text-center">
          v1.0.0 • Local Environment
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;