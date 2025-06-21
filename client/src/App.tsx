import React from 'react';
import { RoomDesigner } from './components/RoomDesigner';
import { GameIntro } from './components/GameIntro';
import { GamePanel } from './components/GamePanel';
import { useGame } from './lib/stores/useGame';
import './index.css';

function App() {
  const { phase } = useGame();

  if (phase === 'ready') {
    return <GameIntro />;
  }

  return (
    <div className="w-full h-screen relative">
      <RoomDesigner />
      <GamePanel />
    </div>
  );
}

export default App;
