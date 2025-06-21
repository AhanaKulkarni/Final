import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function WallControls() {
  const { currentRoom, updateWall, editMode } = useRoomStore();
  const [selectedWallIndex, setSelectedWallIndex] = useState(0);
  
  const wallColors = [
    '#F5F5F5', '#FFFFFF', '#E5E5E5', '#D3D3D3',
    '#C0C0C0', '#A9A9A9', '#808080', '#696969',
    '#F0E68C', '#DDA0DD', '#98FB98', '#87CEEB',
    '#FFB6C1', '#F0F8FF', '#FDF5E6', '#F5FFFA'
  ];
  
  const updateThickness = (value: number[]) => {
    updateWall(selectedWallIndex, { thickness: value[0] });
  };
  
  const updateWallColor = (color: string) => {
    updateWall(selectedWallIndex, { color });
  };
  
  if (editMode !== 'wall' || currentRoom.walls.length === 0) {
    return null;
  }
  
  const selectedWall = currentRoom.walls[selectedWallIndex] || currentRoom.walls[0];
  
  return (
    <div className="fixed top-20 left-6 w-72 z-40">
      <div className="glass-ultra p-4">
        <h3 className="text-white font-medium mb-3">Wall Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Select Wall</label>
            <select 
              value={selectedWallIndex}
              onChange={(e) => setSelectedWallIndex(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              {currentRoom.walls.map((_, index) => (
                <option key={index} value={index}>
                  Wall {index + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-2">Wall Color</label>
            <div className="grid grid-cols-4 gap-1">
              {wallColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedWall.color === color || (!selectedWall.color && color === '#F5F5F5')
                      ? 'border-blue-400' 
                      : 'border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateWallColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Wall Thickness: {selectedWall.thickness}px
            </label>
            <Slider
              value={[selectedWall.thickness]}
              onValueChange={updateThickness}
              min={5}
              max={25}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}