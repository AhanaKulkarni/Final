import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { ARPreview } from './ARPreview';
import { Edit3, Eye, Layers3, Camera } from 'lucide-react';

export function ViewToggle() {
  const { viewMode, setViewMode } = useRoomStore();
  const [showAR, setShowAR] = useState(false);
  
  return (
    <>
      <div className="fixed top-6 right-6 z-50 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
        <div className="flex gap-3">
          <Button
            variant={viewMode === '2d' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('2d')}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Edit3 size={18} />
            <span>2D Design</span>
          </Button>
          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('3d')}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Layers3 size={18} />
            <span>3D View</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAR(true)}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Camera size={18} />
            AR Preview
          </Button>
        </div>
      </div>
      
      {showAR && (
        <div onClick={() => setShowAR(false)}>
          <ARPreview />
        </div>
      )}
    </>
  );
}
