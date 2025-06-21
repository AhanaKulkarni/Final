import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Settings, RotateCw, Trash2, Palette, Sparkles } from 'lucide-react';

export function FurnitureControls() {
  const { 
    currentRoom, 
    selectedFurniture, 
    updateFurniture, 
    removeFurniture,
    selectFurniture 
  } = useRoomStore();
  
  const selectedItem = selectedFurniture 
    ? currentRoom.furniture.find(f => f.id === selectedFurniture)
    : null;
  
  if (!selectedItem) return null;

  const updateRotation = (value: number[]) => {
    updateFurniture(selectedItem.id, { rotation: value[0] });
  };

  const updateScale = (value: number[]) => {
    updateFurniture(selectedItem.id, { scale: value[0] });
  };

  const updateWidth = (value: number[]) => {
    updateFurniture(selectedItem.id, { width: value[0] });
  };

  const updateHeight = (value: number[]) => {
    updateFurniture(selectedItem.id, { height: value[0] });
  };

  const updateDepth = (value: number[]) => {
    updateFurniture(selectedItem.id, { depth: value[0] });
  };

  const updateColor = (color: string) => {
    updateFurniture(selectedItem.id, { color });
  };

  const furnitureColors = [
    '#8B4513', '#D2691E', '#CD853F', '#DEB887',
    '#F4A460', '#D2B48C', '#BC8F8F', '#F5DEB3',
    '#FFFFFF', '#F5F5F5', '#DCDCDC', '#C0C0C0',
    '#000000', '#2F4F4F', '#696969', '#708090'
  ];

  return (
    <div className="fixed top-20 right-6 w-80 z-40">
      <div className="glass-ultra p-6 rounded-2xl card-interactive">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 neon-glow">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white gradient-text">Furniture Settings</h2>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" />
              Customize Selected Item
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => updateFurniture(selectedItem.id, { rotation: (selectedItem.rotation + 15) % 360 })}
              className="btn-secondary flex items-center gap-2 flex-1 px-4 py-3 rounded-xl text-sm font-semibold"
            >
              <RotateCw size={14} />
              Rotate 15°
            </button>
            <button
              onClick={() => removeFurniture(selectedItem.id)}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 
                       border border-red-500/30 text-white font-semibold text-sm
                       hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/50
                       transition-all duration-300 group flex items-center gap-2"
            >
              <Trash2 size={14} className="transition-transform group-hover:scale-110" />
              Delete
            </button>
          </div>

          {/* Rotation Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">
              Rotation: {selectedItem.rotation}°
            </label>
            <div className="relative">
              <Slider
                value={[selectedItem.rotation]}
                onValueChange={updateRotation}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
              <div className="absolute -top-1 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>

          {/* Scale Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">
              Overall Size: {selectedItem.scale.toFixed(1)}x
            </label>
            <div className="relative">
              <Slider
                value={[selectedItem.scale]}
                onValueChange={updateScale}
                min={0.3}
                max={3.0}
                step={0.1}
                className="w-full"
              />
              <div className="absolute -top-1 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Dimension Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Dimensions</h3>
            
            <div className="space-y-3">
              <label className="text-xs text-white/60">Width: {selectedItem.width}px</label>
              <Slider
                value={[selectedItem.width]}
                onValueChange={updateWidth}
                min={20}
                max={300}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs text-white/60">Height: {selectedItem.height}px</label>
              <Slider
                value={[selectedItem.height]}
                onValueChange={updateHeight}
                min={20}
                max={300}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs text-white/60">Depth: {selectedItem.depth}px</label>
              <Slider
                value={[selectedItem.depth]}
                onValueChange={updateDepth}
                min={20}
                max={300}
                step={5}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Palette size={14} />
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {furnitureColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedItem.color === color || (!selectedItem.color && color === '#8B4513') 
                      ? 'border-cyan-400 scale-110 shadow-lg' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                  title={`Furniture color: ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-xs text-white/60 bg-black/20 p-4 rounded-xl backdrop-blur-sm space-y-2">
            <p className="font-semibold text-white/80 flex items-center gap-1">
              <Sparkles size={12} className="animate-pulse" />
              Furniture Controls:
            </p>
            <p>• Drag sliders to adjust size and rotation</p>
            <p>• Click colors to change appearance</p>
            <p>• Changes apply immediately in 3D view</p>
          </div>
        </div>
      </div>
    </div>
  );
}