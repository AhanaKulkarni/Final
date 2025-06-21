import React from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function ViewToggle() {
  const { viewMode, setViewMode } = useRoomStore();
  
  return (
    <div className="fixed top-20 right-20 z-50">
      <div className="glass-ultra p-3">
        <div className="text-xs font-medium text-black mb-3 uppercase tracking-widest">
          View
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('2d')}
            className={`
              px-4 py-2 text-xs font-medium uppercase tracking-wide
              ${viewMode === '2d' 
                ? 'bg-black text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            2D
          </button>
          
          <button
            onClick={() => setViewMode('3d')}
            className={`
              px-4 py-2 text-xs font-medium uppercase tracking-wide
              ${viewMode === '3d' 
                ? 'bg-black text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            3D
          </button>
        </div>
      </div>
    </div>
  );
}
