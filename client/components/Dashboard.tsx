import React, { useState } from 'react';
import { Play, Database, ShieldCheck, Search, Dumbbell, Zap, Code2, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface DashboardProps {
    onStartCategory: (category: Category) => void;
    onStartCircuit: (minutes: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartCategory, onStartCircuit }) => {
    const [duration, setDuration] = useState(30);

    const getIcon = (id: string) => {
        switch(id) {
          case 'Migration': return <Database className="w-5 h-5" />;
          case 'Validation': return <ShieldCheck className="w-5 h-5" />;
          case 'ActiveRecord': return <Search className="w-5 h-5" />;
          case 'Associations': return <Dumbbell className="w-5 h-5" />;
          default: return <Dumbbell className="w-5 h-5" />;
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 px-12 border-b border-white/5">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="mb-8 flex">
                            <img
                                src="/logo.png"
                                alt="Rails Gym Logo"
                                className="w-60 object-contain drop-shadow-md"
                            />
                    </div>
                    <h1 className="text-5xl font-bold text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Rails Gym
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl font-light leading-relaxed">
                        Build backend muscle memory through focused repetition.
                        Master Active Record, Migrations, and Validations in a distraction-free sandbox.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full px-12 py-12 flex-1">

                {/* Daily Circuit Card */}
                <div className="mb-16 animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Daily Circuit
                        </h2>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-white/5 p-1 transition-all hover:border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2">Randomized Warm-up</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    We'll curate a mix of exercises from different categories to test your adaptability.
                                    Perfect for starting your day.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-black/20 p-2 pl-6 rounded-xl border border-white/5">
                                <div className="flex flex-col">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Duration</label>
                                    <div className="relative">
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            className="bg-transparent text-white font-mono font-bold text-xl focus:outline-none appearance-none pr-6 cursor-pointer"
                                        >
                                            <option value="15">15 min</option>
                                            <option value="30">30 min</option>
                                            <option value="45">45 min</option>
                                            <option value="60">60 min</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onStartCircuit(duration)}
                                    className="bg-red-600 text-white hover:bg-red-500 px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-slate-400" />
                        Focus Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {CATEGORIES.map((cat, idx) => (
                            <button
                                key={cat.id}
                                onClick={() => onStartCategory(cat.id as Category)}
                                className="group text-left p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:bg-slate-800/40 hover:border-white/10 transition-all duration-300 relative overflow-hidden"
                                style={{animationDelay: `${idx * 0.05}s`}}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                    <ArrowRight className="w-5 h-5 text-slate-500" />
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-slate-800/50 rounded-xl text-slate-300 group-hover:text-white group-hover:bg-red-500/10 group-hover:scale-110 transition-all duration-300 border border-white/5">
                                        {getIcon(cat.id)}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-1 transition-colors">{cat.label}</h3>
                                    <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{cat.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
