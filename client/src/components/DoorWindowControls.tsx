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
    <div className="fixed top-20 right-6 w-72 z-40">
      <div className="glass-ultra p-4">
        <h3 className="text-white font-medium mb-3">
          {selectedItem.type === 'door' ? 'Door' : 'Window'} Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Position on Wall: {Math.round(selectedItem.position * 100)}%
            </label>
            <Slider
              value={[selectedItem.position * 100]}
              onValueChange={updatePosition}
              min={5}
              max={95}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">Width: {selectedItem.width}px</label>
            <Slider
              value={[selectedItem.width]}
              onValueChange={updateWidth}
              min={selectedItem.type === 'door' ? 60 : 40}
              max={selectedItem.type === 'door' ? 120 : 200}
              step={5}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">Height: {selectedItem.height}px</label>
            <Slider
              value={[selectedItem.height]}
              onValueChange={updateHeight}
              min={selectedItem.type === 'door' ? 160 : 60}
              max={selectedItem.type === 'door' ? 220 : 140}
              step={5}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-2">Color</label>
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedItem.color === color || (!selectedItem.color && color === colors[0])
                      ? 'border-blue-400' 
                      : 'border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={() => removeDoorWindow(selectedItem.id)}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Delete {selectedItem.type === 'door' ? 'Door' : 'Window'}
          </button>
        </div>
      </div>
    </div>
  );
}