import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Edit3, Eye, Layers3 } from 'lucide-react';

export function ViewToggle() {
  const { viewMode, setViewMode } = useRoomStore();
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-stone-200">
      <div className="flex gap-2">
        <Button
          variant={viewMode === '2d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('2d')}
          className="text-sm flex items-center gap-2 px-4 py-2 transition-all duration-200"
        >
          <Edit3 size={16} />
          2D Design
        </Button>
        <Button
          variant={viewMode === '3d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('3d')}
          className="text-sm flex items-center gap-2 px-4 py-2 transition-all duration-200"
        >
          <Layers3 size={16} />
          3D Preview
        </Button>
      </div>
      
      {/* Status indicator */}
      <div className="text-xs text-gray-600 mt-2 text-center">
        {viewMode === '2d' ? 'Design your room layout' : 'Explore in 3D'}
      </div>
    </div>
  );
}
