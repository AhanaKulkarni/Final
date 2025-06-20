import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { createFurnitureItem } from '../lib/furniture-models';
import { Point, FurnitureItem } from '../types/room';
import { isPointInFurniture, snapToGrid, getDistance } from '../lib/room-utils';

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  const {
    currentRoom,
    selectedFurniture,
    isDrawingWall,
    currentWallStart,
    editMode,
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
    
    // Save context and apply transformations
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(-panOffset.x / zoom, -panOffset.y / zoom, 
                                           (canvas.width - panOffset.x) / zoom, 
                                           (canvas.height - panOffset.y) / zoom);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(-panOffset.x / zoom, -panOffset.y / zoom, canvas.width / zoom, canvas.height / zoom);
    
    // Draw enhanced grid
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 0.5;
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
    
    // Draw major grid lines
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw walls with enhanced styling
    currentRoom.walls.forEach((wall, index) => {
      const wallColor = wall.color || '#2c3e50';
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw wall outline
      ctx.strokeStyle = adjustBrightness(wallColor, -30);
      ctx.lineWidth = 14;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    });
    
    // Draw furniture with enhanced styling
    currentRoom.furniture.forEach(furniture => {
      const isSelected = furniture.id === selectedFurniture;
      
      ctx.save();
      ctx.translate(furniture.position.x, furniture.position.y);
      ctx.rotate((furniture.rotation * Math.PI) / 180);
      
      const scaledWidth = furniture.width * furniture.scale;
      const scaledHeight = furniture.height * furniture.scale;
      
      // Draw shadow
      if (!isSelected) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(-scaledWidth / 2 + 2, -scaledHeight / 2 + 2, scaledWidth, scaledHeight);
      }
      
      // Draw furniture rectangle
      const color = furniture.color || '#4a90e2';
      const gradient = ctx.createLinearGradient(-scaledWidth / 2, -scaledHeight / 2, scaledWidth / 2, scaledHeight / 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustBrightness(color, -20));
      ctx.fillStyle = gradient;
      ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      
      // Draw border
      ctx.strokeStyle = isSelected ? '#e74c3c' : adjustBrightness(color, -40);
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      
      // Draw selection handles
      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#e74c3c';
        const corners = [
          [-scaledWidth / 2, -scaledHeight / 2], // top-left
          [scaledWidth / 2, -scaledHeight / 2],  // top-right
          [-scaledWidth / 2, scaledHeight / 2],  // bottom-left
          [scaledWidth / 2, scaledHeight / 2]    // bottom-right
        ];
        
        corners.forEach(([x, y]) => {
          ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        });
      }
      
      // Draw furniture label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 3;
      const label = furniture.type.charAt(0).toUpperCase() + furniture.type.slice(1);
      ctx.strokeText(label, 0, 4);
      ctx.fillText(label, 0, 4);
      
      ctx.restore();
    });
    
    // Draw current wall being drawn
    if (isDrawingWall && currentWallStart) {
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 10;
      ctx.setLineDash([15, 10]);
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(currentWallStart.x, currentWallStart.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw start point indicator
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(currentWallStart.x, currentWallStart.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Restore context
    ctx.restore();
  }, [currentRoom, selectedFurniture, isDrawingWall, currentWallStart, mousePos, panOffset, zoom]);
  
  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, amount: number): string => {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  };
  
  useEffect(() => {
    drawRoom();
  }, [drawRoom]);
  
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - panOffset.x) / zoom,
      y: (e.clientY - rect.top - panOffset.y) / zoom
    };
  };

  const transformPoint = (point: Point): Point => {
    return {
      x: point.x * zoom + panOffset.x,
      y: point.y * zoom + panOffset.y
    };
  };
  
  const getResizeHandle = (pos: Point, furniture: FurnitureItem): 'nw' | 'ne' | 'sw' | 'se' | null => {
    const handleSize = 12;
    const scaledWidth = furniture.width * furniture.scale;
    const scaledHeight = furniture.height * furniture.scale;
    
    const corners = [
      { handle: 'nw' as const, x: furniture.position.x - scaledWidth / 2, y: furniture.position.y - scaledHeight / 2 },
      { handle: 'ne' as const, x: furniture.position.x + scaledWidth / 2, y: furniture.position.y - scaledHeight / 2 },
      { handle: 'sw' as const, x: furniture.position.x - scaledWidth / 2, y: furniture.position.y + scaledHeight / 2 },
      { handle: 'se' as const, x: furniture.position.x + scaledWidth / 2, y: furniture.position.y + scaledHeight / 2 }
    ];
    
    for (const corner of corners) {
      if (Math.abs(pos.x - corner.x) <= handleSize / 2 && Math.abs(pos.y - corner.y) <= handleSize / 2) {
        return corner.handle;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const snappedPos = snapToGrid(pos);
    
    // Handle middle mouse or space+drag for panning
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setDragOffset(pos);
      e.preventDefault();
      return;
    }
    
    // Only allow wall drawing when in wall mode
    if (editMode === 'wall' && isDrawingWall) {
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
    
    // Only allow furniture interaction when in select mode
    if (editMode === 'select') {
      // Check if clicking on furniture
      const clickedFurniture = currentRoom.furniture.find(furniture =>
        isPointInFurniture(pos, furniture)
      );
      
      if (clickedFurniture) {
        selectFurniture(clickedFurniture.id);
        
        // Check if clicking on resize handle
        const handle = getResizeHandle(pos, clickedFurniture);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragOffset(pos);
        } else {
          setIsDragging(true);
          setDragOffset({
            x: pos.x - clickedFurniture.position.x,
            y: pos.y - clickedFurniture.position.y
          });
        }
      } else {
        selectFurniture(null);
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setMousePos(pos);
    
    // Handle canvas panning
    if (isPanning) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const rawPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        setPanOffset({
          x: panOffset.x + (rawPos.x - (dragOffset.x * zoom + panOffset.x)),
          y: panOffset.y + (rawPos.y - (dragOffset.y * zoom + panOffset.y))
        });
      }
      return;
    }
    
    if (editMode === 'select') {
      if (isDragging && selectedFurniture) {
        const newPosition = {
          x: pos.x - dragOffset.x,
          y: pos.y - dragOffset.y
        };
        updateFurniture(selectedFurniture, { position: newPosition });
      }
      
      if (isResizing && selectedFurniture && resizeHandle) {
        const selectedItem = currentRoom.furniture.find(f => f.id === selectedFurniture);
        if (selectedItem) {
          const deltaX = pos.x - dragOffset.x;
          const deltaY = pos.y - dragOffset.y;
          
          let newWidth = selectedItem.width;
          let newHeight = selectedItem.height;
          
          switch (resizeHandle) {
            case 'se': // bottom-right
              newWidth = Math.max(20, selectedItem.width + deltaX);
              newHeight = Math.max(20, selectedItem.height + deltaY);
              break;
            case 'sw': // bottom-left
              newWidth = Math.max(20, selectedItem.width - deltaX);
              newHeight = Math.max(20, selectedItem.height + deltaY);
              break;
            case 'ne': // top-right
              newWidth = Math.max(20, selectedItem.width + deltaX);
              newHeight = Math.max(20, selectedItem.height - deltaY);
              break;
            case 'nw': // top-left
              newWidth = Math.max(20, selectedItem.width - deltaX);
              newHeight = Math.max(20, selectedItem.height - deltaY);
              break;
          }
          
          updateFurniture(selectedFurniture, { width: newWidth, height: newHeight });
          setDragOffset(pos); // Update offset for continuous resizing
        }
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setIsPanning(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const newZoom = e.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
    setZoom(Math.max(0.3, Math.min(3, newZoom)));
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
  
  const getCursor = () => {
    if (isPanning) return 'grabbing';
    if (editMode === 'wall' && isDrawingWall) return 'crosshair';
    if (editMode === 'select' && selectedFurniture) {
      const selectedItem = currentRoom.furniture.find(f => f.id === selectedFurniture);
      if (selectedItem) {
        const handle = getResizeHandle(mousePos, selectedItem);
        if (handle) {
          switch (handle) {
            case 'nw': return 'nw-resize';
            case 'ne': return 'ne-resize';
            case 'sw': return 'sw-resize';
            case 'se': return 'se-resize';
          }
        }
      }
      return isDragging ? 'grabbing' : 'grab';
    }
    if (editMode === 'furniture') return 'copy';
    return 'move';
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-gray-200 bg-white rounded-lg shadow-lg"
        style={{ cursor: getCursor() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onWheel={handleWheel}
      />
      
      {/* Navigation controls overlay */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-lg text-xs">
        <div className="space-y-1">
          <div className="font-semibold mb-2">Canvas Navigation:</div>
          <div>• Ctrl+Drag: Pan view</div>
          <div>• Mouse wheel: Zoom in/out</div>
          <div>• Zoom: {Math.round(zoom * 100)}%</div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/20">
          <button
            onClick={() => {
              setPanOffset({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
