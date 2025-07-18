export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  start: Point;
  end: Point;
  thickness: number;
  color?: string;
}

export interface DoorWindow {
  id: string;
  type: 'door' | 'window';
  wallIndex: number;
  position: number; // 0-1 representing position along wall
  width: number;
  height: number;
  color?: string;
}

export interface FurnitureItem {
  id: string;
  type: 'chair' | 'table' | 'bed' | 'sofa' | 'desk' | 'wardrobe';
  position: Point;
  rotation: number;
  width: number;
  height: number;
  depth: number; // for 3D
  scale: number; // for resizing
  color?: string; // custom color
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  furniture: FurnitureItem[];
  doors: DoorWindow[];
  windows: DoorWindow[];
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
