import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '../lib/stores/useGame';
import { Trophy, Target, Clock, Star, CheckCircle, Circle } from 'lucide-react';

export function GamePanel() {
  const { objectives, stats, playerName, phase } = useGame();

  if (phase !== 'playing') return null;

  const completedObjectives = objectives.filter(obj => obj.completed);
  const progressPercentage = (completedObjectives.length / objectives.length) * 100;
  
  const getElapsedTime = () => {
    if (!stats.timeStarted) return '0:00';
    const elapsed = Math.floor((Date.now() - stats.timeStarted) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto z-40">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-stone-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-stone-700 flex items-center gap-2">
              <Trophy className="text-amber-600" size={24} />
              Game Progress
            </CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-base px-3 py-1">
              {stats.score} pts
            </Badge>
          </div>
          {playerName && (
            <p className="text-base text-stone-600">Designer: {playerName}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-stone-700">Overall Progress</span>
              <span className="text-sm text-stone-600">
                {completedObjectives.length}/{objectives.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <Clock className="mx-auto mb-1 text-stone-600" size={16} />
              <div className="text-lg font-semibold text-stone-700">{getElapsedTime()}</div>
              <div className="text-xs text-stone-600">Time</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <Star className="mx-auto mb-1 text-amber-600" size={16} />
              <div className="text-lg font-semibold text-stone-700">{stats.furnitureAdded}</div>
              <div className="text-xs text-stone-600">Furniture</div>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <h4 className="font-medium text-stone-700 flex items-center gap-2">
              <Target size={16} />
              Objectives
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {objectives.map((objective) => (
                <div 
                  key={objective.id}
                  className={`p-3 rounded-lg border transition-all ${
                    objective.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white/60 border-stone-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {objective.completed ? (
                      <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    ) : (
                      <Circle className="text-stone-400 mt-0.5 flex-shrink-0" size={16} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium text-sm ${
                          objective.completed ? 'text-green-800' : 'text-stone-700'
                        }`}>
                          {objective.title}
                        </h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            objective.completed 
                              ? 'bg-green-100 text-green-700 border-green-300' 
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          +{objective.points}
                        </Badge>
                      </div>
                      <p className={`text-xs mt-1 ${
                        objective.completed ? 'text-green-600' : 'text-stone-600'
                      }`}>
                        {objective.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Check */}
          {completedObjectives.length === objectives.length && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3 text-center">
              <Trophy className="mx-auto mb-2 text-amber-600" size={24} />
              <div className="font-semibold text-amber-800">All Objectives Complete!</div>
              <div className="text-sm text-amber-700">You're a master room designer!</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}