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
    <>
      <div className="w-full" style={{ height: '100vh', backgroundColor: 'red' }}>
        <p style={{ padding: '20px', color: 'white' }}>TOP SECTION - Try scrolling down!</p>
      </div>
      <div className="w-full" style={{ height: '100vh', backgroundColor: 'blue' }}>
        <p style={{ padding: '20px', color: 'white' }}>MIDDLE SECTION</p>
        <RoomDesigner />
        <GamePanel />
        {allObjectivesCompleted && <GameComplete />}
      </div>
      <div className="w-full" style={{ height: '100vh', backgroundColor: 'green' }}>
        <p style={{ padding: '20px', color: 'white' }}>BOTTOM SECTION - If you can see this, scrolling works!</p>
      </div>
    </>
  );
}

export default App;
