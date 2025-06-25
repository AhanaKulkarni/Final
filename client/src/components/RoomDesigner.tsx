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
    <div className="w-full min-h-screen flex bg-gray-50">
      {/* Left Sidebar for 2D Mode - Wider for big laptops */}
      {viewMode === '2d' && (
        <div className="w-96 min-h-screen overflow-y-auto bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6 space-y-6">
            <FurnitureLibrary />
            <Controls />
            {selectedFurniture && <FurnitureControls />}
            {editMode === 'wall' && <WallControls />}
            {selectedDoorWindow && <DoorWindowControls />}
          </div>
        </div>
      )}
      
      {/* Main Canvas Area - Full remaining width */}
      <div className="flex-1 min-h-screen relative">
        {/* Undo/Redo Controls */}
        <UndoRedo />
        
        {/* View Toggle */}
        <ViewToggle />
        
        {/* Canvas */}
        <div className="w-full min-h-screen flex items-center justify-center">
          {viewMode === '2d' ? <Canvas2D /> : viewMode === '3d' ? <Canvas3D /> : null}
        </div>
      </div>
    </div>
  );
}
