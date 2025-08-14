'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AudioSystem } from '../utils/audioSystem';
import { ScoreManager } from '../utils/scores';
import GameContainer from '../components/GameContainer';
import Tutorial from '../components/Tutorial';
import UserInput from '../components/UserInput';
import GameOver from '../components/GameOver';
import Scoreboard from '../components/Scoreboard';

type GameState = 'menu' | 'tutorial' | 'userInput' | 'playing' | 'gameOver';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [username, setUsername] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    // Inicializar sistema de audio
    const initAudio = async () => {
      const audioSystem = AudioSystem.getInstance();
      await audioSystem.initialize();
    };

    initAudio();

    // Cargar high score
    setHighScore(ScoreManager.getHighScore());
  }, []);

  const handleStartTutorial = () => {
    setGameState('tutorial');
  };

  const handleStartUserInput = () => {
    setGameState('userInput');
  };

  const handleStartGame = (playerUsername: string) => {
    setUsername(playerUsername);
    setGameState('playing');
  };

  // FIX: Ahora recibe correctamente los parámetros del juego
  const handleGameEnd = (score: number, level: number) => {
    setFinalScore(score);
    setFinalLevel(level);
    
    const currentHighScore = ScoreManager.getHighScore();
    setHighScore(currentHighScore);
    setIsNewRecord(score > currentHighScore);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setGameState('userInput');
    // Reset scores for new game
    setFinalScore(0);
    setFinalLevel(1);
    setIsNewRecord(false);
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setUsername('');
    setFinalScore(0);
    setFinalLevel(1);
    setIsNewRecord(false);
  };

  const handleExitGame = () => {
    setGameState('menu');
    // Reset values when exiting
    setFinalScore(0);
    setFinalLevel(1);
    setIsNewRecord(false);
  };

  return (
    <div className="min-h-screen bg-game-dark flex">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-game-dark via-game-blue/20 to-game-accent/30" />
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-game-green/10 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-game-red/10 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Sidebar con scoreboard (solo en menú) */}
        {gameState === 'menu' && (
          <motion.div
            className="w-80 p-6 flex flex-col space-y-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Scoreboard />
          </motion.div>
        )}

        {/* Área principal del juego */}
        <div className="flex-1 relative">
          {gameState === 'menu' && (
            <motion.div
              className="flex items-center justify-center min-h-screen"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-center max-w-2xl mx-4">
                {/* Logo y título */}
                <motion.div
                  className="mb-12"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                >
                  <h1 className="text-6xl font-bold text-game-green mb-4 text-shadow-lg">
                    Desafío Matemáticos
                  </h1>
                  <div className="text-2xl text-gray-300 mb-2">Studio21</div>
                  <div className="w-24 h-1 bg-game-green mx-auto rounded"></div>
                </motion.div>

                {/* Descripción */}
                <motion.p
                  className="text-xl text-gray-300 mb-12 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Pon a prueba tus habilidades matemáticas en esta épica batalla contra misiles. 
                  ¡Resuelve operaciones y salva el mundo!
                </motion.p>

                {/* Botones del menú */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleStartTutorial}
                    className="w-full max-w-sm bg-game-green hover:bg-green-400 text-game-dark font-bold text-xl py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    🚀 ¡Comenzar Aventura!
                  </button>
                  
                  <button
                    onClick={handleStartUserInput}
                    className="w-full max-w-sm bg-game-blue hover:bg-game-accent text-white font-bold text-lg py-3 px-8 rounded-lg border-2 border-game-green/50 transition-all duration-300 hover:scale-105"
                  >
                    ⚡ Juego Rápido
                  </button>
                </motion.div>

                {/* Información adicional */}
                <motion.div
                  className="mt-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-sm text-gray-400 mb-4">
                    Mejora tus habilidades matemáticas mientras te diviertes
                  </div>
                  <div className="flex justify-center space-x-8 text-sm text-gray-500">
                    <div>✓ Múltiples niveles</div>
                    <div>✓ Tabla de récords</div>
                    <div>✓ Efectos de sonido</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {gameState === 'tutorial' && (
            <Tutorial onStartGame={handleStartUserInput} />
          )}

          {gameState === 'userInput' && (
            <UserInput onStartGame={handleStartGame} />
          )}

          {gameState === 'playing' && (
            <GameContainer
              username={username}
              onGameEnd={handleGameEnd}
              onExit={handleExitGame}
            />
          )}

          {gameState === 'gameOver' && (
            <GameOver
              username={username}
              finalScore={finalScore}
              finalLevel={finalLevel}
              highScore={highScore}
              isNewRecord={isNewRecord}
              onRestart={handleRestart}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
}