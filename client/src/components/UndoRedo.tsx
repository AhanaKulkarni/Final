import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Undo2, Redo2 } from 'lucide-react';

export function UndoRedo() {
  const { canUndo, canRedo, undo, redo } = useRoomStore();
  
  return (
    <div className="fixed top-2 left-2 md:top-4 md:left-4 z-50 bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-xl border border-stone-200">
      <div className="flex gap-1 md:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          className="text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 transition-all duration-200 disabled:opacity-50 touch-target"
          title="Undo last action"
        >
          <Undo2 size={14} className="md:hidden" />
          <Undo2 size={16} className="hidden md:block" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          className="text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 transition-all duration-200 disabled:opacity-50 touch-target"
          title="Redo last undone action"
        >
          <Redo2 size={14} className="md:hidden" />
          <Redo2 size={16} className="hidden md:block" />
          <span className="hidden sm:inline">Redo</span>
        </Button>
      </div>
    </div>
  );
}