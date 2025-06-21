import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "completed";

export interface GameObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  category: 'walls' | 'furniture' | 'doors' | 'windows' | 'design';
}

export interface GameStats {
  score: number;
  completedObjectives: number;
  totalObjectives: number;
  timeStarted: number | null;
  roomsDesigned: number;
  furnitureAdded: number;
  doorsAdded: number;
  windowsAdded: number;
}

interface GameState {
  phase: GamePhase;
  playerName: string;
  objectives: GameObjective[];
  stats: GameStats;
  currentRoomName: string;
  
  // Actions
  start: (playerName?: string) => void;
  restart: () => void;
  complete: () => void;
  setPlayerName: (name: string) => void;
  setCurrentRoomName: (name: string) => void;
  completeObjective: (id: string) => void;
  addScore: (points: number) => void;
  incrementStat: (stat: keyof Omit<GameStats, 'score' | 'completedObjectives' | 'totalObjectives' | 'timeStarted'>) => void;
}

const initialObjectives: GameObjective[] = [
  {
    id: 'create-walls',
    title: 'Build Your Foundation',
    description: 'Create at least 4 walls to form a basic room',
    completed: false,
    points: 100,
    category: 'walls'
  },
  {
    id: 'add-door',
    title: 'Create an Entrance',
    description: 'Add a door to your room',
    completed: false,
    points: 50,
    category: 'doors'
  },
  {
    id: 'add-window',
    title: 'Let There Be Light',
    description: 'Add a window for natural light',
    completed: false,
    points: 50,
    category: 'windows'
  },
  {
    id: 'place-furniture',
    title: 'Furnish Your Space',
    description: 'Add at least 3 pieces of furniture',
    completed: false,
    points: 75,
    category: 'furniture'
  },
  {
    id: 'customize-colors',
    title: 'Add Your Style',
    description: 'Customize the color of walls, doors, or furniture',
    completed: false,
    points: 25,
    category: 'design'
  },
  {
    id: 'complete-room',
    title: 'Master Designer',
    description: 'Create a fully furnished room with walls, door, window, and 5+ furniture pieces',
    completed: false,
    points: 200,
    category: 'design'
  }
];

const initialStats: GameStats = {
  score: 0,
  completedObjectives: 0,
  totalObjectives: initialObjectives.length,
  timeStarted: null,
  roomsDesigned: 0,
  furnitureAdded: 0,
  doorsAdded: 0,
  windowsAdded: 0
};

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    playerName: "",
    objectives: initialObjectives,
    stats: initialStats,
    currentRoomName: "My Room",
    
    start: (playerName = "") => {
      set((state) => {
        if (state.phase === "ready") {
          return { 
            phase: "playing", 
            playerName,
            stats: { ...initialStats, timeStarted: Date.now() }
          };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ 
        phase: "ready",
        objectives: initialObjectives.map(obj => ({ ...obj, completed: false })),
        stats: initialStats,
        currentRoomName: "My Room",
        playerName: ""
      }));
    },
    
    complete: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "completed" };
        }
        return {};
      });
    },
    
    setPlayerName: (name: string) => set({ playerName: name }),
    
    setCurrentRoomName: (name: string) => set({ currentRoomName: name }),
    
    completeObjective: (id: string) => set((state) => {
      const objectives = state.objectives.map(obj => 
        obj.id === id ? { ...obj, completed: true } : obj
      );
      const completedCount = objectives.filter(obj => obj.completed).length;
      const objective = objectives.find(obj => obj.id === id);
      const scoreIncrease = objective && !state.objectives.find(o => o.id === id)?.completed ? objective.points : 0;
      
      return {
        objectives,
        stats: {
          ...state.stats,
          completedObjectives: completedCount,
          score: state.stats.score + scoreIncrease
        }
      };
    }),
    
    addScore: (points: number) => set((state) => ({
      stats: { ...state.stats, score: state.stats.score + points }
    })),
    
    incrementStat: (stat) => set((state) => ({
      stats: { ...state.stats, [stat]: state.stats[stat] + 1 }
    }))
  }))
);
