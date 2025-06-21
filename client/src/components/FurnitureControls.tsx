import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, RotateCw, Move3D, Palette } from 'lucide-react';

export function FurnitureControls() {
  const { 
    selectedFurniture, 
    removeFurniture, 
    updateFurniture, 
    currentRoom 
  } = useRoomStore();
  
  const selectedItem = selectedFurniture 
    ? currentRoom.furniture.find(f => f.id === selectedFurniture)
    : null;
  
  if (!selectedItem) return null;
  
  const rotateFurniture = () => {
    updateFurniture(selectedItem.id, {
      rotation: (selectedItem.rotation + 15) % 360
    });
  };

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
  
  const colors = ['#8B4513', '#D2B48C', '#F5F5DC', '#4682B4', '#654321', '#ff6b6b', '#4ecdc4', '#45b7d1'];
  
  return (
    <Card className="fixed top-20 right-4 w-80 bg-white/98 backdrop-blur-sm shadow-xl border border-stone-200 z-50">
      <CardHeader className="pb-3 border-b border-stone-100">
        <CardTitle className="text-lg flex items-center gap-2 text-stone-800">
          <Move3D size={20} className="text-stone-600" />
          {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={rotateFurniture}
            className="flex items-center gap-1 flex-1"
          >
            <RotateCw size={14} />
            Rotate 15°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeFurniture(selectedItem.id)}
            className="flex items-center gap-1 border-stone-400 text-stone-700 hover:bg-stone-100 hover:text-black"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
        
        {/* Rotation Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rotation: {selectedItem.rotation}°</label>
          <Slider
            value={[selectedItem.rotation]}
            onValueChange={updateRotation}
            min={0}
            max={360}
            step={15}
            className="w-full"
          />
        </div>

        {/* Scale Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Overall Size: {selectedItem.scale.toFixed(1)}x</label>
          <Slider
            value={[selectedItem.scale]}
            onValueChange={updateScale}
            min={0.3}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>
        
        {/* Dimension Controls */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Width: {selectedItem.width}px</label>
            <Slider
              value={[selectedItem.width]}
              onValueChange={updateWidth}
              min={20}
              max={300}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Height: {selectedItem.height}px</label>
            <Slider
              value={[selectedItem.height]}
              onValueChange={updateHeight}
              min={20}
              max={300}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Depth: {selectedItem.depth}px</label>
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
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Palette size={14} />
            Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedItem.color === color ? 'border-black scale-110' : 'border-stone-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => updateFurniture(selectedItem.id, { color })}
              />
            ))}
          </div>
        </div>
        
        {/* Position Info */}
        <div className="text-xs text-stone-600 bg-amber-50 p-2 rounded border border-amber-100">
          <div>Position: ({Math.round(selectedItem.position.x)}, {Math.round(selectedItem.position.y)})</div>
          <div>Rotation: {selectedItem.rotation}°</div>
        </div>
      </CardContent>
    </Card>
  );
}