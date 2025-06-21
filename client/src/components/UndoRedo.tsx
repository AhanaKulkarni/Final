import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Undo2, Redo2 } from 'lucide-react';

export function UndoRedo() {
  const { canUndo, canRedo, undo, redo } = useRoomStore();
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-stone-200">
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={undo}
          disabled={!canUndo}
          className="text-base flex items-center gap-3 px-6 py-3 transition-all duration-200 disabled:opacity-50"
          title="Undo last action"
        >
          <Undo2 size={20} />
          <span>Undo</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={redo}
          disabled={!canRedo}
          className="text-base flex items-center gap-3 px-6 py-3 transition-all duration-200 disabled:opacity-50"
          title="Redo last undone action"
        >
          <Redo2 size={20} />
          <span>Redo</span>
        </Button>
      </div>
    </div>
  );
}