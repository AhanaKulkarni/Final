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
    <div className="fixed top-6 left-6 z-50 w-72">
      <div className="glass-ultra p-4">
        <h3 className="text-white font-medium mb-3">Furniture Library</h3>
        
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {furnitureTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => handleClick(template.type)}
              className="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 
                       rounded text-center text-white text-sm"
            >
              <div className="text-2xl mb-1">{template.icon}</div>
              <div className="font-medium capitalize">{template.name}</div>
              <div className="text-xs text-gray-400">
                {template.defaultWidth}×{template.defaultHeight}
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-xs text-gray-400 mt-3 p-2 bg-gray-800 rounded">
          Click any item to add to your room
        </div>
      </div>
    </div>
  );
}