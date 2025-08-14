'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Home, Trophy, Target, Zap } from 'lucide-react';

interface GameOverProps {
  username: string;
  finalScore: number;
  finalLevel: number;
  highScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function GameOver({
  username,
  finalScore,
  finalLevel,
  highScore,
  isNewRecord,
  onRestart,
  onBackToMenu
}: GameOverProps) {
  const getPerformanceMessage = () => {
    if (isNewRecord) {
      return "¡NUEVO RÉCORD! ¡Eres una leyenda!";
    } else if (finalScore >= highScore * 0.8) {
      return "¡Excelente rendimiento!";
    } else if (finalScore >= highScore * 0.5) {
      return "¡Buen trabajo, comandante!";
    } else if (finalLevel >= 5) {
      return "¡No está mal para ser humano!";
    } else {
      return "¡Sigue practicando, soldado!";
    }
  };

  const getScoreColor = () => {
    if (isNewRecord) return "text-yellow-400";
    if (finalScore >= highScore * 0.8) return "text-game-green";
    if (finalScore >= highScore * 0.5) return "text-blue-400";
    return "text-gray-300";
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-game-blue border-2 border-game-red rounded-xl p-8 max-w-lg mx-4 text-center"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
      >
        {/* Título */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-4xl mb-4">
            {isNewRecord ? "🏆" : finalLevel >= 10 ? "💀" : finalLevel >= 5 ? "⚔️" : "💥"}
          </div>
          <h2 className="text-3xl font-bold text-game-red mb-2">
            ¡Misión Terminada!
          </h2>
          <p className={`text-lg font-semibold ${isNewRecord ? 'text-yellow-400' : 'text-gray-300'}`}>
            {getPerformanceMessage()}
          </p>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-lg text-gray-300">
            Comandante: <span className="text-white font-bold">{username}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-game-accent/50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target size={20} className="text-game-green" />
                <span className="text-sm text-gray-300">Puntuación Final</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor()}`}>
                {finalScore.toLocaleString()}
              </div>
            </div>

            <div className="bg-game-accent/50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap size={20} className="text-yellow-500" />
                <span className="text-sm text-gray-300">Nivel Alcanzado</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {finalLevel}
              </div>
            </div>
          </div>

          {isNewRecord && (
            <motion.div
              className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy size={20} className="text-yellow-500" />
                <span className="text-yellow-400 font-bold">¡NUEVO RÉCORD!</span>
              </div>
              <div className="text-sm text-gray-300">
                Récord anterior: {highScore.toLocaleString()}
              </div>
            </motion.div>
          )}

          <div className="text-sm text-gray-400">
            {finalLevel >= 10 
              ? "¡Sobreviviste al modo hardcore! Eres una máquina de calcular."
              : finalLevel >= 5
              ? "¡Buen progreso! Casi llegas al modo hardcore."
              : "Sigue entrenando para alcanzar niveles superiores."
            }
          </div>
        </motion.div>

        {/* Botones */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onRestart}
            className="flex-1 bg-game-green hover:bg-green-400 text-game-dark font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Intentar de Nuevo</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="flex-1 bg-game-accent hover:bg-game-blue text-white font-bold py-3 px-6 rounded-lg border border-game-green/30 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Menú Principal</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}