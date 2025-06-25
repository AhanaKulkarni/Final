import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Room, FurnitureItem, Wall, Point, ViewMode, DoorWindow } from "../../types/room";

interface RoomState {
  currentRoom: Room;
  viewMode: ViewMode;
  selectedFurniture: string | null;
  selectedDoorWindow: string | null;
  isDrawingWall: boolean;
  currentWallStart: Point | null;
  editMode: 'select' | 'wall' | 'furniture' | 'door' | 'window';
  
  // Undo/Redo
  history: Room[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setEditMode: (mode: 'select' | 'wall' | 'furniture' | 'door' | 'window') => void;
  addWall: (wall: Wall) => void;
  removeWall: (index: number) => void;
  updateWall: (index: number, updates: Partial<Wall>) => void;
  addFurniture: (furniture: FurnitureItem) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  addDoor: (door: DoorWindow) => void;
  addWindow: (window: DoorWindow) => void;
  updateDoorWindow: (id: string, updates: Partial<DoorWindow>) => void;
  removeDoorWindow: (id: string) => void;
  selectDoorWindow: (id: string | null) => void;
  setDrawingWall: (drawing: boolean) => void;
  setCurrentWallStart: (point: Point | null) => void;
  clearRoom: () => void;
  setRoomDimensions: (width: number, height: number) => void;
  
  // Undo/Redo Actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
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
  doors: [],
  windows: [],
  width: 600,
  height: 500,
};

export const useRoomStore = create<RoomState>()(
  subscribeWithSelector((set, get) => ({
    currentRoom: defaultRoom,
    viewMode: "2d",
    selectedFurniture: null,
    selectedDoorWindow: null,
    isDrawingWall: false,
    currentWallStart: null,
    editMode: "select",
    
    // Undo/Redo state
    history: [JSON.parse(JSON.stringify(defaultRoom))],
    historyIndex: 0,
    canUndo: false,
    canRedo: false,
    
    setViewMode: (mode) => set({ viewMode: mode }),
    setEditMode: (mode) => set({ editMode: mode }),
    
    addWall: (wall) => set((state) => {
      const newRoom = {
        ...state.currentRoom,
        walls: [...state.currentRoom.walls, wall]
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newRoom)));
      

      
      return {
        currentRoom: newRoom,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false
      };
    }),
    
    removeWall: (index) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        walls: state.currentRoom.walls.filter((_, i) => i !== index)
      }
    })),
    
    updateWall: (index, updates) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        walls: state.currentRoom.walls.map((wall, i) =>
          i === index ? { ...wall, ...updates } : wall
        )
      }
    })),
    
    addFurniture: (furniture) => set((state) => {
      const newRoom = {
        ...state.currentRoom,
        furniture: [...state.currentRoom.furniture, furniture]
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newRoom)));
      

      
      return {
        currentRoom: newRoom,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false
      };
    }),
    
    updateFurniture: (id, updates) => set((state) => {

      
      return {
        currentRoom: {
          ...state.currentRoom,
          furniture: state.currentRoom.furniture.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        }
      };
    }),
    
    removeFurniture: (id) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        furniture: state.currentRoom.furniture.filter(item => item.id !== id)
      },
      selectedFurniture: state.selectedFurniture === id ? null : state.selectedFurniture
    })),
    
    selectFurniture: (id) => set({ selectedFurniture: id }),
    
    addDoor: (door) => set((state) => {
      const newRoom = {
        ...state.currentRoom,
        doors: [...state.currentRoom.doors, door]
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newRoom)));
      

      
      return {
        currentRoom: newRoom,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false
      };
    }),
    
    addWindow: (window) => set((state) => {
      const newRoom = {
        ...state.currentRoom,
        windows: [...state.currentRoom.windows, window]
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newRoom)));
      

      
      return {
        currentRoom: newRoom,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false
      };
    }),
    
    updateDoorWindow: (id, updates) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        doors: state.currentRoom.doors.map(door => 
          door.id === id ? { ...door, ...updates } : door
        ),
        windows: state.currentRoom.windows.map(window => 
          window.id === id ? { ...window, ...updates } : window
        )
      }
    })),
    
    removeDoorWindow: (id) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        doors: state.currentRoom.doors.filter(door => door.id !== id),
        windows: state.currentRoom.windows.filter(window => window.id !== id)
      }
    })),
    
    selectDoorWindow: (id) => set({ selectedDoorWindow: id }),
    
    setDrawingWall: (drawing) => set({ isDrawingWall: drawing }),
    
    setCurrentWallStart: (point) => set({ currentWallStart: point }),
    
    clearRoom: () => set({
      currentRoom: { ...defaultRoom, furniture: [], doors: [], windows: [] },
      selectedFurniture: null,
      selectedDoorWindow: null,
      isDrawingWall: false,
      currentWallStart: null,
      editMode: "select"
    }),
    
    setRoomDimensions: (width, height) => set((state) => ({
      currentRoom: {
        ...state.currentRoom,
        width,
        height
      }
    })),
    
    // Undo/Redo Actions
    saveToHistory: () => set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.currentRoom)));
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false
      };
    }),
    
    undo: () => set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          currentRoom: JSON.parse(JSON.stringify(state.history[newIndex])),
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
          selectedFurniture: null,
          selectedDoorWindow: null
        };
      }
      return state;
    }),
    
    redo: () => set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          currentRoom: JSON.parse(JSON.stringify(state.history[newIndex])),
          historyIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
          selectedFurniture: null,
          selectedDoorWindow: null
        };
      }
      return state;
    })
  }))
);
