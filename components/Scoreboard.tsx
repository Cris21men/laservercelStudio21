'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { ScoreManager } from '../utils/scores';
import { Score } from '../types/game';

export default function Scoreboard() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const loadScores = () => {
      const loadedScores = ScoreManager.loadScores();
      setScores(loadedScores);
    };

    loadScores();

    // Actualizar cada 5 segundos por si hay nuevas puntuaciones
    const interval = setInterval(loadScores, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={20} />;
      case 1:
        return <Medal className="text-gray-400" size={20} />;
      case 2:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <span className="text-gray-500 font-bold">{index + 1}</span>;
    }
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="bg-game-blue border-2 border-game-green rounded-xl p-6 w-full max-w-md"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-game-green mb-2 flex items-center justify-center space-x-2">
          <Trophy size={24} />
          <span>Mejores Puntuaciones</span>
        </h2>
        <div className="w-16 h-1 bg-game-green mx-auto rounded"></div>
      </div>

      {scores.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p>¡Sé el primero en establecer un récord!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <motion.div
              key={`${score.username}-${score.timestamp || index}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                index === 0 
                  ? 'bg-yellow-500/20 border border-yellow-500/50' 
                  : index === 1
                  ? 'bg-gray-500/20 border border-gray-500/50'
                  : index === 2
                  ? 'bg-amber-600/20 border border-amber-600/50'
                  : 'bg-game-accent/50 hover:bg-game-accent/70'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getPositionIcon(index)}
                </div>
                <div>
                  <div className={`font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-amber-500' :
                    'text-white'
                  }`}>
                    {score.username.length > 12 
                      ? `${score.username.substring(0, 12)}...` 
                      : score.username
                    }
                  </div>
                  {score.timestamp && (
                    <div className="text-xs text-gray-400">
                      {formatDate(score.timestamp)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`font-bold text-right ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-300' :
                index === 2 ? 'text-amber-500' :
                'text-game-green'
              }`}>
                {formatScore(score.score)}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {scores.length > 0 && (
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-400">
            Mostrando top {scores.length} de 10
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ¡Supera estos récords!
          </div>
        </div>
      )}
    </motion.div>
  );
}