import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { useGame } from '../lib/stores/useGame';
import { Home, Target, Clock, Star } from 'lucide-react';

export function GameIntro() {
  const [roomWidth, setRoomWidth] = useState('400');
  const [roomHeight, setRoomHeight] = useState('300');
  const [playerName, setPlayerName] = useState('');
  const { setRoomDimensions, clearRoom } = useRoomStore();
  const { start } = useGame();

  const startGame = () => {
    const width = parseInt(roomWidth) || 400;
    const height = parseInt(roomHeight) || 300;
    
    // Ensure minimum and maximum room sizes
    const clampedWidth = Math.max(200, Math.min(800, width));
    const clampedHeight = Math.max(200, Math.min(600, height));
    
    clearRoom();
    setRoomDimensions(clampedWidth, clampedHeight);
    start();
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 via-white to-stone-100 flex">
      <Card className="w-full h-full bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-none flex flex-col">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="p-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
              <Home size={64} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-stone-700 bg-clip-text text-transparent">
            Room Designer Challenge
          </CardTitle>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Design your perfect room by creating walls, placing furniture, and adding doors and windows. 
            Challenge yourself to create functional and beautiful spaces!
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-center space-y-6 px-12 py-8">
          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/60 rounded-xl border border-stone-200">
              <Target className="mx-auto mb-2 text-amber-600" size={24} />
              <h3 className="font-semibold text-stone-700">Design Goals</h3>
              <p className="text-sm text-stone-600">Complete room layouts with furniture placement</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-xl border border-stone-200">
              <Clock className="mx-auto mb-2 text-amber-600" size={24} />
              <h3 className="font-semibold text-stone-700">Real-time 3D</h3>
              <p className="text-sm text-stone-600">See your design in 2D, 3D, and AR modes</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-xl border border-stone-200">
              <Star className="mx-auto mb-2 text-amber-600" size={24} />
              <h3 className="font-semibold text-stone-700">Creativity</h3>
              <p className="text-sm text-stone-600">Express your style with colors and layouts</p>
            </div>
          </div>

          {/* Room Setup */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-stone-700 mb-4">Setup Your Room</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-stone-700 font-medium">
                  Room Width (pixels)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  min="200"
                  max="800"
                  className="bg-white/80 border-stone-300 focus:border-amber-500"
                  placeholder="400"
                />
                <p className="text-xs text-stone-500">Recommended: 300-600 pixels</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height" className="text-stone-700 font-medium">
                  Room Height (pixels)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(e.target.value)}
                  min="200"
                  max="600"
                  className="bg-white/80 border-stone-300 focus:border-amber-500"
                  placeholder="300"
                />
                <p className="text-xs text-stone-500">Recommended: 250-500 pixels</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-stone-700 font-medium">
                Designer Name (Optional)
              </Label>
              <Input
                id="name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-white/80 border-stone-300 focus:border-amber-500"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Quick Room Presets */}
          <div className="space-y-3">
            <h4 className="font-medium text-stone-700">Quick Presets:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setRoomWidth('300'); setRoomHeight('250'); }}
                className="bg-white/60 border-stone-300 text-stone-700 hover:bg-amber-50"
              >
                Small Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setRoomWidth('400'); setRoomHeight('300'); }}
                className="bg-white/60 border-stone-300 text-stone-700 hover:bg-amber-50"
              >
                Medium Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setRoomWidth('500'); setRoomHeight('400'); }}
                className="bg-white/60 border-stone-300 text-stone-700 hover:bg-amber-50"
              >
                Large Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setRoomWidth('600'); setRoomHeight('300'); }}
                className="bg-white/60 border-stone-300 text-stone-700 hover:bg-amber-50"
              >
                Wide Room
              </Button>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={startGame}
            size="lg"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 text-lg shadow-lg"
          >
            Start Designing
          </Button>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-amber-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Draw walls by clicking and dragging in 2D mode</li>
              <li>• Add furniture from the library by dragging and dropping</li>
              <li>• Place doors and windows on walls using the controls</li>
              <li>• Switch to 3D mode to see your room in three dimensions</li>
              <li>• Use AR mode to preview your room in real space</li>
              <li>• Customize colors and sizes to make it your own</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}