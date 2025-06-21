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

  const updateColor = (color: string) => {
    updateFurniture(selectedItem.id, { color });
  };

  const furnitureColors = [
    '#8B4513', '#D2691E', '#CD853F', '#DEB887',
    '#FFFFFF', '#F5F5F5', '#DCDCDC', '#C0C0C0',
    '#000000', '#2F4F4F', '#696969', '#708090'
  ];

  return (
    <div className="fixed top-20 right-20 w-56 z-40">
      <div className="glass-ultra p-3">
        <div className="text-xs font-medium text-gray-900 mb-3 uppercase tracking-wide">
          Properties
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-600 mb-1">Rotation</div>
            <Slider
              value={[selectedItem.rotation]}
              onValueChange={updateRotation}
              min={0}
              max={360}
              step={15}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{selectedItem.rotation}°</div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">Scale</div>
            <Slider
              value={[selectedItem.scale]}
              onValueChange={updateScale}
              min={0.3}
              max={3.0}
              step={0.1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{selectedItem.scale.toFixed(1)}x</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-600 mb-2">Material</div>
            <div className="grid grid-cols-4 gap-1">
              {furnitureColors.map((color) => (
                <button
                  key={color}
                  className={`w-4 h-4 border ${
                    selectedItem.color === color || (!selectedItem.color && color === '#8B4513') 
                      ? 'border-black border-2' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(color)}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => removeFurniture(selectedItem.id)}
            className="w-full text-xs text-gray-600 hover:text-black py-1 border-t border-gray-200 mt-3 pt-2"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}