'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Play } from 'lucide-react';

interface UserInputProps {
  onStartGame: (username: string) => void;
}

export default function UserInput({ onStartGame }: UserInputProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }

    if (username.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (username.trim().length > 20) {
      setError('El nombre no puede tener más de 20 caracteres');
      return;
    }

    setError('');
    onStartGame(username.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-game-blue border-2 border-game-green rounded-xl p-8 max-w-md mx-4"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-game-green rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-game-dark" />
          </div>
          <h2 className="text-2xl font-bold text-game-green mb-2">
            ¡Prepárate para la batalla!
          </h2>
          <p className="text-gray-300">
            Ingresa tu nombre para comenzar el desafío matemático
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Comandante
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-game-accent border border-game-green/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-game-green focus:ring-2 focus:ring-game-green/20 transition-all duration-200"
              placeholder="Tu nombre aquí..."
              maxLength={20}
              autoFocus
            />
            {error && (
              <motion.p
                className="text-red-400 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            className="w-full bg-game-green hover:bg-green-400 text-game-dark font-bold text-lg py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!username.trim()}
          >
            <Play size={20} />
            <span>Iniciar Misión</span>
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-400">
            Tu puntuación se guardará para la tabla de récords
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
