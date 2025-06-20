import React from 'react';
import { Canvas2D } from './Canvas2D';
import { Canvas3D } from './Canvas3D';
import { FurnitureLibrary } from './FurnitureLibrary';
import { Controls } from './Controls';
import { ViewToggle } from './ViewToggle';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function RoomDesigner() {
  const { viewMode } = useRoomStore();
  
  return (
    <div className="w-full h-screen relative overflow-hidden bg-gray-100">
      {/* View Toggle */}
      <ViewToggle />
      
      {/* Main Canvas Area */}
      <div className="w-full h-full flex items-center justify-center">
        {viewMode === '2d' ? (
          <>
            <Canvas2D />
            <FurnitureLibrary />
            <Controls />
          </>
        ) : (
          <Canvas3D />
        )}
      </div>
      
      {/* Instructions for first-time users */}
      {viewMode === '2d' && (
        <div className="fixed top-20 right-4 max-w-xs bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Start:</h3>
          <ol className="space-y-1 text-blue-700 list-decimal list-inside">
            <li>Draw walls by clicking "Draw Walls" and clicking on canvas</li>
            <li>Add furniture by dragging from the library</li>
            <li>Click furniture to select and move it</li>
            <li>Switch to 3D view to see your room in 3D!</li>
          </ol>
        </div>
      )}
    </div>
  );
}
