import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function FurnitureControls() {
  const { 
    currentRoom, 
    selectedFurniture, 
    updateFurniture, 
    removeFurniture 
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
    <div className="fixed top-20 right-6 w-72 z-40">
      <div className="glass-ultra p-4">
        <h3 className="text-white font-medium mb-3">Furniture Settings</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => updateFurniture(selectedItem.id, { rotation: (selectedItem.rotation + 15) % 360 })}
              className="btn-secondary flex-1"
            >
              Rotate 15°
            </button>
            <button
              onClick={() => removeFurniture(selectedItem.id)}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Rotation: {selectedItem.rotation}°
            </label>
            <Slider
              value={[selectedItem.rotation]}
              onValueChange={updateRotation}
              min={0}
              max={360}
              step={15}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Size: {selectedItem.scale.toFixed(1)}x
            </label>
            <Slider
              value={[selectedItem.scale]}
              onValueChange={updateScale}
              min={0.3}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">Dimensions</label>
            
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400">Width: {selectedItem.width}px</label>
                <Slider
                  value={[selectedItem.width]}
                  onValueChange={updateWidth}
                  min={20}
                  max={300}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Height: {selectedItem.height}px</label>
                <Slider
                  value={[selectedItem.height]}
                  onValueChange={updateHeight}
                  min={20}
                  max={300}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Depth: {selectedItem.depth}px</label>
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
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-2">Color</label>
            <div className="grid grid-cols-4 gap-1">
              {furnitureColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedItem.color === color || (!selectedItem.color && color === '#8B4513') 
                      ? 'border-blue-400' 
                      : 'border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}