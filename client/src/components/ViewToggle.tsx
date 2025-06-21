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
      <div className="fixed top-4 right-4 z-50 bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-stone-200">
        <div className="flex gap-3">
          <Button
            variant={viewMode === '2d' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('2d')}
            className="text-base flex items-center gap-3 px-6 py-3 transition-all duration-200"
          >
            <Edit3 size={20} />
            <span>2D Design</span>
          </Button>
          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('3d')}
            className="text-base flex items-center gap-3 px-6 py-3 transition-all duration-200"
          >
            <Layers3 size={20} />
            <span>3D View</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAR(true)}
            className="text-base flex items-center gap-3 px-6 py-3 transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 hover:from-amber-600 hover:to-orange-600"
          >
            <Camera size={20} />
            AR Preview
          </Button>
        </div>
        
        {/* Status indicator - hide on very small screens */}
        <div className="hidden md:block text-xs text-stone-600 mt-2 text-center">
          {viewMode === '2d' ? 'Design your room layout' : 'Explore in 3D'}
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
