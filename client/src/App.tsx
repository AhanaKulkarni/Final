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
    <div style={{ height: '2000px', background: 'linear-gradient(to bottom, orange, purple)', padding: '50px', color: 'white' }}>
      <h1>REACT APP SCROLL TEST</h1>
      <p>If you can scroll down and see the bottom message, React scrolling works!</p>
      <div style={{ marginTop: '1500px' }}>
        <h2>BOTTOM OF REACT APP - SCROLLING WORKS!</h2>
      </div>
    </div>
  );
}

export default App;
