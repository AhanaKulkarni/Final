import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { furnitureTemplates } from '../lib/furniture-models';
import { FurnitureItem, Wall } from '../types/room';
import * as THREE from 'three';

// 3D Furniture Component
function Furniture3D({ furniture }: { furniture: FurnitureItem }) {
  const template = furnitureTemplates.find(t => t.type === furniture.type);
  const color = template?.color || '#8B4513';
  
  // Convert 2D position to 3D (scale down and center)
  const position: [number, number, number] = [
    (furniture.position.x - 400) / 50, // Scale and center
    (furniture.depth || 50) / 100, // Height from floor
    (furniture.position.y - 300) / 50 // Scale and center
  ];
  
  const scale: [number, number, number] = [
    furniture.width / 100,
    (furniture.depth || 50) / 100,
    furniture.height / 100
  ];
  
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[0, (furniture.rotation * Math.PI) / 180, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

// 3D Wall Component
function Wall3D({ wall }: { wall: Wall }) {
  const length = Math.sqrt(
    Math.pow(wall.end.x - wall.start.x, 2) + 
    Math.pow(wall.end.y - wall.start.y, 2)
  ) / 50; // Scale down
  
  const centerX = ((wall.start.x + wall.end.x) / 2 - 400) / 50;
  const centerZ = ((wall.start.y + wall.end.y) / 2 - 300) / 50;
  
  const angle = Math.atan2(
    wall.end.y - wall.start.y,
    wall.end.x - wall.start.x
  );
  
  return (
    <mesh
      position={[centerX, 1, centerZ]}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[length, 2, 0.2]} />
      <meshLambertMaterial color="#ddd" />
    </mesh>
  );
}

// Floor Component
function Floor() {
  const woodTexture = useTexture('/textures/wood.jpg');
  
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshLambertMaterial map={woodTexture} />
    </mesh>
  );
}

// Lighting setup
function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
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
        <Wall3D key={index} wall={wall} />
      ))}
      
      {/* Render furniture */}
      {currentRoom.furniture.map(furniture => (
        <Furniture3D key={furniture.id} furniture={furniture} />
      ))}
    </>
  );
}

export function Canvas3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true }}
        style={{ background: '#f0f8ff' }}
      >
        <PerspectiveCamera
          makeDefault
          position={[10, 8, 10]}
          fov={60}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
      
      {/* 3D Controls overlay */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white p-3 rounded-lg text-sm">
        <div className="space-y-1">
          <div>🖱️ Left click + drag: Rotate view</div>
          <div>🖱️ Right click + drag: Pan view</div>
          <div>🖱️ Scroll: Zoom in/out</div>
        </div>
      </div>
    </div>
  );
}
