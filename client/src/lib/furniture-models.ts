import { FurnitureItem } from "../types/room";

export interface FurnitureTemplate {
  type: FurnitureItem['type'];
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  color: string;
  icon: string;
}

export const furnitureTemplates: FurnitureTemplate[] = [
  {
    type: 'chair',
    name: 'Chair',
    defaultWidth: 50,
    defaultHeight: 50,
    defaultDepth: 50,
    color: '#8B4513',
    icon: '🪑'
  },
  {
    type: 'table',
    name: 'Table',
    defaultWidth: 120,
    defaultHeight: 80,
    defaultDepth: 80,
    color: '#D2B48C',
    icon: '🪧'
  },
  {
    type: 'bed',
    name: 'Bed',
    defaultWidth: 200,
    defaultHeight: 120,
    defaultDepth: 80,
    color: '#F5F5DC',
    icon: '🛏️'
  },
  {
    type: 'sofa',
    name: 'Sofa',
    defaultWidth: 180,
    defaultHeight: 80,
    defaultDepth: 80,
    color: '#4682B4',
    icon: '🛋️'
  },
  {
    type: 'desk',
    name: 'Desk',
    defaultWidth: 140,
    defaultHeight: 70,
    defaultDepth: 70,
    color: '#8B4513',
    icon: '🗄️'
  },
  {
    type: 'wardrobe',
    name: 'Wardrobe',
    defaultWidth: 100,
    defaultHeight: 60,
    defaultDepth: 180,
    color: '#654321',
    icon: '🚪'
  }
];

export function createFurnitureItem(
  type: FurnitureItem['type'],
  position: { x: number; y: number }
): FurnitureItem {
  const template = furnitureTemplates.find(t => t.type === type);
  if (!template) throw new Error(`Unknown furniture type: ${type}`);
  
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    position,
    rotation: 0,
    width: template.defaultWidth,
    height: template.defaultHeight,
    depth: template.defaultDepth
  };
}
