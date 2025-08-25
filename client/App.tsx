import React from 'react';
import { CATEGORIES, EXERCISES } from './constants';

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-4">
          <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
            Rails Gym
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Practice Rails concepts in a focused frontend sandbox.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-400">
              A lightweight training surface for validations, migrations, ActiveRecord queries, and model associations.
            </p>
          </div>
        </header>

        <section className="grid gap-4 rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl shadow-black/20 sm:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Categories</p>
            <p className="mt-2 text-3xl font-semibold text-white">{CATEGORIES.length}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Exercises</p>
            <p className="mt-2 text-3xl font-semibold text-white">{EXERCISES.length}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Mode</p>
            <p className="mt-2 text-3xl font-semibold text-white">Frontend prototype</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 transition-colors hover:border-white/10 hover:bg-slate-900/50"
            >
              <h2 className="text-xl font-semibold text-white">{category.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{category.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default App;
