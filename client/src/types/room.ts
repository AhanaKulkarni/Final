export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  start: Point;
  end: Point;
  thickness: number;
}

export interface FurnitureItem {
  id: string;
  type: 'chair' | 'table' | 'bed' | 'sofa' | 'desk' | 'wardrobe';
  position: Point;
  rotation: number;
  width: number;
  height: number;
  depth?: number; // for 3D
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  furniture: FurnitureItem[];
  width: number;
  height: number;
}

export type ViewMode = '2d' | '3d';

export interface RoomBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
