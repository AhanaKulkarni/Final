import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function ViewToggle() {
  const { viewMode, setViewMode } = useRoomStore();
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
      <div className="flex gap-2">
        <Button
          variant={viewMode === '2d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('2d')}
          className="text-sm"
        >
          2D Edit
        </Button>
        <Button
          variant={viewMode === '3d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('3d')}
          className="text-sm"
        >
          3D View
        </Button>
      </div>
    </div>
  );
}
