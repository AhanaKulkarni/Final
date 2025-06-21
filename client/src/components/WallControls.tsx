import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Home, Palette, Sparkles } from 'lucide-react';

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
    <div className="fixed top-20 left-6 w-80 z-40">
      <div className="glass-ultra p-6 rounded-2xl card-interactive">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-yellow-500/20">
            <Home size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Wall Customization</h2>
            <p className="text-xs text-white/60">Customize wall appearance</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">Select Wall</label>
            <select 
              value={selectedWallIndex}
              onChange={(e) => setSelectedWallIndex(Number(e.target.value))}
              className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-white/20 
                       rounded-xl text-white focus:outline-none focus:border-cyan-400 
                       transition-all duration-300"
            >
              {currentRoom.walls.map((_, index) => (
                <option key={index} value={index} className="bg-gray-800 text-white">
                  Wall {index + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Palette size={14} />
              Wall Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {wallColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedWall.color === color || (!selectedWall.color && color === '#F5F5F5')
                      ? 'border-cyan-400 scale-110 shadow-lg' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateWallColor(color)}
                  title={`Wall color: ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">
              Wall Thickness: {selectedWall.thickness}px
            </label>
            <div className="relative">
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
          
          <div className="text-xs text-white/60 bg-black/20 p-4 rounded-xl backdrop-blur-sm space-y-2">
            <p className="font-semibold text-white/80">Wall Customization:</p>
            <p>• Select different walls to customize</p>
            <p>• Choose colors and adjust thickness</p>
            <p>• Changes apply immediately in 3D view</p>
          </div>
        </div>
      </div>
    </div>
  );
}