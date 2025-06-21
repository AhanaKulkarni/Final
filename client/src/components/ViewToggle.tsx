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
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-xl border border-stone-200">
        <div className="flex gap-1 md:gap-2">
          <Button
            variant={viewMode === '2d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('2d')}
            className="text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 transition-all duration-200 touch-target"
          >
            <Edit3 size={14} className="md:hidden" />
            <Edit3 size={16} className="hidden md:block" />
            <span className="hidden sm:inline">2D Design</span>
            <span className="sm:hidden">2D</span>
          </Button>
          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('3d')}
            className="text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 transition-all duration-200 touch-target"
          >
            <Layers3 size={14} className="md:hidden" />
            <Layers3 size={16} className="hidden md:block" />
            <span className="hidden sm:inline">3D Preview</span>
            <span className="sm:hidden">3D</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAR(true)}
            className="text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 hover:from-amber-600 hover:to-orange-600 touch-target"
          >
            <Camera size={14} className="md:hidden" />
            <Camera size={16} className="hidden md:block" />
            AR
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
