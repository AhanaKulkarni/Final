import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Environment, ContactShadows, Text } from '@react-three/drei';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { furnitureTemplates } from '../lib/furniture-models';
import { FurnitureItem, Wall, DoorWindow } from '../types/room';
import * as THREE from 'three';

// Enhanced 3D Furniture Component
function Furniture3D({ furniture }: { furniture: FurnitureItem }) {
  const groupRef = useRef<THREE.Group>(null);
  const template = furnitureTemplates.find(t => t.type === furniture.type);
  const color = furniture.color || template?.color || '#8B4513';
  
  // Convert 2D position to 3D with proper scaling
  const position: [number, number, number] = [
    (furniture.position.x - 400) / 40,
    (furniture.depth * furniture.scale) / 200, // Fixed height calculation to be on floor
    (furniture.position.y - 300) / 40
  ];
  
  const scale: [number, number, number] = [
    (furniture.width * furniture.scale) / 80,
    (furniture.depth * furniture.scale) / 80,
    (furniture.height * furniture.scale) / 80
  ];
  
  // Add subtle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });
  
  const getGeometry = () => {
    switch (furniture.type) {
      case 'chair':
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.6, -0.35]}>
              <boxGeometry args={[0.8, 0.8, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Legs */}
            {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((pos, i) => (
              <mesh key={i} position={[pos[0], -0.2, pos[1]]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4]} />
                <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} />
              </mesh>
            ))}
          </group>
        );
      case 'table':
        return (
          <group>
            {/* Table top */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1, 0.08, 1]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Legs */}
            {[[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0, pos[1]]}>
                <cylinderGeometry args={[0.04, 0.04, 0.8]} />
                <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} />
              </mesh>
            ))}
          </group>
        );
      case 'bed':
        return (
          <group>
            {/* Mattress */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1, 0.2, 1.2]} />
              <meshStandardMaterial color="#f8f8f8" roughness={0.8} />
            </mesh>
            {/* Frame */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.1, 0.1, 1.3]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.5, -0.6]}>
              <boxGeometry args={[1.1, 0.8, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
          </group>
        );
      case 'sofa':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1.2, 0.4, 0.8]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.5, -0.3]}>
              <boxGeometry args={[1.2, 0.6, 0.2]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.5, 0.4, 0]}>
              <boxGeometry args={[0.2, 0.4, 0.8]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            <mesh position={[0.5, 0.4, 0]}>
              <boxGeometry args={[0.2, 0.4, 0.8]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          </mesh>
        );
    }
  };
  
  return (
    <group 
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={[0, (furniture.rotation * Math.PI) / 180, 0]}
      castShadow
      receiveShadow
    >
      {getGeometry()}
    </group>
  );
}

