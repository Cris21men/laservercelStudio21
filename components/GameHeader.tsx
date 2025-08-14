'use client';

import { Volume2, VolumeX, LogOut } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  highScore: number;
  level: number;
  health: number;
  experienceProgress: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

export default function GameHeader({
  score,
  highScore,
  level,
  health,
  experienceProgress,
  isMuted,
  onToggleMute,
  onExit
}: GameHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-game-accent/90 backdrop-blur-sm p-4 flex justify-between items-center z-50 border-b border-game-green/30">
      {/* Información de puntuación */}
      <div className="flex flex-col items-start space-y-1">
        <div className="text-lg font-bold text-white">
          Puntuación: <span className="text-game-green">{score.toLocaleString()}</span>
        </div>
        <div className="text-sm text-gray-300">
          Mejor: <span className="text-yellow-400">{highScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Información de nivel */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-xl font-bold text-game-green">
          Nivel {level}
        </div>
        
        {/* Barra de experiencia */}
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-game-green transition-all duration-300"
            style={{ width: `${experienceProgress}%` }}
          />
        </div>
      </div>

      {/* Controles y salud */}
      <div className="flex items-center space-x-4">
        {/* Barra de salud */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-gray-300">Salud</span>
          <div className="w-2 h-24 bg-gray-700 rounded-full overflow-hidden border border-game-green/50">
            <div 
              className={`w-full transition-all duration-300 rounded-full ${
                health > 50 ? 'bg-game-green' : 
                health > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ 
                height: `${Math.max(0, health)}%`,
                marginTop: 'auto'
              }}
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={onToggleMute}
            className="p-2 bg-game-blue hover:bg-game-green hover:text-game-dark transition-all duration-200 rounded-lg"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button
            onClick={onExit}
            className="p-2 bg-red-600 hover:bg-red-700 transition-all duration-200 rounded-lg"
            title="Salir del juego"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}