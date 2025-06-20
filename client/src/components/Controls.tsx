import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, Move, RotateCw, Pencil, Hand, Home } from 'lucide-react';

export function Controls() {
  const { 
    editMode,
    setEditMode,
    clearRoom,
    isDrawingWall,
    setDrawingWall
  } = useRoomStore();
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Home size={20} />
            Room Designer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Edit Mode Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Edit Mode</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={editMode === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setEditMode('select');
                  setDrawingWall(false);
                }}
                className="flex items-center gap-1 text-xs"
              >
                <Hand size={12} />
                Select
              </Button>
              <Button
                variant={editMode === 'wall' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setEditMode('wall');
                  setDrawingWall(true);
                }}
                className="flex items-center gap-1 text-xs"
              >
                <Pencil size={12} />
                Walls
              </Button>
              <Button
                variant={editMode === 'furniture' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setEditMode('furniture');
                  setDrawingWall(false);
                }}
                className="flex items-center gap-1 text-xs"
              >
                <Move size={12} />
                Items
              </Button>
            </div>
          </div>
          
          {/* Clear Room Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={clearRoom}
            className="w-full text-sm"
          >
            <Trash2 size={14} className="mr-2" />
            Clear Room
          </Button>
          
          {/* Instructions based on mode */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
            {editMode === 'select' && (
              <>
                <p className="font-medium">Select Mode:</p>
                <p>• Click furniture to select and move</p>
                <p>• Drag corners to resize selected items</p>
                <p>• Use the detailed controls panel</p>
              </>
            )}
            {editMode === 'wall' && (
              <>
                <p className="font-medium">Wall Drawing:</p>
                <p>• Click to start a wall</p>
                <p>• Click again to finish the wall</p>
                <p>• Walls snap to grid for precision</p>
              </>
            )}
            {editMode === 'furniture' && (
              <>
                <p className="font-medium">Furniture Mode:</p>
                <p>• Drag from library to add items</p>
                <p>• Click items to add at center</p>
                <p>• Switch to select mode to edit</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
