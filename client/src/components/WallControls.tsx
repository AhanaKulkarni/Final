import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Palette, Home } from 'lucide-react';

export function WallControls() {
  const { currentRoom, updateWall } = useRoomStore();
  const [selectedWallIndex, setSelectedWallIndex] = useState<number | null>(null);
  
  const wallColors = [
    '#f5f5f5', // Default light gray
    '#ffffff', // White
    '#e8f4f8', // Light blue
    '#f0f8e8', // Light green
    '#fff8e8', // Light yellow
    '#f8e8f0', // Light pink
    '#e8e8f8', // Light purple
    '#d4b896', // Beige
    '#c8a882', // Tan
    '#b8860b', // Dark goldenrod
  ];
  
  const selectedWall = selectedWallIndex !== null ? currentRoom.walls[selectedWallIndex] : null;
  
  const updateWallColor = (color: string) => {
    if (selectedWallIndex !== null) {
      updateWall(selectedWallIndex, { color });
    }
  };
  
  if (currentRoom.walls.length === 0) {
    return null;
  }
  
  return (
    <Card className="fixed top-20 left-4 w-72 bg-white/98 backdrop-blur-sm shadow-xl border border-stone-200 z-40">
      <CardHeader className="pb-3 border-b border-stone-100">
        <CardTitle className="text-lg flex items-center gap-2 text-stone-800">
          <Home size={20} className="text-stone-600" />
          Wall Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wall Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Select Wall</label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {currentRoom.walls.map((wall, index) => (
              <Button
                key={index}
                variant={selectedWallIndex === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedWallIndex(index)}
                className="text-xs justify-start"
              >
                Wall {index + 1}
              </Button>
            ))}
          </div>
        </div>
        
        {selectedWall && (
          <>
            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Palette size={14} />
                Wall Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {wallColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedWall.color === color || (!selectedWall.color && color === '#f5f5f5') 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateWallColor(color)}
                    title={`Wall color: ${color}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Apply to All Walls */}
            <Button
              onClick={() => {
                const color = selectedWall.color || '#f5f5f5';
                currentRoom.walls.forEach((_, index) => {
                  updateWall(index, { color });
                });
              }}
              className="w-full text-sm"
              variant="outline"
            >
              Apply to All Walls
            </Button>
          </>
        )}
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Wall Customization:</p>
          <p>• Select a wall to change its color</p>
          <p>• Changes appear in both 2D and 3D views</p>
          <p>• Apply colors to all walls at once</p>
        </div>
      </CardContent>
    </Card>
  );
}