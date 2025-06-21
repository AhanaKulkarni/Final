import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { DoorOpen, RectangleHorizontal, Trash2, Palette, Sparkles } from 'lucide-react';
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
    <div className="fixed top-20 right-6 w-80 z-40">
      <div className="glass-ultra p-6 rounded-2xl card-interactive">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 neon-glow">
            {selectedItem.type === 'door' ? (
              <DoorOpen size={20} className="text-white" />
            ) : (
              <RectangleHorizontal size={20} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white gradient-text">
              {selectedItem.type === 'door' ? 'Door' : 'Window'} Settings
            </h2>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" />
              Premium Customization
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Position Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">
              Position on Wall: {Math.round(selectedItem.position * 100)}%
            </label>
            <div className="relative">
              <Slider
                value={[selectedItem.position * 100]}
                onValueChange={updatePosition}
                min={5}
                max={95}
                step={1}
                className="w-full"
              />
              <div className="absolute -top-1 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Width Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">Width: {selectedItem.width}px</label>
            <div className="relative">
              <Slider
                value={[selectedItem.width]}
                onValueChange={updateWidth}
                min={selectedItem.type === 'door' ? 60 : 40}
                max={selectedItem.type === 'door' ? 120 : 200}
                step={5}
                className="w-full"
              />
              <div className="absolute -top-1 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Height Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">Height: {selectedItem.height}px</label>
            <div className="relative">
              <Slider
                value={[selectedItem.height]}
                onValueChange={updateHeight}
                min={selectedItem.type === 'door' ? 160 : 60}
                max={selectedItem.type === 'door' ? 220 : 140}
                step={5}
                className="w-full"
              />
              <div className="absolute -top-1 left-0 w-full h-full pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Palette size={14} />
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedItem.color === color || (!selectedItem.color && color === colors[0])
                      ? 'border-cyan-400 scale-110 shadow-lg' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                  title={`${selectedItem.type} color: ${color}`}
                />
              ))}
            </div>
          </div>
          
          {/* Delete Button */}
          <button
            onClick={() => removeDoorWindow(selectedItem.id)}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 
                     border border-red-500/30 text-white font-medium text-sm
                     hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/50
                     transition-all duration-300 group flex items-center justify-center gap-2"
          >
            <Trash2 size={14} className="transition-transform group-hover:scale-110" />
            Delete {selectedItem.type === 'door' ? 'Door' : 'Window'}
          </button>
          
          <div className="text-xs text-white/60 bg-black/20 p-4 rounded-xl backdrop-blur-sm space-y-2">
            <p className="font-semibold text-white/80 flex items-center gap-1">
              <Sparkles size={12} className="animate-pulse" />
              Instructions:
            </p>
            <p>• Drag position slider to move along wall</p>
            <p>• Adjust width and height as needed</p>
            <p>• Choose from preset colors</p>
            <p>• Changes appear in both 2D and 3D views</p>
          </div>
        </div>
      </div>
    </div>
  );
}