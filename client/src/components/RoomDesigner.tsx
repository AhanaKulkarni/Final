import React from 'react';
import { Canvas2D } from './Canvas2D';
import { Canvas3D } from './Canvas3D';
import { FurnitureLibrary } from './FurnitureLibrary';
import { FurnitureControls } from './FurnitureControls';
import { WallControls } from './WallControls';
import { DoorWindowControls } from './DoorWindowControls';
import { Controls } from './Controls';
import { ViewToggle } from './ViewToggle';
import { UndoRedo } from './UndoRedo';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function RoomDesigner() {
  const { viewMode, selectedFurniture, selectedDoorWindow, editMode } = useRoomStore();
  
  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Undo/Redo Controls */}
      <UndoRedo />
      
      {/* View Toggle */}
      <ViewToggle />
      
      {/* Main Canvas Area - Full size with minimal padding */}
      <div className="w-full h-full flex items-center justify-center p-1">
        {viewMode === '2d' ? (
          <>
            <Canvas2D />
            <FurnitureLibrary />
            <Controls />
            {selectedFurniture && <FurnitureControls />}
            {editMode === 'wall' && <WallControls />}
            {selectedDoorWindow && <DoorWindowControls />}
          </>
        ) : (
          <Canvas3D />
        )}
      </div>
    </div>
  );
}
