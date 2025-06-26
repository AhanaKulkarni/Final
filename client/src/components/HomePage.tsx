import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Edit3, Layers3, Camera, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStartDesigning: (roomName?: string) => void;
}

export function HomePage({ onStartDesigning }: HomePageProps) {
  const [roomName, setRoomName] = useState('');

  const handleStartDesigning = () => {
    onStartDesigning(roomName || 'My Room');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0 text-center py-6 px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Home className="text-blue-600" size={40} />
          <h1 className="text-3xl font-bold text-gray-800">Room Designer</h1>
        </div>
        <p className="text-lg text-gray-600">
          Design rooms in 2D, visualize in 3D, preview with AR
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">Start Your Design</CardTitle>
              <p className="text-gray-600">Create beautiful room layouts</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Room Setup */}
              <div className="space-y-3">
                <Label htmlFor="roomName" className="text-sm font-medium text-gray-700">
                  Room Name (Optional)
                </Label>
                <Input
                  id="roomName"
                  type="text"
                  placeholder="e.g. Living Room, Bedroom, Office..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="text-sm p-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleStartDesigning()}
                />
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Edit3 className="mx-auto mb-2 text-blue-600" size={24} />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">2D Design</h3>
                  <p className="text-xs text-gray-600">Draw walls & place furniture</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <Layers3 className="mx-auto mb-2 text-green-600" size={24} />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">3D Preview</h3>
                  <p className="text-xs text-gray-600">Realistic 3D visualization</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <Camera className="mx-auto mb-2 text-purple-600" size={24} />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">AR Preview</h3>
                  <p className="text-xs text-gray-600">View in real world</p>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center pt-2">
                <Button
                  onClick={handleStartDesigning}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Start Designing
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Quick Tips:</h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Draw walls to create your room shape</li>
                  <li>• Add doors and windows by clicking walls</li>
                  <li>• Drag furniture from library onto canvas</li>
                  <li>• Switch between 2D and 3D views anytime</li>
                  <li>• Use AR to see room in real space</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}