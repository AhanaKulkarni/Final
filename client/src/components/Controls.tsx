import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, Move, RotateCw } from 'lucide-react';

export function Controls() {
  const { 
    selectedFurniture, 
    removeFurniture, 
    updateFurniture, 
    currentRoom,
    clearRoom,
    isDrawingWall,
    setDrawingWall
  } = useRoomStore();
  
  const selectedItem = selectedFurniture 
    ? currentRoom.furniture.find(f => f.id === selectedFurniture)
    : null;
  
  const rotateFurniture = () => {
    if (selectedItem) {
      updateFurniture(selectedItem.id, {
        rotation: (selectedItem.rotation + 90) % 360
      });
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Room Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={isDrawingWall ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDrawingWall(!isDrawingWall)}
              className="flex-1 text-sm"
            >
              {isDrawingWall ? 'Stop Drawing' : 'Draw Walls'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearRoom}
              className="text-sm"
            >
              Clear Room
            </Button>
          </div>
          
          {selectedItem && (
            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2">
                Selected: {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateFurniture}
                  className="flex items-center gap-1 text-sm"
                >
                  <RotateCw size={14} />
                  Rotate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFurniture(selectedItem.id)}
                  className="flex items-center gap-1 text-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Click and drag to draw walls</p>
            <p>• Drag furniture from library to place</p>
            <p>• Click furniture to select and move</p>
            <p>• Switch to 3D view to see your room</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
