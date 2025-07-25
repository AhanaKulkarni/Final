import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { Camera, X, RotateCcw, Move3D, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';

// AR Scene Components
function ARRoom() {
  const { currentRoom } = useRoomStore();
  
  return (
    <group position={[0, -1, -3]} scale={[0.5, 0.5, 0.5]}>
      {/* Render walls */}
      {currentRoom.walls.map((wall, index) => {
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
        
        return (
          <mesh
            key={index}
            position={[centerX, 1.5, centerZ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[length, 3, 0.2]} />
            <meshStandardMaterial 
              color={wallColor} 
              roughness={0.8}
              metalness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
      
      {/* Render furniture */}
      {currentRoom.furniture.map(furniture => {
        const x = (furniture.position.x - 400) / 40;
        const z = (furniture.position.y - 300) / 40;
        
        return (
          <group
            key={furniture.id}
            position={[x, 0, z]}
            rotation={[0, furniture.rotation, 0]}
            scale={[furniture.scale, furniture.scale, furniture.scale]}
          >
            <mesh>
              <boxGeometry args={[
                furniture.width / 40,
                furniture.height / 40,
                furniture.depth / 40
              ]} />
              <meshStandardMaterial 
                color={furniture.color || '#8B4513'}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Render doors */}
      {currentRoom.doors.map(door => {
        const wall = currentRoom.walls[door.wallIndex];
        if (!wall) return null;
        
        const wallLength = Math.sqrt(
          Math.pow(wall.end.x - wall.start.x, 2) + 
          Math.pow(wall.end.y - wall.start.y, 2)
        ) / 40;
        
        const wallStartX = (wall.start.x - 400) / 40;
        const wallStartZ = (wall.start.y - 300) / 40;
        
        const wallAngle = Math.atan2(
          wall.end.y - wall.start.y,
          wall.end.x - wall.start.x
        );
        
        const offsetDistance = door.position * wallLength;
        const doorX = wallStartX + Math.cos(wallAngle) * offsetDistance;
        const doorZ = wallStartZ + Math.sin(wallAngle) * offsetDistance;
        
        return (
          <group
            key={door.id}
            position={[doorX, 0, doorZ]}
            rotation={[0, wallAngle, 0]}
          >
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[door.width / 25, 2.2, 0.15]} />
              <meshStandardMaterial 
                color={door.color || '#8B4513'}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[door.width / 60, 1.0, 0.08]}>
              <sphereGeometry args={[0.03]} />
              <meshStandardMaterial 
                color="#FFD700"
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Render windows */}
      {currentRoom.windows.map(window => {
        const wall = currentRoom.walls[window.wallIndex];
        if (!wall) return null;
        
        const wallLength = Math.sqrt(
          Math.pow(wall.end.x - wall.start.x, 2) + 
          Math.pow(wall.end.y - wall.start.y, 2)
        ) / 40;
        
        const wallStartX = (wall.start.x - 400) / 40;
        const wallStartZ = (wall.start.y - 300) / 40;
        
        const wallAngle = Math.atan2(
          wall.end.y - wall.start.y,
          wall.end.x - wall.start.x
        );
        
        const offsetDistance = window.position * wallLength;
        const windowX = wallStartX + Math.cos(wallAngle) * offsetDistance;
        const windowZ = wallStartZ + Math.sin(wallAngle) * offsetDistance;
        
        return (
          <group
            key={window.id}
            position={[windowX, 0, windowZ]}
            rotation={[0, wallAngle, 0]}
          >
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[window.width / 25, window.height / 25, 0.05]} />
              <meshStandardMaterial 
                color="#FFFFFF"
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 1.8, 0.02]}>
              <boxGeometry args={[window.width / 25 - 0.05, window.height / 25 - 0.05, 0.01]} />
              <meshStandardMaterial 
                color={window.color || '#4169E1'}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Floor outline */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          color="#E6E6FA"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function ARLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
      />
      <pointLight position={[0, 3, 0]} intensity={0.4} />
    </>
  );
}

export function ARPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [roomScale, setRoomScale] = useState(1);
  const [roomPosition, setRoomPosition] = useState({ x: 0, y: 0, z: -3 });
  const [roomRotation, setRoomRotation] = useState({ x: 0, y: 0, z: 0 });

  const startAR = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Starting AR camera access...');
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported on this device or browser.');
        setIsLoading(false);
        return;
      }

      // Check available devices first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices.length);

      if (videoDevices.length === 0) {
        setError('No camera found on this device.');
        return;
      }

      // Request camera permissions with fallback options
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: Math.min(window.innerWidth, 1280) },
          height: { ideal: Math.min(window.innerHeight, 720) }
        }
      };

      console.log('Trying environment camera...');
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Environment camera success');
      } catch (envError) {
        console.log('Environment camera failed, trying any camera:', envError);
        // Fallback to any available camera
        constraints = {
          video: {
            width: { ideal: Math.min(window.innerWidth, 1280) },
            height: { ideal: Math.min(window.innerHeight, 720) }
          }
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Fallback camera success');
      }
      
      setStream(mediaStream);
      setIsARActive(true);
      setError('');
      setIsLoading(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(playError => {
            console.error('Video play error:', playError);
            setError('Failed to start video. Please try again.');
            setIsLoading(false);
          });
        };
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported on this browser.');
      } else {
        setError(`Camera access failed: ${err.message}. Please check permissions and try again.`);
      }
    }
  }, []);

  const stopAR = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsARActive(false);
    setError('');
  }, [stream]);

  const resetRoomPosition = () => {
    setRoomPosition({ x: 0, y: 0, z: -3 });
    setRoomRotation({ x: 0, y: 0, z: 0 });
    setRoomScale(1);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (!isARActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gradient-to-br from-white/98 to-amber-50/95 backdrop-blur-md rounded-xl p-8 shadow-xl border border-stone-200 max-w-md w-full mx-4">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <Camera size={32} className="text-amber-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                AR Room Preview
              </h2>
              <p className="text-stone-600 text-sm">
                View your designed room in augmented reality using your device camera
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={startAR}
                disabled={isLoading}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Accessing Camera...
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    Start AR Preview
                  </>
                )}
              </Button>
              
              <div className="text-xs text-stone-500 space-y-1">
                <p>• Point your camera at a flat surface</p>
                <p>• Allow camera permissions when prompted</p>
                <p>• Works best in good lighting conditions</p>
                <p>• Requires HTTPS or localhost for camera access</p>
              </div>
              
              {/* Debug button for testing camera access */}
              <Button
                onClick={async () => {
                  try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const cameras = devices.filter(d => d.kind === 'videoinput');
                    console.log('Camera devices found:', cameras.length);
                    console.log('Camera devices:', cameras);
                  } catch (err) {
                    console.error('Camera enumeration failed:', err);
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Test Camera Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* AR Canvas Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 2, 0], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ARLighting />
          
          <group
            position={[roomPosition.x, roomPosition.y, roomPosition.z]}
            rotation={[roomRotation.x, roomRotation.y, roomRotation.z]}
            scale={[roomScale, roomScale, roomScale]}
          >
            <ARRoom />
          </group>
        </Canvas>
      </div>

      {/* AR Controls */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-3">
            <div className="flex items-center gap-2 text-white text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              AR Preview Active
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              stopAR();
            }}
            variant="outline"
            size="sm"
            className="bg-black/60 backdrop-blur-md text-white border-white/30 hover:bg-black/80"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Room Controls - Mobile Optimized */}
      <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 pointer-events-auto">
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-white text-xs md:text-sm font-medium">Scale</label>
              <div className="flex gap-2 items-center justify-center">
                <Button
                  onClick={() => setRoomScale(prev => Math.max(0.1, prev - 0.1))}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 min-h-[44px] min-w-[44px] touch-target"
                >
                  <ZoomOut size={18} />
                </Button>
                <span className="text-white text-sm md:text-base px-3 py-2 bg-white/10 rounded min-w-[60px] text-center">
                  {roomScale.toFixed(1)}x
                </span>
                <Button
                  onClick={() => setRoomScale(prev => Math.min(3, prev + 0.1))}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 min-h-[44px] min-w-[44px] touch-target"
                >
                  <ZoomIn size={18} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-xs md:text-sm font-medium">Rotation</label>
              <div className="flex gap-2 items-center justify-center">
                <Button
                  onClick={() => setRoomRotation(prev => ({ ...prev, y: prev.y - 0.2 }))}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 min-h-[44px] min-w-[44px] touch-target"
                >
                  <RotateCcw size={18} />
                </Button>
                <Button
                  onClick={resetRoomPosition}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 min-h-[44px] px-4 touch-target"
                >
                  <Move3D size={18} />
                </Button>
                <Button
                  onClick={() => setRoomRotation(prev => ({ ...prev, y: prev.y + 0.2 }))}
                  size="sm"
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 min-h-[44px] min-w-[44px] touch-target"
                >
                  <RotateCcw size={18} style={{ transform: 'scaleX(-1)' }} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/20">
            <label className="text-white text-xs md:text-sm font-medium block mb-2">Position</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                onClick={() => setRoomPosition(prev => ({ ...prev, x: prev.x - 0.2 }))}
                size="sm"
                variant="outline"
                className="bg-white/20 text-white border-white/30 text-xs md:text-sm min-h-[44px] touch-target"
              >
                ← Left
              </Button>
              <Button
                onClick={() => setRoomPosition(prev => ({ ...prev, x: prev.x + 0.2 }))}
                size="sm"
                variant="outline"
                className="bg-white/20 text-white border-white/30 text-xs md:text-sm min-h-[44px] touch-target"
              >
                Right →
              </Button>
              <Button
                onClick={() => setRoomPosition(prev => ({ ...prev, z: prev.z + 0.2 }))}
                size="sm"
                variant="outline"
                className="bg-white/20 text-white border-white/30 text-xs md:text-sm min-h-[44px] touch-target"
              >
                Closer
              </Button>
              <Button
                onClick={() => setRoomPosition(prev => ({ ...prev, z: prev.z - 0.2 }))}
                size="sm"
                variant="outline"
                className="bg-white/20 text-white border-white/30 text-xs md:text-sm min-h-[44px] touch-target"
              >
                Further
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 text-center">
          <p className="text-white text-sm">
            Point your camera at a flat surface and use the controls below to position your room
          </p>
        </div>
      </div>
    </div>
  );
}