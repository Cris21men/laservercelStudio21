'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface TutorialProps {
  onStartGame: () => void;
}

export default function Tutorial({ onStartGame }: TutorialProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-game-blue border-2 border-game-green rounded-xl p-6 max-w-2xl mx-4 max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-game-green mb-2">
            ¿Cómo jugar?
          </h2>
          <div className="w-20 h-1 bg-game-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
          {/* Controles */}
          <div className="bg-game-accent/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-game-green mb-3 flex items-center">
              🎮 Controles
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-game-blue px-2 py-1 rounded text-xs font-mono">← →</div>
                <span>Mover tanque</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-game-blue px-2 py-1 rounded text-xs font-mono">↑ ESPACIO</div>
                <span>Disparar láser</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-game-blue px-2 py-1 rounded text-xs font-mono">🔊</div>
                <span>Silenciar sonidos</span>
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div className="bg-game-accent/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-game-green mb-3 flex items-center">
              🎯 Objetivo
            </h3>
            <div className="text-sm space-y-2">
              <p>• Dispara al misil con la respuesta correcta</p>
              <p>• ¡No te equivoques! Pierdes puntos y salud</p>
              <p>• Los misiles que lleguen al fondo también te dañan</p>
            </div>
          </div>

          {/* Matemáticas */}
          <div className="bg-game-accent/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-game-green mb-3 flex items-center">
              📊 Matemáticas
            </h3>
            <div className="text-sm space-y-1">
              <div>• <span className="text-blue-400">Sumas</span> (Niveles 1-2)</div>
              <div>• <span className="text-green-400">Sumas y restas</span> (Niveles 3-4)</div>
              <div>• <span className="text-yellow-400">Multiplicaciones</span> (Niveles 5-9)</div>
              <div>• <span className="text-red-400">¡Modo hardcore!</span> (Nivel 10+)</div>
            </div>
          </div>

          {/* Puntuación */}
          <div className="bg-game-accent/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-game-green mb-3 flex items-center">
              💯 Puntuación
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Disparo correcto:</span>
                <span className="text-green-400 font-bold">+100</span>
              </div>
              <div className="flex justify-between">
                <span>Disparo incorrecto:</span>
                <span className="text-red-400 font-bold">-50</span>
              </div>
              <div className="flex justify-between">
                <span>Misil perdido:</span>
                <span className="text-yellow-400 font-bold">-20 salud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consejos rápidos */}
        <div className="mt-6 bg-game-green/10 border border-game-green/30 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-game-green mb-2">💡 Consejos</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• El tanque se mueve instantáneamente a la posición del enemigo</p>
            <p>• La velocidad aumenta gradualmente, ¡mantén la calma!</p>
            <p>• Practica las tablas de multiplicar para niveles avanzados</p>
          </div>
        </div>

        {/* Botón de inicio */}
        <motion.button
          onClick={onStartGame}
          className="w-full mt-6 bg-game-green hover:bg-green-400 text-game-dark font-bold text-xl py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play size={24} />
          <span>¡Comenzar Aventura!</span>
        </motion.button>

        <div className="text-center mt-4 text-gray-400 text-sm">
          ¡Demuestra tus habilidades matemáticas!
        </div>
      </motion.div>
    </motion.div>
  );
}