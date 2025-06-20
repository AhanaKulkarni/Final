import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { DoorOpen, RectangleHorizontal, Trash2, Palette } from 'lucide-react';
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
    '#8B4513', // Brown
    '#654321', // Dark brown
    '#A0522D', // Sienna
    '#FFFFFF', // White
    '#F5F5DC', // Beige
    '#2F4F4F', // Dark slate gray
    '#800000', // Maroon
    '#000080', // Navy
  ];
  
  const windowColors = [
    '#4169E1', // Royal blue
    '#87CEEB', // Sky blue
    '#E6E6FA', // Lavender
    '#F0F8FF', // Alice blue
    '#FFFFFF', // White
    '#C0C0C0', // Silver
    '#708090', // Slate gray
    '#2F4F4F', // Dark slate gray
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
    <Card className="fixed top-20 right-4 w-72 bg-white/95 backdrop-blur-sm shadow-xl border-0 z-40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {selectedItem.type === 'door' ? (
            <DoorOpen size={20} />
          ) : (
            <RectangleHorizontal size={20} />
          )}
          {selectedItem.type === 'door' ? 'Door' : 'Window'} Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
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
        
        {/* Width Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Width: {selectedItem.width}px</label>
          <Slider
            value={[selectedItem.width]}
            onValueChange={updateWidth}
            min={selectedItem.type === 'door' ? 60 : 40}
            max={selectedItem.type === 'door' ? 120 : 200}
            step={5}
            className="w-full"
          />
        </div>
        
        {/* Height Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Height: {selectedItem.height}px</label>
          <Slider
            value={[selectedItem.height]}
            onValueChange={updateHeight}
            min={selectedItem.type === 'door' ? 160 : 60}
            max={selectedItem.type === 'door' ? 220 : 140}
            step={5}
            className="w-full"
          />
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
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedItem.color === color || (!selectedItem.color && color === colors[0])
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => updateColor(color)}
                title={`${selectedItem.type} color: ${color}`}
              />
            ))}
          </div>
        </div>
        
        {/* Delete Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeDoorWindow(selectedItem.id)}
          className="w-full flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete {selectedItem.type === 'door' ? 'Door' : 'Window'}
        </Button>
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Instructions:</p>
          <p>• Drag position slider to move along wall</p>
          <p>• Adjust width and height as needed</p>
          <p>• Choose from preset colors</p>
          <p>• Changes appear in both 2D and 3D views</p>
        </div>
      </CardContent>
    </Card>
  );
}