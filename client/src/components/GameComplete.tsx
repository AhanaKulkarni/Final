import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from '../lib/stores/useGame';
import { useRoomStore } from '../lib/stores/useRoomStore';
import { useAudio } from '../lib/stores/useAudio';
import { Trophy, Star, Clock, Home, RotateCcw, Share2 } from 'lucide-react';

export function GameComplete() {
  const { stats, objectives, playerName, restart } = useGame();
  const { clearRoom } = useRoomStore();
  const { playSuccess } = useAudio();

  const completedObjectives = objectives.filter(obj => obj.completed);
  const getElapsedTime = () => {
    if (!stats.timeStarted) return '0:00';
    const elapsed = Math.floor((Date.now() - stats.timeStarted) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    const completionPercentage = (completedObjectives.length / objectives.length) * 100;
    if (completionPercentage === 100) return { title: 'Master Designer', stars: 5, color: 'text-amber-600' };
    if (completionPercentage >= 80) return { title: 'Expert Designer', stars: 4, color: 'text-amber-600' };
    if (completionPercentage >= 60) return { title: 'Skilled Designer', stars: 3, color: 'text-amber-600' };
    if (completionPercentage >= 40) return { title: 'Apprentice Designer', stars: 2, color: 'text-stone-600' };
    return { title: 'Beginner Designer', stars: 1, color: 'text-stone-500' };
  };

  const rating = getPerformanceRating();

  useEffect(() => {
    playSuccess();
  }, []);

  const handlePlayAgain = () => {
    clearRoom();
    restart();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
              <Trophy size={48} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-stone-700 bg-clip-text text-transparent">
            Room Complete!
          </CardTitle>
          <div className="flex justify-center items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={20}
                className={i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}
              />
            ))}
          </div>
          <p className={`text-lg font-semibold ${rating.color}`}>
            {rating.title}
          </p>
          {playerName && (
            <p className="text-stone-600">Congratulations, {playerName}!</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Final Score */}
          <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <div className="text-3xl font-bold text-amber-800 mb-1">{stats.score}</div>
            <div className="text-sm text-amber-700">Total Points</div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/60 rounded-lg border border-stone-200">
              <Clock className="mx-auto mb-1 text-stone-600" size={20} />
              <div className="font-semibold text-stone-700">{getElapsedTime()}</div>
              <div className="text-xs text-stone-600">Design Time</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-stone-200">
              <Home className="mx-auto mb-1 text-stone-600" size={20} />
              <div className="font-semibold text-stone-700">{completedObjectives.length}/{objectives.length}</div>
              <div className="text-xs text-stone-600">Objectives</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-2">
            <h4 className="font-medium text-stone-700">Design Summary:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-stone-50 rounded">
                <span className="text-stone-600">Furniture Added:</span>
                <span className="font-medium text-stone-800">{stats.furnitureAdded}</span>
              </div>
              <div className="flex justify-between p-2 bg-stone-50 rounded">
                <span className="text-stone-600">Doors Added:</span>
                <span className="font-medium text-stone-800">{stats.doorsAdded}</span>
              </div>
              <div className="flex justify-between p-2 bg-stone-50 rounded">
                <span className="text-stone-600">Windows Added:</span>
                <span className="font-medium text-stone-800">{stats.windowsAdded}</span>
              </div>
              <div className="flex justify-between p-2 bg-stone-50 rounded">
                <span className="text-stone-600">Final Score:</span>
                <span className="font-medium text-amber-600">{stats.score} pts</span>
              </div>
            </div>
          </div>

          {/* Completed Objectives */}
          <div className="space-y-2">
            <h4 className="font-medium text-stone-700">Achievements:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {completedObjectives.map((objective) => (
                <div 
                  key={objective.id}
                  className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-sm"
                >
                  <span className="text-green-800 font-medium">{objective.title}</span>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    +{objective.points}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePlayAgain}
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
            >
              <RotateCcw size={20} className="mr-2" />
              Design Another Room
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full border-stone-300 text-stone-700 hover:bg-stone-50"
              onClick={() => {
                // Future: Share functionality
                console.log('Share feature coming soon!');
              }}
            >
              <Share2 size={20} className="mr-2" />
              Share Your Design
            </Button>
          </div>

          {/* Tips for next time */}
          {rating.stars < 5 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h5 className="font-medium text-amber-800 mb-1">Tips for next time:</h5>
              <ul className="text-xs text-amber-700 space-y-1">
                {completedObjectives.length < objectives.length && (
                  <li>• Try to complete all objectives for maximum points</li>
                )}
                {stats.furnitureAdded < 5 && (
                  <li>• Add more furniture to create a fully furnished space</li>
                )}
                <li>• Experiment with different room sizes and layouts</li>
                <li>• Use 3D and AR modes to visualize your design</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}