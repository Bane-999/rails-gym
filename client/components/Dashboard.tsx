import React from 'react';
import { ArrowRight, Code2, Database, Dumbbell, Search, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface DashboardProps {
  onStartCategory: (category: Category) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartCategory }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'Migration':
        return <Database className="h-5 w-5" />;
      case 'Validation':
        return <ShieldCheck className="h-5 w-5" />;
      case 'ActiveRecord':
        return <Search className="h-5 w-5" />;
      default:
        return <Dumbbell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="relative border-b border-white/5 px-12 pb-16 pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex">
            <div className="rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-600 to-red-800 p-5 shadow-2xl shadow-red-900/40">
              <svg
                className="h-16 w-16 text-white drop-shadow-md"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3L2 9L12 22L22 9L18 3H6Z" className="fill-white/10" stroke="white" strokeWidth="2" />
                <path d="M8 11h8" stroke="white" strokeWidth="2.5" />
                <path d="M6 8v6" stroke="white" strokeWidth="2.5" />
                <path d="M18 8v6" stroke="white" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Rails Gym
          </h1>
          <p className="max-w-2xl text-xl font-light leading-relaxed text-slate-400">
            Build backend muscle memory through focused repetition. Pick a category and drill the Rails concepts you want to strengthen.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-12 py-12">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
          <Code2 className="h-5 w-5 text-slate-400" />
          Focus Categories
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onStartCategory(category.id as Category)}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-800/20 p-6 text-left transition-all duration-300 hover:bg-slate-800/40 hover:border-white/10"
            >
              <div className="absolute right-0 top-0 p-6 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mb-4 flex items-start gap-4">
                <div className="rounded-xl border border-white/5 bg-slate-800/50 p-3 text-slate-300 transition-all duration-300 group-hover:bg-red-500/10 group-hover:text-white">
                  {getIcon(category.id)}
                </div>
              </div>
              <h3 className="mb-1 text-lg font-bold text-slate-200 transition-colors group-hover:text-white">{category.label}</h3>
              <p className="text-sm text-slate-500 transition-colors group-hover:text-slate-400">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
