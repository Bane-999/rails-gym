import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCw, ArrowLeft, Timer } from 'lucide-react';
import CodeEditor from './components/Editor';
import Terminal from './components/Terminal';
import InstructionPanel from './components/InstructionPanel';
import FileTree from './components/FileTree';
import Dashboard from './components/Dashboard';
import CategoryDetail from './components/CategoryDetail';
import { fetchExercises, executeCode } from './services/railsService';
import { Exercise, Category } from './types';

type ViewState = 'dashboard' | 'category_list' | 'workspace';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  // Workspace State
  const [activePath, setActivePath] = useState<string>("");
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [lastPassed, setLastPassed] = useState<boolean | null>(null);

  // Session State
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Fetch exercises on mount
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoadingExercises(true);
      const data = await fetchExercises();
      setExercises(data);
      setIsLoadingExercises(false);
    };
    loadExercises();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (isTimerActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
             setIsTimerActive(false);
             return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startExercise = (ex: Exercise) => {
    setCurrentExercise(ex);

    // Initialize file contents map from exercise data
    setFileContents({ ...ex.files });
    setActivePath(ex.defaultOpenPath);

    setOutput("");
    setLastPassed(null);
    setView('workspace');
  };

  const handleStartCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('category_list');
    setIsTimerActive(false);
  };

  const handleSelectExerciseFromList = (ex: Exercise) => {
      // Find exercises in the same category to populate the queue
      const categoryExercises = exercises.filter(e => e.category === ex.category);
      const currentIndex = categoryExercises.findIndex(e => e.id === ex.id);
      // Queue is everything after this one
      const remaining = categoryExercises.slice(currentIndex + 1);

      setQueue(remaining);
      startExercise(ex);
  };

  const handleStartCircuit = (minutes: number) => {
      // Pick random exercises
      const shuffled = [...exercises].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3); // Take 3 random ones

      setQueue(selected.slice(1));
      setTimerSeconds(minutes * 60);
      setIsTimerActive(true);
      startExercise(selected[0]);
  };

  const handleBackToDashboard = () => {
      if (confirm("Quit current session?")) {
          setView('dashboard');
          setIsTimerActive(false);
      }
  };

  const handleBackToCategoryList = () => {
    if (confirm("Quit current session?")) {
        setView('category_list');
        setIsTimerActive(false);
    }
  };

  const handleNextExercise = () => {
      if (queue.length > 0) {
          const next = queue[0];
          setQueue(queue.slice(1));
          startExercise(next);
      } else {
          // No more exercises in queue
          if (selectedCategory) {
              setView('category_list');
          } else {
              setView('dashboard');
          }
      }
  };

  const handleRunCode = useCallback(async () => {
    if (isRunning || !currentExercise) return;

    setIsRunning(true);
    setOutput("Running RSpec in Docker Sandbox...\nWait for it...");
    setLastPassed(null);

    try {
      const result = await executeCode(currentExercise.exercise_id, fileContents);
      setOutput(result.output);
      setLastPassed(result.passed);
    } catch (error) {
      setOutput("Error connecting to server runner.");
    } finally {
      setIsRunning(false);
    }
  }, [currentExercise, fileContents, isRunning]);

  const handleReset = () => {
      if (currentExercise && confirm("Reset all files to initial state?")) {
          setFileContents({ ...currentExercise.files });
          setOutput("");
          setLastPassed(null);
      }
  };

  const handleFileChange = (newContent: string | undefined) => {
      if (newContent === undefined) return;

      setFileContents(prev => ({
          ...prev,
          [activePath]: newContent
      }));
  };

  // View Routing
  if (view === 'dashboard') {
      return <Dashboard onStartCategory={handleStartCategory} onStartCircuit={handleStartCircuit} />;
  }

  if (view === 'category_list' && selectedCategory) {
      const categoryExercises = exercises.filter(e => e.category === selectedCategory);
      return (
          <CategoryDetail
            category={selectedCategory}
            exercises={categoryExercises}
            onSelect={handleSelectExerciseFromList}
            onBack={() => setView('dashboard')}
          />
      );
  }

  if (!currentExercise) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

      {/* File Tree (Context) */}
      <div className="w-64 flex-shrink-0 h-full overflow-hidden">
          <FileTree
            files={currentExercise.fileTree}
            activePath={activePath}
            onSelect={setActivePath}
          />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header Toolbar */}
        <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button
                onClick={selectedCategory ? handleBackToCategoryList : handleBackToDashboard}
                className="text-slate-400 hover:text-white"
             >
                 <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="h-6 w-px bg-slate-700 mx-2"></div>
             <h2 className="font-semibold text-slate-100">{currentExercise.title}</h2>

             {isTimerActive && (
                 <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded text-red-400 font-mono font-bold animate-pulse">
                     <Timer className="w-4 h-4" />
                     {formatTime(timerSeconds)}
                 </div>
             )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Reset Code"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-md font-bold text-sm transition-all
                ${isRunning
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                }
              `}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'opacity-50' : 'fill-current'}`} />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </header>

        {/* Workspace Split */}
        <div className="flex-1 flex overflow-hidden">

            {/* Middle: Code & Terminal */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-r border-slate-700">
                {/* Editor Area (Top 65%) */}
                <div className="h-[65%] min-h-[200px] overflow-hidden flex flex-col">
                    <CodeEditor
                        code={fileContents[activePath] || ""}
                        onChange={handleFileChange}
                        filename={activePath}
                    />
                </div>

                {/* Terminal Area (Bottom 35%) */}
                <div className="flex-1 min-h-[150px] border-t border-slate-700 relative overflow-hidden">
                    <Terminal
                        output={output}
                        isRunning={isRunning}
                        passed={lastPassed}
                        onNext={handleNextExercise}
                        nextLabel={queue.length > 0 ? "Next Exercise" : "Finish"}
                    />
                </div>
            </div>

            {/* Right: Instructions (Collapsible logic could be added, fixed width for now) */}
            <div className="w-[350px] min-w-[300px] bg-slate-900/30 flex flex-col overflow-hidden">
                <InstructionPanel exercise={currentExercise} />
            </div>

        </div>

      </div>
    </div>
  );
};

export default App;
