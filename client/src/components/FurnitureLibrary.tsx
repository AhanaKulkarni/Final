import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { furnitureTemplates, createFurnitureItem } from '../lib/furniture-models';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function FurnitureLibrary() {
  const { addFurniture } = useRoomStore();
  
  const handleDragStart = (e: React.DragEvent, furnitureType: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'furniture',
      furnitureType
    }));
  };
  
  const handleClick = (furnitureType: any) => {
    // Add furniture at center of room when clicked
    const furniture = createFurnitureItem(furnitureType, { x: 300, y: 250 });
    addFurniture(furniture);
  };
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <Card className="w-64 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Furniture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {furnitureTemplates.map((template) => (
              <div
                key={template.type}
                draggable
                onDragStart={(e) => handleDragStart(e, template.type)}
                onClick={() => handleClick(template.type)}
                className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors text-center"
              >
                <div className="text-2xl mb-1">{template.icon}</div>
                <div className="text-xs font-medium text-gray-700">
                  {template.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Drag or click to add furniture
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
