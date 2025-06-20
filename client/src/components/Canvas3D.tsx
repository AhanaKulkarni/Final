import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Environment, ContactShadows, Text } from '@react-three/drei';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { furnitureTemplates } from '../lib/furniture-models';
import { FurnitureItem, Wall } from '../types/room';
import * as THREE from 'three';

// Enhanced 3D Furniture Component
function Furniture3D({ furniture }: { furniture: FurnitureItem }) {
  const groupRef = useRef<THREE.Group>(null);
  const template = furnitureTemplates.find(t => t.type === furniture.type);
  const color = furniture.color || template?.color || '#8B4513';
  
  // Convert 2D position to 3D with proper scaling
  const position: [number, number, number] = [
    (furniture.position.x - 400) / 40,
    (furniture.depth * furniture.scale) / 120,
    (furniture.position.y - 300) / 40
  ];
  
  const scale: [number, number, number] = [
    (furniture.width * furniture.scale) / 80,
    (furniture.depth * furniture.scale) / 80,
    (furniture.height * furniture.scale) / 80
  ];
  
  // Add subtle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
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
      ref={meshRef}
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

// Enhanced 3D Wall Component
function Wall3D({ wall }: { wall: Wall }) {
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
          color="#f5f5f5" 
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
          color="#e0e0e0" 
          roughness={0.6}
        />
      </mesh>
    </group>
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
