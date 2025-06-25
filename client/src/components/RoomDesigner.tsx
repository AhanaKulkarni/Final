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
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { ArrowLeft, Home } from 'lucide-react';

interface RoomDesignerProps {
  onBackToHome?: () => void;
}

export function RoomDesigner({ onBackToHome }: RoomDesignerProps) {
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
        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="fixed top-6 left-6 z-50">
            <Button
              variant="outline"
              size="lg"
              onClick={onBackToHome}
              className="flex items-center gap-2 bg-white/95 backdrop-blur-sm shadow-lg border-gray-200"
            >
              <ArrowLeft size={18} />
              <Home size={18} />
              <span>Home</span>
            </Button>
          </div>
        )}
        
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
