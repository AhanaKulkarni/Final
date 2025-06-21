import React from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Trash2, Move, Pencil, Hand, Home, DoorOpen, RectangleHorizontal, Sparkles } from 'lucide-react';

export function Controls() {
  const { 
    editMode,
    setEditMode,
    clearRoom,
    isDrawingWall,
    setDrawingWall
  } = useRoomStore();
  
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="glass-ultra p-6 rounded-2xl w-80 card-interactive">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 neon-glow">
            <Home size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white gradient-text">Room Designer</h2>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" />
              Premium Edition
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Edit Mode Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80">Design Tools</label>
            <div className="grid grid-cols-3 gap-2 p-2 bg-black/20 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => {
                  setEditMode('select');
                  setDrawingWall(false);
                }}
                className={`
                  relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center justify-center gap-1 group
                  ${editMode === 'select' 
                    ? 'btn-premium text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Hand size={12} className="transition-transform group-hover:scale-110" />
                <span>Select</span>
              </button>
              <button
                onClick={() => {
                  setEditMode('wall');
                  setDrawingWall(true);
                }}
                className={`
                  relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center justify-center gap-1 group
                  ${editMode === 'wall' 
                    ? 'btn-premium text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Pencil size={12} className="transition-transform group-hover:scale-110" />
                <span>Walls</span>
              </button>
              <button
                onClick={() => {
                  setEditMode('furniture');
                  setDrawingWall(false);
                }}
                className={`
                  relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center justify-center gap-1 group
                  ${editMode === 'furniture' 
                    ? 'btn-premium text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Move size={12} className="transition-transform group-hover:scale-110" />
                <span>Items</span>
              </button>
            </div>
            
            {/* Secondary mode row for doors and windows */}
            <div className="grid grid-cols-2 gap-2 p-2 bg-black/10 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => {
                  setEditMode('door');
                  setDrawingWall(false);
                }}
                className={`
                  relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center justify-center gap-1 group
                  ${editMode === 'door' 
                    ? 'btn-secondary text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <DoorOpen size={12} className="transition-transform group-hover:scale-110" />
                <span>Doors</span>
              </button>
              <button
                onClick={() => {
                  setEditMode('window');
                  setDrawingWall(false);
                }}
                className={`
                  relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center justify-center gap-1 group
                  ${editMode === 'window' 
                    ? 'btn-secondary text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <RectangleHorizontal size={12} className="transition-transform group-hover:scale-110" />
                <span>Windows</span>
              </button>
            </div>
          </div>
          
          {/* Clear Room Button */}
          <button
            onClick={clearRoom}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 
                     border border-red-500/30 text-white font-medium text-sm
                     hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/50
                     transition-all duration-300 group flex items-center justify-center gap-2"
          >
            <Trash2 size={14} className="transition-transform group-hover:scale-110" />
            Clear Room
          </button>
          
          {/* Instructions based on mode */}
          <div className="text-xs text-white/60 bg-black/20 p-4 rounded-xl backdrop-blur-sm space-y-2">
            {editMode === 'select' && (
              <>
                <p className="font-semibold text-white/80">Select Mode:</p>
                <p>• Click furniture to select and move</p>
                <p>• Drag resize handles to change size</p>
                <p>• Use controls panel for adjustments</p>
              </>
            )}
            {editMode === 'wall' && (
              <>
                <p className="font-semibold text-white/80">Wall Mode:</p>
                <p>• Click to start drawing a wall</p>
                <p>• Click again to finish the wall</p>
                <p>• Walls snap to grid for precision</p>
              </>
            )}
            {editMode === 'furniture' && (
              <>
                <p className="font-semibold text-white/80">Furniture Mode:</p>
                <p>• Choose items from the library</p>
                <p>• Click to place in the room</p>
                <p>• Switch to Select to adjust</p>
              </>
            )}
            {editMode === 'door' && (
              <>
                <p className="font-semibold text-white/80">Door Mode:</p>
                <p>• Click on any wall to add doors</p>
                <p>• Select doors to customize position</p>
                <p>• Adjust size and color options</p>
              </>
            )}
            {editMode === 'window' && (
              <>
                <p className="font-semibold text-white/80">Window Mode:</p>
                <p>• Click on any wall to add windows</p>
                <p>• Select windows to customize position</p>
                <p>• Adjust size and color options</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}