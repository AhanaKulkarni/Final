import React from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Edit3, Layers3, Sparkles } from 'lucide-react';

export function ViewToggle() {
  const { viewMode, setViewMode } = useRoomStore();
  
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="glass-ultra p-3 rounded-2xl float-animation">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('2d')}
            className={`
              relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 
              flex items-center gap-2 group overflow-hidden
              ${viewMode === '2d' 
                ? 'btn-premium text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <div className="relative z-10 flex items-center gap-2">
              <Edit3 size={16} className="transition-transform group-hover:scale-110" />
              <span>2D Design</span>
            </div>
            {viewMode === '2d' && (
              <div className="absolute inset-0 shimmer-effect rounded-xl"></div>
            )}
          </button>
          
          <button
            onClick={() => setViewMode('3d')}
            className={`
              relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 
              flex items-center gap-2 group overflow-hidden
              ${viewMode === '3d' 
                ? 'btn-premium text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <div className="relative z-10 flex items-center gap-2">
              <Layers3 size={16} className="transition-transform group-hover:scale-110" />
              <span>3D View</span>
            </div>
            {viewMode === '3d' && (
              <div className="absolute inset-0 shimmer-effect rounded-xl"></div>
            )}
          </button>
        </div>
        
        {/* Premium indicator */}
        <div className="flex items-center justify-center mt-3 text-xs text-white/60">
          <Sparkles size={12} className="mr-1 animate-pulse" />
          <span className="gradient-text">Premium Designer</span>
        </div>
        
        {/* Status indicator */}
        <div className="text-xs text-white/50 mt-1 text-center">
          {viewMode === '2d' ? 'Design Mode Active' : 'Preview Mode Active'}
        </div>
      </div>
    </div>
  );
}