// 3D Door and Window Component
function DoorWindow3D({ item, wall }: { item: DoorWindow; wall: Wall }) {
  // Use same coordinate system as Wall3D component
  const startX = (wall.start.x - 400) / 40;
  const startZ = (wall.start.y - 300) / 40;
  const endX = (wall.end.x - 400) / 40;
  const endZ = (wall.end.y - 300) / 40;
  
  const wallLength = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2)
  );
  
  const wallAngle = Math.atan2(endZ - startZ, endX - startX);
  
  // Calculate center position of wall
  const centerX = (startX + endX) / 2;
  const centerZ = (startZ + endZ) / 2;
  
  // Calculate position along wall from center (item.position is 0-1 from start)
  const offsetFromCenter = (item.position - 0.5) * wallLength;
  const itemX = centerX + Math.cos(wallAngle) * offsetFromCenter;
  const itemZ = centerZ + Math.sin(wallAngle) * offsetFromCenter;
  
  const itemColor = item.color || (item.type === 'door' ? '#8B4513' : '#4169E1');
  
  // Convert pixel dimensions to 3D world units (realistic scaling)
  // Typical door: 80px = 0.8m, window: 100px = 1.0m
  const width3D = item.width / 100; // 1 pixel = 1cm in 3D world
  const height3D = item.height / 100;
  

  
  return (
    <group
      position={[itemX, 0, itemZ]}
      rotation={[0, wallAngle, 0]}
      castShadow
      receiveShadow
    >
      <group>
        {item.type === 'door' ? (
          <group>
            {/* Door opening (cuts through wall) */}
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[width3D + 0.02, 2.05, 0.3]} />
              <meshStandardMaterial 
                color="#000000" 
                transparent
                opacity={0}
              />
            </mesh>
            
            {/* Door frame border */}
            <mesh position={[-width3D / 2 - 0.025, 1.0, 0]} castShadow>
              <boxGeometry args={[0.05, 2.0, 0.3]} />
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.6}
                metalness={0.0}
              />
            </mesh>
            <mesh position={[width3D / 2 + 0.025, 1.0, 0]} castShadow>
              <boxGeometry args={[0.05, 2.0, 0.3]} />
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.6}
                metalness={0.0}
              />
            </mesh>
            <mesh position={[0, 2.025, 0]} castShadow>
              <boxGeometry args={[width3D + 0.1, 0.05, 0.3]} />
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.6}
                metalness={0.0}
              />
            </mesh>
            
            {/* Door panel */}
            <mesh position={[width3D / 8, 1.0, 0.08]} castShadow>
              <boxGeometry args={[width3D - 0.05, 1.95, 0.04]} />
              <meshStandardMaterial 
                color={itemColor} 
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            
            {/* Door handle */}
            <mesh position={[width3D / 2 - 0.1, 0.9, 0.1]} castShadow>
              <sphereGeometry args={[0.025]} />
              <meshStandardMaterial 
                color="#FFD700" 
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            
            {/* Door panels (decorative) */}
            <mesh position={[width3D / 8, 1.3, 0.081]} castShadow>
              <boxGeometry args={[width3D - 0.2, 0.6, 0.01]} />
              <meshStandardMaterial 
                color={new THREE.Color(itemColor).multiplyScalar(0.8)}
                roughness={0.6}
              />
            </mesh>
            <mesh position={[width3D / 8, 0.7, 0.081]} castShadow>
              <boxGeometry args={[width3D - 0.2, 0.6, 0.01]} />
              <meshStandardMaterial 
                color={new THREE.Color(itemColor).multiplyScalar(0.8)}
                roughness={0.6}
              />
            </mesh>
            
            {/* Door details */}
            <mesh position={[0, 1.4, -0.075]}>
              <boxGeometry args={[item.width / 30, 0.8, 0.01]} />
              <meshStandardMaterial 
                color={new THREE.Color(itemColor).multiplyScalar(0.8)}
                roughness={0.5}
              />
            </mesh>
            <mesh position={[0, 0.8, -0.075]}>
              <boxGeometry args={[item.width / 30, 0.8, 0.01]} />
              <meshStandardMaterial 
                color={new THREE.Color(itemColor).multiplyScalar(0.8)}
                roughness={0.5}
              />
            </mesh>
          </group>
        ) : (
          <group>
            {/* Window opening (cuts through wall) */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[width3D + 0.02, height3D + 0.02, 0.3]} />
              <meshStandardMaterial 
                color="#000000" 
                transparent
                opacity={0}
              />
            </mesh>
            
            {/* Window frame */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[width3D + 0.06, height3D + 0.06, 0.25]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            
            {/* Window glass */}
            <mesh position={[0, 1.5, 0.05]} castShadow>
              <boxGeometry args={[width3D - 0.05, height3D - 0.05, 0.02]} />
              <meshStandardMaterial 
                color={itemColor} 
                roughness={0.0}
                metalness={0.1}
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Window cross bars */}
            <mesh position={[0, 1.5, 0.06]} castShadow>
              <boxGeometry args={[0.02, height3D - 0.05, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.5, 0.06]} castShadow>
              <boxGeometry args={[width3D - 0.05, 0.02, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            
            {/* Window sill */}
            <mesh position={[0, 1.5 - height3D/2 - 0.05, 0.08]} castShadow>
              <boxGeometry args={[width3D + 0.1, 0.04, 0.08]} />
              <meshStandardMaterial 
                color="#F5F5F5" 
                roughness={0.6}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

// Enhanced 3D Wall Component
function Wall3D({ wall, wallIndex }: { wall: Wall; wallIndex: number }) {
  const { currentRoom } = useRoomStore();
  
  const length = Math.sqrt(
    Math.pow(wall.end.x - wall.start.x, 2) + 
    Math.pow(wall.end.y - wall.start.y, 2)
  ) / 40;
  
  const centerX = ((wall.start.x + wall.end.x) / 2 - 400) / 40;
  const centerZ = ((wall.start.y + wall.end.y) / 2 - 300) / 40;
  
  const angle = Math.atan2(
    wall.end.y - wall.start.y,
    wall.end.x - wall.start.x
  );
  
  const wallColor = wall.color || "#f5f5f5";
  
  // Find doors and windows on this wall
  const doorsOnWall = currentRoom.doors.filter(door => door.wallIndex === wallIndex);
  const windowsOnWall = currentRoom.windows.filter(window => window.wallIndex === wallIndex);
  
  return (
    <group>
      {/* Main wall */}
      <mesh
        position={[centerX, 1.5, centerZ]}
        rotation={[0, angle, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[length, 3, 0.2]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Wall base/trim */}
      <mesh
        position={[centerX, 0.1, centerZ]}
        rotation={[0, angle, 0]}
        receiveShadow
      >
        <boxGeometry args={[length, 0.2, 0.25]} />
        <meshStandardMaterial 
          color={new THREE.Color(wallColor).multiplyScalar(0.8)} 
          roughness={0.6}
        />
      </mesh>
      
      {/* Render doors on this wall */}
      {doorsOnWall.map(door => (
        <DoorWindow3D key={door.id} item={door} wall={wall} />
      ))}
      
      {/* Render windows on this wall */}
      {windowsOnWall.map(window => (
        <DoorWindow3D key={window.id} item={window} wall={wall} />
      ))}
    </group>
  );
}

// Enhanced Floor Component
function Floor() {
  const woodTexture = useTexture('/textures/wood.jpg');
  
  return (
    <group>
      {/* Main floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Room perimeter base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

// Enhanced Lighting setup
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffeaa7" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#74b9ff" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#fd79a8" />
      <spotLight
        position={[0, 12, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        color="#ffffff"
      />
    </>
  );
}

// Main 3D Scene
function Scene3D() {
  const { currentRoom } = useRoomStore();
  
  return (
    <>
      <Lights />
      <Floor />
      
      {/* Render walls */}
      {currentRoom.walls.map((wall, index) => (
        <Wall3D key={index} wall={wall} wallIndex={index} />
      ))}
      
      {/* Render furniture */}
      {currentRoom.furniture.map(furniture => (
        <Furniture3D key={furniture.id} furniture={furniture} />
      ))}
      
      {/* Render doors */}
      {currentRoom.doors.map(door => {
        const wall = currentRoom.walls[door.wallIndex];
        return wall ? (
          <DoorWindow3D key={door.id} item={door} wall={wall} />
        ) : null;
      })}
      
      {/* Render windows */}
      {currentRoom.windows.map(window => {
        const wall = currentRoom.walls[window.wallIndex];
        return wall ? (
          <DoorWindow3D key={window.id} item={window} wall={wall} />
        ) : null;
      })}
    </>
  );
}

export function Canvas3D() {
  return (
    <div className="w-full min-h-screen relative">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        camera={{ position: [12, 10, 12], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #f0f8ff 100%)' }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.1}
          dampingFactor={0.05}
          enableDamping
        />
        
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <Scene3D />
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.3} 
            scale={20} 
            blur={2} 
            far={10} 
          />
        </Suspense>
      </Canvas>
      
      {/* Enhanced 3D Controls overlay */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg border border-white/10">
        <h3 className="font-semibold mb-2 text-sm">3D Navigation</h3>
        <div className="space-y-1 text-xs opacity-90">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500/30 rounded border border-blue-400 flex items-center justify-center text-xs">L</span>
            <span>Rotate camera</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500/30 rounded border border-green-400 flex items-center justify-center text-xs">R</span>
            <span>Pan view</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-purple-500/30 rounded border border-purple-400 flex items-center justify-center text-xs">⟳</span>
            <span>Zoom in/out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
