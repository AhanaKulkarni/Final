import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Room, FurnitureItem, Wall, Point, ViewMode } from "../../types/room";

interface RoomState {
  currentRoom: Room;
  viewMode: ViewMode;
  selectedFurniture: string | null;
  isDrawingWall: boolean;
  currentWallStart: Point | null;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  addWall: (wall: Wall) => void;
  removeWall: (index: number) => void;
  addFurniture: (furniture: FurnitureItem) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  setDrawingWall: (drawing: boolean) => void;
  setCurrentWallStart: (point: Point | null) => void;
  clearRoom: () => void;
  setRoomDimensions: (width: number, height: number) => void;
}

const defaultRoom: Room = {
  id: "default",
  name: "My Room",
  walls: [
    // Default room perimeter
    { start: { x: 50, y: 50 }, end: { x: 550, y: 50 }, thickness: 10 },
    { start: { x: 550, y: 50 }, end: { x: 550, y: 450 }, thickness: 10 },
    { start: { x: 550, y: 450 }, end: { x: 50, y: 450 }, thickness: 10 },
    { start: { x: 50, y: 450 }, end: { x: 50, y: 50 }, thickness: 10 },
  ],
  furniture: [],
  width: 600,
  height: 500,
};

export const useRoomStore = create<RoomState>()(
  subscribeWithSelector((set, get) => ({
    currentRoom: defaultRoom,
    viewMode: "2d",
    selectedFurniture: null,
    isDrawingWall: false,
    currentWallStart: null,
    
    setViewMode: (mode) => set({ viewMode: mode }),
    
    addWall: (wall) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        walls: [...state.currentRoom.walls, wall]
      }
    })),
    
    removeWall: (index) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        walls: state.currentRoom.walls.filter((_, i) => i !== index)
      }
    })),
    
    addFurniture: (furniture) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        furniture: [...state.currentRoom.furniture, furniture]
      }
    })),
    
    updateFurniture: (id, updates) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        furniture: state.currentRoom.furniture.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }
    })),
    
    removeFurniture: (id) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        furniture: state.currentRoom.furniture.filter(item => item.id !== id)
      },
      selectedFurniture: state.selectedFurniture === id ? null : state.selectedFurniture
    })),
    
    selectFurniture: (id) => set({ selectedFurniture: id }),
    
    setDrawingWall: (drawing) => set({ isDrawingWall: drawing }),
    
    setCurrentWallStart: (point) => set({ currentWallStart: point }),
    
    clearRoom: () => set({
      currentRoom: { ...defaultRoom, furniture: [] },
      selectedFurniture: null,
      isDrawingWall: false,
      currentWallStart: null
    }),
    
    setRoomDimensions: (width, height) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        width,
        height
      }
    }))
  }))
);
