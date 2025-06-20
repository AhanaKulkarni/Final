import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { createFurnitureItem } from '../lib/furniture-models';
import { Point, FurnitureItem } from '../types/room';
import { isPointInFurniture, snapToGrid } from '../lib/room-utils';

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  
  const {
    currentRoom,
    selectedFurniture,
    isDrawingWall,
    currentWallStart,
    addWall,
    addFurniture,
    updateFurniture,
    selectFurniture,
    setCurrentWallStart
  } = useRoomStore();
  
  const drawRoom = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw walls
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    currentRoom.walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      ctx.stroke();
    });
    
    // Draw furniture
    currentRoom.furniture.forEach(furniture => {
      const isSelected = furniture.id === selectedFurniture;
      
      ctx.save();
      ctx.translate(furniture.position.x, furniture.position.y);
      ctx.rotate((furniture.rotation * Math.PI) / 180);
      
      // Draw furniture rectangle
      const color = isSelected ? '#ff6b6b' : '#4a90e2';
      ctx.fillStyle = color;
      ctx.fillRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);
      
      // Draw border
      ctx.strokeStyle = isSelected ? '#d63031' : '#2d3436';
      ctx.lineWidth = 2;
      ctx.strokeRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);
      
      // Draw furniture label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        furniture.type.charAt(0).toUpperCase() + furniture.type.slice(1),
        0,
        4
      );
      
      ctx.restore();
    });
    
    // Draw current wall being drawn
    if (isDrawingWall && currentWallStart) {
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 8;
      ctx.setLineDash([10, 5]);
      
      ctx.beginPath();
      ctx.moveTo(currentWallStart.x, currentWallStart.y);
      // This would need mouse position, but for now just show the start point
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [currentRoom, selectedFurniture, isDrawingWall, currentWallStart]);
  
  useEffect(() => {
    drawRoom();
  }, [drawRoom]);
  
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const snappedPos = snapToGrid(pos);
    
    if (isDrawingWall) {
      if (!currentWallStart) {
        setCurrentWallStart(snappedPos);
      } else {
        // Complete the wall
        addWall({
          start: currentWallStart,
          end: snappedPos,
          thickness: 10
        });
        setCurrentWallStart(null);
      }
      return;
    }
    
    // Check if clicking on furniture
    const clickedFurniture = currentRoom.furniture.find(furniture =>
      isPointInFurniture(pos, furniture)
    );
    
    if (clickedFurniture) {
      selectFurniture(clickedFurniture.id);
      setIsDragging(true);
      setDragOffset({
        x: pos.x - clickedFurniture.position.x,
        y: pos.y - clickedFurniture.position.y
      });
    } else {
      selectFurniture(null);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedFurniture) return;
    
    const pos = getMousePos(e);
    const newPosition = {
      x: pos.x - dragOffset.x,
      y: pos.y - dragOffset.y
    };
    
    updateFurniture(selectedFurniture, { position: newPosition });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };
  
  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getMousePos(e as any);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'furniture') {
        const furniture = createFurnitureItem(data.furnitureType, pos);
        addFurniture(furniture);
      }
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-300 bg-white cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    />
  );
}
