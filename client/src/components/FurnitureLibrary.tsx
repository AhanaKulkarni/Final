import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { furnitureTemplates, createFurnitureItem } from '../lib/furniture-models';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Package, Plus } from 'lucide-react';

export function FurnitureLibrary() {
  const { addFurniture, editMode } = useRoomStore();
  
  const handleDragStart = (e: React.DragEvent, furnitureType: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'furniture',
      furnitureType
    }));
  };
  
  const handleClick = (furnitureType: any) => {
    // Add furniture at center of room when clicked
    const furniture = createFurnitureItem(furnitureType, { x: 400, y: 300 });
    addFurniture(furniture);
  };
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <Card className="w-72 bg-white/98 backdrop-blur-sm shadow-xl border border-stone-200">
        <CardHeader className="pb-3 border-b border-stone-100">
          <CardTitle className="text-lg flex items-center gap-2 text-stone-800">
            <Package size={20} className="text-stone-600" />
            Furniture Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {furnitureTemplates.map((template) => (
              <div
                key={template.type}
                draggable
                onDragStart={(e) => handleDragStart(e, template.type)}
                onClick={() => handleClick(template.type)}
                className="group relative p-4 bg-gradient-to-br from-stone-50 to-amber-50 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 hover:from-amber-50 hover:to-amber-100 cursor-pointer transition-all duration-200 text-center transform hover:scale-105"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {template.icon}
                </div>
                <div className="text-xs font-semibold text-stone-700 group-hover:text-amber-700">
                  {template.name}
                </div>
                
                {/* Add indicator */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Plus size={12} className="text-white" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-medium text-blue-800 mb-1">
              Quick Tips:
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Drag items onto canvas to place precisely</p>
              <p>• Click to add items at room center</p>
              <p>• Switch to Select mode to edit items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
