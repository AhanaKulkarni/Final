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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Home className="text-blue-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-800">Room Designer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Design your perfect room in 2D, visualize in 3D, and preview with augmented reality
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800">Start Your Design</CardTitle>
            <p className="text-gray-600">Create beautiful room layouts with our intuitive design tools</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Room Setup */}
            <div className="space-y-4">
              <Label htmlFor="roomName" className="text-base font-medium text-gray-700">
                Room Name (Optional)
              </Label>
              <Input
                id="roomName"
                type="text"
                placeholder="e.g. Living Room, Bedroom, Office..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-base p-3"
                onKeyPress={(e) => e.key === 'Enter' && handleStartDesigning()}
              />
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Edit3 className="mx-auto mb-3 text-blue-600" size={32} />
                <h3 className="font-semibold text-gray-800 mb-2">2D Design</h3>
                <p className="text-sm text-gray-600">Draw walls, place furniture, and arrange your room layout</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <Layers3 className="mx-auto mb-3 text-green-600" size={32} />
                <h3 className="font-semibold text-gray-800 mb-2">3D Preview</h3>
                <p className="text-sm text-gray-600">Explore your design in realistic 3D with lighting and shadows</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <Camera className="mx-auto mb-3 text-purple-600" size={32} />
                <h3 className="font-semibold text-gray-800 mb-2">AR Preview</h3>
                <p className="text-sm text-gray-600">See your room in the real world with augmented reality</p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <Button
                onClick={handleStartDesigning}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Start Designing
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Quick Tips:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Start by drawing walls to create your room shape</li>
                <li>• Add doors and windows by clicking on walls</li>
                <li>• Drag furniture from the library onto your canvas</li>
                <li>• Switch between 2D and 3D views anytime</li>
                <li>• Use AR preview to see how your room looks in real space</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Professional room design tool with 2D editing, 3D visualization, and AR preview
        </div>
      </div>
    </div>
  );
}