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
        <div className="text-xs font-medium text-black mb-4 uppercase tracking-widest">
          Properties
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Rotation</div>
            <Slider
              value={[selectedItem.rotation]}
              onValueChange={updateRotation}
              min={0}
              max={360}
              step={15}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{selectedItem.rotation}°</div>
          </div>

          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Scale</div>
            <Slider
              value={[selectedItem.scale]}
              onValueChange={updateScale}
              min={0.3}
              max={3.0}
              step={0.1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{selectedItem.scale.toFixed(1)}x</div>
          </div>
          
          <div>
            <div className="text-xs text-black mb-2 uppercase tracking-wide">Material</div>
            <div className="grid grid-cols-4 gap-2">
              {furnitureColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 border ${
                    selectedItem.color === color || (!selectedItem.color && color === '#8B4513') 
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
            onClick={() => removeFurniture(selectedItem.id)}
            className="w-full text-xs text-black hover:text-gray-600 py-2 border-t border-gray-300 mt-4 pt-3 uppercase tracking-wide"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}