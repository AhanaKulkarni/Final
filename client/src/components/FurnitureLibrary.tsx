import React from 'react';
import { furnitureTemplates, createFurnitureItem } from '../lib/furniture-models';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function FurnitureLibrary() {
  const { addFurniture, editMode } = useRoomStore();
  
  if (editMode !== 'furniture') return null;
  
  const handleClick = (furnitureType: any) => {
    const furniture = createFurnitureItem(furnitureType, { x: 400, y: 300 });
    addFurniture(furniture);
  };
  
  return (
    <div className="fixed top-20 left-20 z-50 w-60">
      <div className="glass-ultra p-3">
        <div className="text-xs font-medium text-gray-900 mb-3 uppercase tracking-wide">
          Objects
        </div>
        
        <div className="space-y-1">
          {furnitureTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => handleClick(template.type)}
              className="w-full p-2 text-left hover:bg-gray-50 text-xs text-gray-700 
                       capitalize border-none bg-transparent"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}