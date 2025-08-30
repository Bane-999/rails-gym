import React, { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Play, RotateCw } from 'lucide-react';
import CategoryDetail from './components/CategoryDetail';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/Editor';
import FileTree from './components/FileTree';
import InstructionPanel from './components/InstructionPanel';
import Terminal from './components/Terminal';
import { EXERCISES } from './constants';
import { executeCode } from './services/railsService';
import { Category, Exercise } from './types';

type ViewState = 'dashboard' | 'category_list' | 'workspace';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [activePath, setActivePath] = useState('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastPassed, setLastPassed] = useState<boolean | null>(null);

  const categoryExercises = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return EXERCISES.filter((exercise) => exercise.category === selectedCategory);
  }, [selectedCategory]);

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setFileContents({ ...exercise.files });
    setActivePath(exercise.defaultOpenPath);
    setOutput('');
    setLastPassed(null);
    setView('workspace');
  };

  const handleStartCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('category_list');
  };

  const handleRunCode = useCallback(async () => {
    if (isRunning || !currentExercise) {
      return;
    }

    setIsRunning(true);
    setOutput('Running RSpec in Docker Sandbox...\nWait for it...');
    setLastPassed(null);

    try {
      const result = await executeCode(currentExercise.id, fileContents);
      setOutput(result.output);
      setLastPassed(result.passed);
    } catch (_error) {
      setOutput('Error connecting to backend runner.');
    } finally {
      setIsRunning(false);
    }
  }, [currentExercise, fileContents, isRunning]);

  const handleReset = () => {
    if (!currentExercise || !window.confirm('Reset all files to initial state?')) {
      return;
    }

    setFileContents({ ...currentExercise.files });
    setOutput('');
    setLastPassed(null);
  };

  const handleFileChange = (newContent: string | undefined) => {
    if (newContent === undefined) {
      return;
    }

    if (currentExercise?.readOnlyPaths.includes(activePath)) {
      return;
    }

    setFileContents((previous) => ({
      ...previous,
      [activePath]: newContent,
    }));
  };

  if (view === 'dashboard') {
    return <Dashboard onStartCategory={handleStartCategory} />;
  }

  if (view === 'category_list' && selectedCategory) {
    return (
      <CategoryDetail
        category={selectedCategory}
        exercises={categoryExercises}
        onSelect={startExercise}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (!currentExercise) {
    return null;
  }

  const isCurrentFileReadOnly = currentExercise.readOnlyPaths.includes(activePath);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
      <div className="h-full w-64 flex-shrink-0 overflow-hidden">
        <FileTree files={currentExercise.fileTree} activePath={activePath} onSelect={setActivePath} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-10 flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('category_list')} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="mx-2 h-6 w-px bg-slate-700" />
            <h2 className="font-semibold text-slate-100">{currentExercise.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="p-2 text-slate-400 transition-colors hover:text-white" title="Reset Code">
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                isRunning ? 'cursor-wait bg-slate-700 text-slate-400' : 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:bg-green-500'
              }`}
            >
              <Play className={`h-4 w-4 ${isRunning ? 'opacity-50' : 'fill-current'}`} />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_380px]">
          <div className="flex min-h-0 flex-col bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900/50 px-4 py-2 text-xs text-slate-400">
              <span>{activePath}</span>
              {isCurrentFileReadOnly && (
                <span className="flex items-center gap-1 font-medium uppercase tracking-wider text-amber-400">
                  <Lock className="h-3 w-3" />
                  Read only
                </span>
              )}
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor code={fileContents[activePath] ?? ''} onChange={handleFileChange} filename={activePath.split('/').pop() ?? activePath} />
            </div>
            <div className="h-72 flex-shrink-0">
              <Terminal output={output} isRunning={isRunning} passed={lastPassed} />
            </div>
          </div>

          <div className="min-h-0 border-l border-slate-700 bg-slate-900">
            <InstructionPanel exercise={currentExercise} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
