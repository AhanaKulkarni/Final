import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function WallControls() {
  const { currentRoom, updateWall, editMode } = useRoomStore();
  const [selectedWallIndex, setSelectedWallIndex] = useState(0);
  
  const wallColors = [
    '#F5F5F5', '#FFFFFF', '#E5E5E5', '#D3D3D3',
    '#C0C0C0', '#A9A9A9', '#808080', '#696969',
    '#F0E68C', '#DDA0DD', '#98FB98', '#87CEEB'
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
    <div className="fixed top-20 left-20 w-56 z-40">
      <div className="glass-ultra p-3">
        <div className="text-xs font-medium text-black mb-4 uppercase tracking-widest">
          Walls
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Selection</div>
            <select 
              value={selectedWallIndex}
              onChange={(e) => setSelectedWallIndex(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-gray-400 text-xs text-black font-medium"
            >
              {currentRoom.walls.map((_, index) => (
                <option key={index} value={index}>
                  WALL {index + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Material</div>
            <div className="grid grid-cols-4 gap-2">
              {wallColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 border ${
                    selectedWall.color === color || (!selectedWall.color && color === '#F5F5F5')
                      ? 'border-black border-2' 
                      : 'border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateWallColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Thickness</div>
            <Slider
              value={[selectedWall.thickness]}
              onValueChange={updateThickness}
              min={5}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{selectedWall.thickness}px</div>
          </div>
        </div>
      </div>
    </div>
  );
}