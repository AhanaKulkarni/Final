import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, Move, RotateCw, Pencil, Hand, Home, DoorOpen, RectangleHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export function Controls() {
  const { 
    editMode,
    setEditMode,
    clearRoom,
    isDrawingWall,
    setDrawingWall
  } = useRoomStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-white/98 backdrop-blur-sm shadow-xl border border-stone-200">
        <CardHeader className="pb-2 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-stone-800">
              <Home size={20} className="text-stone-600" />
              Room Designer
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent className="space-y-4 p-3">
            {/* Edit Mode Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Edit Mode</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-stone-50 rounded-lg border border-stone-200">
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
                    setDrawingWall(false);
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
              
              {/* Secondary mode row for doors and windows */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-amber-50 rounded-lg border border-amber-100">
                <Button
                  variant={editMode === 'door' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setEditMode('door');
                    setDrawingWall(false);
                  }}
                  className="flex items-center gap-1 text-xs"
                >
                  <DoorOpen size={12} />
                  Doors
                </Button>
                <Button
                  variant={editMode === 'window' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setEditMode('window');
                    setDrawingWall(false);
                  }}
                  className="flex items-center gap-1 text-xs"
                >
                  <RectangleHorizontal size={12} />
                  Windows
                </Button>
              </div>
            </div>
            
            {/* Clear Room Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearRoom}
              className="w-full text-sm border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-800"
            >
              <Trash2 size={14} className="mr-2" />
              Clear Room
            </Button>
            
            {/* Instructions based on mode */}
            <div className="text-xs text-stone-600 bg-amber-50 p-3 rounded-lg border border-amber-100 space-y-1">
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
        )}
      </Card>
    </div>
  );
}