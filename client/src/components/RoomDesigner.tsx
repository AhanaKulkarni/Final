import React from 'react';
import { Canvas2D } from './Canvas2D';
import { Canvas3D } from './Canvas3D';
import { FurnitureLibrary } from './FurnitureLibrary';
import { FurnitureControls } from './FurnitureControls';
import { Controls } from './Controls';
import { ViewToggle } from './ViewToggle';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function RoomDesigner() {
  const { viewMode, selectedFurniture } = useRoomStore();
  
  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
      {/* View Toggle */}
      <ViewToggle />
      
      {/* Main Canvas Area */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {viewMode === '2d' ? (
          <>
            <Canvas2D />
            <FurnitureLibrary />
            <Controls />
            {selectedFurniture && <FurnitureControls />}
          </>
        ) : (
          <Canvas3D />
        )}
      </div>
    </div>
  );
}
