import React from 'react';
import { RoomDesigner } from './components/RoomDesigner';
import { GameIntro } from './components/GameIntro';
import { GamePanel } from './components/GamePanel';
import { GameComplete } from './components/GameComplete';
import { useGame } from './lib/stores/useGame';
import './index.css';

function App() {
  const { phase, objectives } = useGame();

  if (phase === 'ready') {
    return <GameIntro />;
  }

  const allObjectivesCompleted = objectives.every(obj => obj.completed);

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <RoomDesigner />
      <GamePanel />
      {allObjectivesCompleted && <GameComplete />}
    </div>
  );
}

export default App;
