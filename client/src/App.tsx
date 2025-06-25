import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { RoomDesigner } from './components/RoomDesigner';
import './index.css';

function App() {
  const [showDesigner, setShowDesigner] = useState(false);
  const [roomName, setRoomName] = useState('My Room');

  const handleStartDesigning = (name?: string) => {
    if (name) setRoomName(name);
    setShowDesigner(true);
  };

  if (!showDesigner) {
    return <HomePage onStartDesigning={handleStartDesigning} />;
  }

  const handleBackToHome = () => {
    setShowDesigner(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <RoomDesigner onBackToHome={handleBackToHome} />
    </div>
  );
}

export default App;
