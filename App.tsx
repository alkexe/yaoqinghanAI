
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import WorkspacePage from './components/WorkspacePage';
import { ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  const goToWorkspace = () => setView('workspace');
  const goToLanding = () => setView('landing');

  return (
    <div className="font-sans">
      {view === 'landing' ? (
        <LandingPage onStart={goToWorkspace} />
      ) : (
        <WorkspacePage onBack={goToLanding} />
      )}
    </div>
  );
};

export default App;
