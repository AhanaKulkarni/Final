import { Point, Wall, FurnitureItem, RoomBounds } from "../types/room";

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function isPointNearWall(point: Point, wall: Wall, threshold: number = 10): boolean {
  const { start, end } = wall;
  const wallLength = getDistance(start, end);
  const distToStart = getDistance(point, start);
  const distToEnd = getDistance(point, end);
  
  // Check if point is near the line segment
  const distToLine = Math.abs(
    ((end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x) /
    Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2))
  );
  
  return distToLine <= threshold && distToStart + distToEnd <= wallLength + threshold;
}

export function isPointInFurniture(point: Point, furniture: FurnitureItem): boolean {
  const { position, width, height, rotation } = furniture;
  
  // Simple AABB collision for now (ignoring rotation for simplicity)
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  return point.x >= position.x - halfWidth &&
         point.x <= position.x + halfWidth &&
         point.y >= position.y - halfHeight &&
         point.y <= position.y + halfHeight;
}

export function checkFurnitureCollision(furniture1: FurnitureItem, furniture2: FurnitureItem): boolean {
  const hw1 = furniture1.width / 2;
  const hh1 = furniture1.height / 2;
  const hw2 = furniture2.width / 2;
  const hh2 = furniture2.height / 2;
  
  return !(furniture1.position.x + hw1 < furniture2.position.x - hw2 ||
           furniture1.position.x - hw1 > furniture2.position.x + hw2 ||
           furniture1.position.y + hh1 < furniture2.position.y - hh2 ||
           furniture1.position.y - hh1 > furniture2.position.y + hh2);
}

export function getRoomBounds(walls: Wall[]): RoomBounds {
  if (walls.length === 0) {
    return { minX: 0, maxX: 600, minY: 0, maxY: 500 };
  }
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  walls.forEach(wall => {
    minX = Math.min(minX, wall.start.x, wall.end.x);
    maxX = Math.max(maxX, wall.start.x, wall.end.x);
    minY = Math.min(minY, wall.start.y, wall.end.y);
    maxY = Math.max(maxY, wall.start.y, wall.end.y);
  });
  
  return { minX, maxX, minY, maxY };
}

export function snapToGrid(point: Point, gridSize: number = 10): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}
