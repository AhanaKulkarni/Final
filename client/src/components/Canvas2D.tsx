import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { createFurnitureItem } from '../lib/furniture-models';
import { Point, FurnitureItem, Wall, DoorWindow } from '../types/room';
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
    selectedDoorWindow,
    isDrawingWall,
    currentWallStart,
    editMode,
    addWall,
    addFurniture,
    updateFurniture,
    selectFurniture,
    addDoor,
    addWindow,
    selectDoorWindow,
    updateDoorWindow,
    setCurrentWallStart
  } = useRoomStore();

  const getDistanceToWall = (point: Point, wall: any): number => {
    const A = point.x - wall.start.x;
    const B = point.y - wall.start.y;
    const C = wall.end.x - wall.start.x;
    const D = wall.end.y - wall.start.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    let t = Math.max(0, Math.min(1, dot / lenSq));
    const projection = {
      x: wall.start.x + t * C,
      y: wall.start.y + t * D
    };
    
    return Math.sqrt(
      Math.pow(point.x - projection.x, 2) + 
      Math.pow(point.y - projection.y, 2)
    );
  };

  const getPositionOnWall = (wall: any, position: number): Point => {
    return {
      x: wall.start.x + position * (wall.end.x - wall.start.x),
      y: wall.start.y + position * (wall.end.y - wall.start.y)
    };
  };

  const adjustBrightness = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const drawRoom = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Reset canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Apply pan and zoom
  ctx.translate(panOffset.x, panOffset.y);
  ctx.scale(zoom, zoom);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(
    -panOffset.x / zoom,
    -panOffset.y / zoom,
    (canvas.width - panOffset.x) / zoom,
    (canvas.height - panOffset.y) / zoom
  );
  gradient.addColorStop(0, '#f8f9fa');
  gradient.addColorStop(1, '#e9ecef');
  ctx.fillStyle = gradient;
  ctx.fillRect(-panOffset.x / zoom, -panOffset.y / zoom, canvas.width / zoom, canvas.height / zoom);

  // Draw grid lines
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 0.5;
  const gridSize = 20;
  for (let x = -panOffset.x % (gridSize * zoom); x < canvas.width; x += gridSize * zoom) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = -panOffset.y % (gridSize * zoom); y < canvas.height; y += gridSize * zoom) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Major grid lines
  ctx.strokeStyle = '#adb5bd';
  ctx.lineWidth = 1;
  const majorGridSize = 100;
  for (let x = -panOffset.x % (majorGridSize * zoom); x < canvas.width; x += majorGridSize * zoom) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = -panOffset.y % (majorGridSize * zoom); y < canvas.height; y += majorGridSize * zoom) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw walls
  currentRoom.walls.forEach((wall) => {
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

    // Outline
    ctx.strokeStyle = adjustBrightness(wallColor, -30);
    ctx.lineWidth = 14;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    ctx.moveTo(wall.start.x, wall.start.y);
    ctx.lineTo(wall.end.x, wall.end.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  });

  // Draw furniture
  currentRoom.furniture.forEach((furniture) => {
    const isSelected = furniture.id === selectedFurniture;

    ctx.save();
    ctx.translate(furniture.position.x, furniture.position.y);
    ctx.rotate((furniture.rotation * Math.PI) / 180);

    const scaledWidth = furniture.width * furniture.scale;
    const scaledHeight = furniture.height * furniture.scale;

    if (!isSelected) {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-scaledWidth / 2 + 2, -scaledHeight / 2 + 2, scaledWidth, scaledHeight);
    }

    const color = furniture.color || '#4a90e2';
    const furnitureGradient = ctx.createLinearGradient(
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth / 2,
      scaledHeight / 2
    );
    furnitureGradient.addColorStop(0, color);
    furnitureGradient.addColorStop(1, adjustBrightness(color, -20));
    ctx.fillStyle = furnitureGradient;
    ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

    ctx.strokeStyle = isSelected ? '#e74c3c' : adjustBrightness(color, -40);
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

    // Handles
    if (isSelected) {
      const handleSize = 8;
      ctx.fillStyle = '#e74c3c';
      const corners = [
        [-scaledWidth / 2, -scaledHeight / 2],
        [scaledWidth / 2, -scaledHeight / 2],
        [-scaledWidth / 2, scaledHeight / 2],
        [scaledWidth / 2, scaledHeight / 2],
      ];
      corners.forEach(([x, y]) => {
        ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      });
    }

    // Label
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

  // Draw doors and windows
  const allDoorWindows = [...currentRoom.doors, ...currentRoom.windows];
  allDoorWindows.forEach((item) => {
    const wall = currentRoom.walls[item.wallIndex];
    if (!wall) return;

    const wallPos = getPositionOnWall(wall, item.position);
    const wallAngle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);

    ctx.save();
    ctx.translate(wallPos.x, wallPos.y);
    ctx.rotate(wallAngle);

    const isSelected = selectedDoorWindow === item.id;
    const color = item.color || (item.type === 'door' ? '#8B4513' : '#4169E1');

    if (item.type === 'door') {
      // Draw door
      ctx.fillStyle = color;
      ctx.fillRect(-item.width / 2, -10, item.width, 20);

      // Door frame
      ctx.strokeStyle = adjustBrightness(color, -40);
      ctx.lineWidth = 2;
      ctx.strokeRect(-item.width / 2, -10, item.width, 20);

      // Door handle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(item.width / 2 - 8, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw window
      ctx.fillStyle = color;
      ctx.fillRect(-item.width / 2, -8, item.width, 16);

      // Window frame
      ctx.strokeStyle = adjustBrightness(color, -40);
      ctx.lineWidth = 2;
      ctx.strokeRect(-item.width / 2, -8, item.width, 16);

      // Window cross
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.moveTo(-item.width / 2, 0);
      ctx.lineTo(item.width / 2, 0);
      ctx.stroke();
    }

    // Selection indicator
    if (isSelected) {
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-item.width / 2 - 5, -15, item.width + 10, 30);
      ctx.setLineDash([]);
    }

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

  ctx.restore(); // Restore original transform
}, [canvasRef, panOffset, zoom, currentRoom, selectedFurniture, selectedDoorWindow, isDrawingWall, currentWallStart, mousePos]);
  

  useEffect(() => {
    drawRoom();
  }, [drawRoom]);

  // ✅ Fix for high-DPI screens (cursor alignment with canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx?.scale(dpr, dpr);
  }, []);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    return { x, y };
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
    
    // Handle door/window placement
    if (editMode === 'door' || editMode === 'window') {
      // Find which wall is closest to the click
      let closestWall: any = null;
      let closestWallIndex = -1;
      let minDistance = Infinity;
      
      currentRoom.walls.forEach((wall, index) => {
        const distance = getDistanceToWall(pos, wall);
        if (distance < minDistance && distance < 20) { // 20px threshold
          minDistance = distance;
          closestWall = wall;
          closestWallIndex = index;
        }
      });
      
      if (closestWall && closestWallIndex >= 0) {
        // Calculate position along wall (0-1)
        const wallLength = Math.sqrt(
          Math.pow(closestWall.end.x - closestWall.start.x, 2) + 
          Math.pow(closestWall.end.y - closestWall.start.y, 2)
        );
        
        // Project click point onto wall
        const t = Math.max(0.1, Math.min(0.9, 
          ((pos.x - closestWall.start.x) * (closestWall.end.x - closestWall.start.x) + 
           (pos.y - closestWall.start.y) * (closestWall.end.y - closestWall.start.y)) / 
          (wallLength * wallLength)
        ));
        
        const newDoorWindow = {
          id: `${editMode}_${Date.now()}`,
          type: editMode as 'door' | 'window',
          wallIndex: closestWallIndex,
          position: t,
          width: editMode === 'door' ? 80 : 100,
          height: editMode === 'door' ? 200 : 80,
          color: editMode === 'door' ? '#8B4513' : '#4169E1'
        };
        
        if (editMode === 'door') {
          addDoor(newDoorWindow);
        } else {
          addWindow(newDoorWindow);
        }
        
        selectDoorWindow(newDoorWindow.id);
      }
      return;
    }
    
    // Only allow furniture interaction when in select mode
    if (editMode === 'select') {
      // Check if clicking on door/window first
      const allDoorWindows = [...currentRoom.doors, ...currentRoom.windows];
      const clickedDoorWindow = allDoorWindows.find(item => {
        const wall = currentRoom.walls[item.wallIndex];
        if (!wall) return false;
        
        const wallPos = getPositionOnWall(wall, item.position);
        const distance = Math.sqrt(
          Math.pow(pos.x - wallPos.x, 2) + 
          Math.pow(pos.y - wallPos.y, 2)
        );
        return distance < 30; // 30px selection radius
      });
      
      if (clickedDoorWindow) {
        selectDoorWindow(clickedDoorWindow.id);
        selectFurniture(null);
        return;
      }
      
      // Check if clicking on furniture
      const clickedFurniture = currentRoom.furniture.find(furniture =>
        isPointInFurniture(pos, furniture)
      );
      
      if (clickedFurniture) {
        selectFurniture(clickedFurniture.id);
        selectDoorWindow(null);
        
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
        selectDoorWindow(null);
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
        width={1200}
        height={800}
        className="border border-gray-300 bg-white rounded"
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
      <div className="absolute bottom-4 right-4 bg-white/90 text-gray-700 p-3 rounded border shadow text-xs">
        <div className="space-y-1">
          <div className="font-medium mb-2">Canvas Navigation:</div>
          <div>Ctrl+Drag: Pan view</div>
          <div>Mouse wheel: Zoom</div>
          <div>Zoom: {Math.round(zoom * 100)}%</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => {
              setPanOffset({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
