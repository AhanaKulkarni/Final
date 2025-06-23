import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Home, Target, Clock, Star, Palette, Camera, Layout, Users, Zap, Award } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8 shadow-xl">
            <Home size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Room Designer Studio
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create stunning room designs with our interactive 2D to 3D designer. 
            From floor plans to immersive visualizations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-md">
              <span className="text-sm font-medium text-gray-700">✨ Real-time 3D Preview</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-md">
              <span className="text-sm font-medium text-gray-700">📱 AR Mode</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-md">
              <span className="text-sm font-medium text-gray-700">🎨 Custom Colors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Powerful Design Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Layout className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2D Floor Planning</h3>
              <p className="text-gray-600 mb-4">Draw walls with precision, create custom room layouts with our intuitive drag-and-drop interface.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Click and drag to create walls</li>
                <li>• Automatic corner snapping</li>
                <li>• Grid alignment system</li>
              </ul>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Target className="w-12 h-12 text-purple-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3D Visualization</h3>
              <p className="text-gray-600 mb-4">See your designs come to life with realistic 3D rendering and dynamic lighting effects.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Real-time 3D preview</li>
                <li>• Orbit camera controls</li>
                <li>• Realistic lighting</li>
              </ul>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Camera className="w-12 h-12 text-pink-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AR Preview</h3>
              <p className="text-gray-600 mb-4">Preview your room designs in real space using your device camera for augmented reality.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Live camera overlay</li>
                <li>• Scale and position controls</li>
                <li>• Mobile optimized</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Room Setup Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                Start Your Design Journey
              </CardTitle>
              <p className="text-lg text-gray-600">
                Set up your room dimensions and begin creating your perfect space
              </p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              {/* Room Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="width" className="text-base font-semibold text-gray-700">
                    Room Width (pixels)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                    min="200"
                    max="800"
                    className="text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500">Recommended: 300-600 pixels</p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-base font-semibold text-gray-700">
                    Room Height (pixels)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(e.target.value)}
                    min="150"
                    max="600"
                    className="text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500">Recommended: 250-500 pixels</p>
                </div>
              </div>

              {/* Designer Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                  Designer Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-lg p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700">Quick Room Presets:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setRoomWidth('300'); setRoomHeight('250'); }}
                    className="h-12 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 rounded-xl"
                  >
                    Small Room
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setRoomWidth('400'); setRoomHeight('300'); }}
                    className="h-12 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-purple-200 rounded-xl"
                  >
                    Medium Room
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setRoomWidth('500'); setRoomHeight('400'); }}
                    className="h-12 bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200 text-pink-700 hover:from-pink-100 hover:to-pink-200 rounded-xl"
                  >
                    Large Room
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setRoomWidth('600'); setRoomHeight('300'); }}
                    className="h-12 bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700 hover:from-green-100 hover:to-green-200 rounded-xl"
                  >
                    Wide Room
                  </Button>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startGame}
                size="lg"
                className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xl shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                🚀 Start Designing Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How to Create Amazing Rooms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Design Steps */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Design Process</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Draw Your Walls</h4>
                    <p className="text-gray-600">Click and drag to create room boundaries. Walls automatically snap for perfect corners.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Add Furniture</h4>
                    <p className="text-gray-600">Drag furniture from the library and position it in your room. Resize and rotate as needed.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Place Doors & Windows</h4>
                    <p className="text-gray-600">Add doors and windows to walls. Adjust their size and position for the perfect look.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">View in 3D</h4>
                    <p className="text-gray-600">Switch to 3D mode to see your room come to life. Use AR mode for real-world preview.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pro Tips */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Pro Design Tips</h3>
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Planning First</h4>
                  <p className="text-gray-600 text-sm">Think about room flow and functionality before placing furniture. Leave space for movement.</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">🎨 Color Harmony</h4>
                  <p className="text-gray-600 text-sm">Use complementary colors for walls and furniture to create a cohesive design aesthetic.</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">📐 Scale Matters</h4>
                  <p className="text-gray-600 text-sm">Keep furniture proportional to room size. Large rooms need bigger furniture pieces.</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Test Views</h4>
                  <p className="text-gray-600 text-sm">Frequently switch between 2D and 3D modes to ensure your design looks great from all angles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-4 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Design Your Dream Room?</h3>
          <p className="text-gray-300 mb-8">Join thousands of designers creating beautiful spaces with our intuitive tools.</p>
          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Extra content to test scrolling */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Scroll Test Section</h3>
          <p className="text-lg text-gray-600 mb-8">
            If you can see this section and scroll to it, then scrolling is working perfectly! 
            This extra content ensures the page extends beyond the viewport height.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Test Block 1</h4>
              <p className="text-gray-600">Additional content to verify scrolling functionality works as expected.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Test Block 2</h4>
              <p className="text-gray-600">More content to ensure the page is definitely longer than the viewport.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Test Block 3</h4>
              <p className="text-gray-600">Final test block - if you can scroll to see this, everything is working!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}