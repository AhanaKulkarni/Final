import React from 'react';
import { furnitureTemplates, createFurnitureItem } from '../lib/furniture-models';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Package } from 'lucide-react';

export function FurnitureLibrary() {
  const { addFurniture, editMode } = useRoomStore();
  
  if (editMode !== 'furniture') return null;
  
  const handleClick = (furnitureType: any) => {
    const furniture = createFurnitureItem(furnitureType, { x: 400, y: 300 });
    addFurniture(furniture);
  };
  
  return (
    <div className="fixed top-6 left-6 z-50 w-80">
      <div className="glass-ultra p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/20">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Furniture Library</h2>
            <p className="text-xs text-white/60">Select items to add</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
          {furnitureTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => handleClick(template.type)}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10
                       hover:bg-white/10 hover:border-white/20 transition-all duration-200
                       text-center"
            >
              <div className="text-3xl mb-2">
                {template.icon}
              </div>
              <div className="text-sm font-semibold text-white capitalize mb-1">
                {template.name}
              </div>
              <div className="text-xs text-white/60">
                {template.defaultWidth}×{template.defaultHeight}
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-xs text-white/60 mt-6 p-4 bg-black/20 rounded-xl backdrop-blur-sm space-y-2">
          <p className="font-semibold text-white/80">Furniture Library:</p>
          <p>• Click any item to add to your room</p>
          <p>• Switch to Select mode to customize</p>
          <p>• Full control over size, position & color</p>
        </div>
      </div>
    </div>
  );
}