import React, { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import CategoryDetail from './components/CategoryDetail';
import { EXERCISES } from './constants';
import { Category, Exercise } from './types';

type ViewState = 'dashboard' | 'category';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const exercises = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return EXERCISES.filter((exercise) => exercise.category === selectedCategory);
  }, [selectedCategory]);

  const handleStartCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('category');
  };

  const handleSelectExercise = (exercise: Exercise) => {
    window.alert(`Workspace for "${exercise.title}" comes next.`);
  };

  if (view === 'dashboard') {
    return <Dashboard onStartCategory={handleStartCategory} />;
  }

  if (!selectedCategory) {
    return null;
  }

  return (
    <CategoryDetail
      category={selectedCategory}
      exercises={exercises}
      onSelect={handleSelectExercise}
      onBack={() => setView('dashboard')}
    />
  );
};

export default App;
