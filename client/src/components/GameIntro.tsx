import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Home, Target, Camera, Layout } from 'lucide-react';
import { useGame } from '../lib/stores/useGame';
import { useRoomStore } from '../lib/stores/useRoomStore';

export function GameIntro() {
  const [roomWidth, setRoomWidth] = useState('400');
  const [roomHeight, setRoomHeight] = useState('300');
  const [playerName, setPlayerName] = useState('');
  const { start, setPlayerName: setGamePlayerName, setCurrentRoomName } = useGame();
  const { setRoomDimensions } = useRoomStore();

  const startGame = () => {
    const width = parseInt(roomWidth);
    const height = parseInt(roomHeight);
    
    // Validate dimensions
    const clampedWidth = Math.max(200, Math.min(800, width));
    const clampedHeight = Math.max(150, Math.min(600, height));
    
    // Set game data
    if (playerName.trim()) {
      setGamePlayerName(playerName.trim());
    }
    setCurrentRoomName(`${clampedWidth}x${clampedHeight} Room`);
    setRoomDimensions(clampedWidth, clampedHeight);
    start();
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-5xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Home size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Room Designer Studio
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create stunning room designs with interactive 2D to 3D visualization
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 text-center">
              <Layout className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-800 text-sm">2D Design</h3>
              <p className="text-xs text-gray-600">Floor planning</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 text-center">
              <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-800 text-sm">3D Preview</h3>
              <p className="text-xs text-gray-600">Real-time 3D</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 text-center">
              <Camera className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-800 text-sm">AR Mode</h3>
              <p className="text-xs text-gray-600">Augmented reality</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 text-center">
              <Home className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-800 text-sm">Customize</h3>
              <p className="text-xs text-gray-600">Colors & styles</p>
            </div>
          </div>

          {/* Main Setup Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Start Your Design
              </CardTitle>
              <p className="text-gray-600">Set up room dimensions and begin creating</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Room Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                    Room Width (pixels)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                    min="200"
                    max="800"
                    className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">Recommended: 300-600</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                    Room Height (pixels)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(e.target.value)}
                    min="150"
                    max="600"
                    className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">Recommended: 250-500</p>
                </div>
              </div>

              {/* Designer Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Designer Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Quick Presets:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setRoomWidth('300'); setRoomHeight('250'); }}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    Small
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setRoomWidth('400'); setRoomHeight('300'); }}
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setRoomWidth('500'); setRoomHeight('400'); }}
                    className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
                  >
                    Large
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setRoomWidth('600'); setRoomHeight('300'); }}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    Wide
                  </Button>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startGame}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg"
              >
                Start Designing Now
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">How to Design:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Draw walls by clicking and dragging</li>
                <li>• Add furniture from the library</li>
                <li>• Place doors and windows on walls</li>
                <li>• Switch between 2D, 3D, and AR modes</li>
              </ul>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Pro Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Plan your layout before adding furniture</li>
                <li>• Use grid snapping for precision</li>
                <li>• Test your design in 3D frequently</li>
                <li>• Try AR mode for real-world preview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}