import React from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, Move, Pencil, Hand, Home, DoorOpen, RectangleHorizontal } from 'lucide-react';

export function Controls() {
  const { 
    editMode,
    setEditMode,
    clearRoom,
    isDrawingWall,
    setDrawingWall
  } = useRoomStore();
  
  return (
    <div className="fixed bottom-20 left-20 z-50">
      <div className="glass-ultra p-4 w-72">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-4 h-4 bg-black"></div>
          <div>
            <h2 className="text-sm font-medium text-black uppercase tracking-widest">Room Designer</h2>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="text-xs text-black uppercase tracking-widest font-medium">Mode</div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  setEditMode('select');
                  setDrawingWall(false);
                }}
                className={`
                  px-2 py-2 text-xs font-medium uppercase tracking-wide
                  ${editMode === 'select' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                Select
              </button>
              <button
                onClick={() => {
                  setEditMode('wall');
                  setDrawingWall(true);
                }}
                className={`
                  px-2 py-2 text-xs font-medium uppercase tracking-wide
                  ${editMode === 'wall' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                Walls
              </button>
              <button
                onClick={() => {
                  setEditMode('furniture');
                  setDrawingWall(false);
                }}
                className={`
                  px-2 py-2 text-xs font-medium uppercase tracking-wide
                  ${editMode === 'furniture' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                Items
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setEditMode('door');
                  setDrawingWall(false);
                }}
                className={`
                  px-2 py-2 text-xs font-medium uppercase tracking-wide
                  ${editMode === 'door' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                Doors
              </button>
              <button
                onClick={() => {
                  setEditMode('window');
                  setDrawingWall(false);
                }}
                className={`
                  px-2 py-2 text-xs font-medium uppercase tracking-wide
                  ${editMode === 'window' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                Windows
              </button>
            </div>
          </div>
          
          <button
            onClick={clearRoom}
            className="w-full px-3 py-2 bg-white border border-gray-400 text-black text-xs 
                     font-medium hover:bg-gray-50 uppercase tracking-wide"
          >
            Clear Room
          </button>
        </div>
      </div>
    </div>
  );
}