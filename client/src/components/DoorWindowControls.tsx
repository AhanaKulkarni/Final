import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { DoorWindow } from '../types/room';

export function DoorWindowControls() {
  const { 
    currentRoom, 
    selectedDoorWindow, 
    updateDoorWindow, 
    removeDoorWindow, 
    editMode 
  } = useRoomStore();
  
  const allDoorWindows = [...currentRoom.doors, ...currentRoom.windows];
  const selectedItem = selectedDoorWindow 
    ? allDoorWindows.find(item => item.id === selectedDoorWindow)
    : null;
  
  const doorColors = [
    '#8B4513', '#654321', '#A0522D', '#FFFFFF',
    '#F5F5DC', '#2F4F4F', '#800000', '#000080',
  ];
  
  const windowColors = [
    '#4169E1', '#87CEEB', '#E6E6FA', '#F0F8FF',
    '#FFFFFF', '#C0C0C0', '#708090', '#2F4F4F',
  ];
  
  const updateWidth = (value: number[]) => {
    if (selectedItem) {
      updateDoorWindow(selectedItem.id, { width: value[0] });
    }
  };
  
  const updateHeight = (value: number[]) => {
    if (selectedItem) {
      updateDoorWindow(selectedItem.id, { height: value[0] });
    }
  };
  
  const updatePosition = (value: number[]) => {
    if (selectedItem) {
      updateDoorWindow(selectedItem.id, { position: value[0] / 100 });
    }
  };
  
  const updateColor = (color: string) => {
    if (selectedItem) {
      updateDoorWindow(selectedItem.id, { color });
    }
  };
  
  if (!selectedItem || (editMode !== 'door' && editMode !== 'window')) {
    return null;
  }
  
  const colors = selectedItem.type === 'door' ? doorColors : windowColors;
  
  return (
    <div className="fixed top-20 right-20 w-56 z-40">
      <div className="glass-ultra p-3">
        <div className="text-xs font-medium text-black mb-4 uppercase tracking-widest">
          {selectedItem.type === 'door' ? 'Door' : 'Window'}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Position</div>
            <Slider
              value={[selectedItem.position * 100]}
              onValueChange={updatePosition}
              min={5}
              max={95}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{Math.round(selectedItem.position * 100)}%</div>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Width</div>
            <Slider
              value={[selectedItem.width]}
              onValueChange={updateWidth}
              min={selectedItem.type === 'door' ? 60 : 40}
              max={selectedItem.type === 'door' ? 120 : 200}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{selectedItem.width}px</div>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Height</div>
            <Slider
              value={[selectedItem.height]}
              onValueChange={updateHeight}
              min={selectedItem.type === 'door' ? 160 : 60}
              max={selectedItem.type === 'door' ? 220 : 140}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{selectedItem.height}px</div>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Material</div>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 border ${
                    selectedItem.color === color || (!selectedItem.color && color === colors[0])
                      ? 'border-black border-2' 
                      : 'border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={() => removeDoorWindow(selectedItem.id)}
            className="w-full text-xs text-black hover:text-gray-600 py-2 border-t border-gray-300 mt-4 pt-3 uppercase tracking-wide"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}