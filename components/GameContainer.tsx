"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { GameState, GameConfig, Missile, PlayerMissile } from "../types/game"
import { generateOperation } from "../utils/operations"
import { AudioSystem } from "../utils/audioSystem"
import { ScoreManager } from "../utils/scores"
import GameHeader from "./GameHeader"
import clsx from "clsx"

const config: GameConfig = {
  // Posiciones perfectamente centradas en un campo de 500px
  // Cada tanque ocupa 48px (w-12), con espaciado uniforme de 100px entre centros
  tankPositions: [50, 150, 250, 350, 450], // Centros exactos para distribución perfecta
  baseSpeed: 120,
  levelSpeedMultiplier: 0.9,
  pointsPerLevel: 2500,
  healthMax: 100,
  damagePerMiss: 20,
  missileColumns: 5,
  speedIncreasePerHit: 0.98,
  minSpeed: 80,
  hardcoreLevel: 10,
  hardcoreSpeedIncrement: 1,
  shootCooldown: 200,
}

// Constantes UX optimizadas
const PLAYER_MISSILE_SPEED = 18
const MISSILE_UPDATE_INTERVAL = 25
const MISSILE_VERTICAL_OFFSET = 80
const ENEMY_MISSILE_SPEED = 0.8
const GAME_AREA_HEIGHT = 600
const GAME_AREA_WIDTH = 500
const TANK_WIDTH = 48 // w-12 en Tailwind = 48px
const MISSILE_WIDTH = 48 // w-12 en Tailwind = 48px

interface GameContainerProps {
  username: string
  onGameEnd: (score: number, level: number) => void
  onExit: () => void
}

export default function GameContainer({ username, onGameEnd, onExit }: GameContainerProps) {
  const audioSystem = AudioSystem.getInstance()
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const missileRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const playerMissileRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [gameState, setGameState] = useState<GameState>({
    currentTankPosition: 2, // Posición central (índice 2 de 5 posiciones)
    targetAnswer: null,
    score: 0,
    highScore: ScoreManager.getHighScore(),
    missileSpeed: config.baseSpeed,
    baseLevelSpeed: config.baseSpeed,
    username,
    health: config.healthMax,
    level: 1,
    isGameOver: false,
    currentQuestions: new Set(),
    missileIntervals: [],
    missileId: 0,
    missileTimeout: null,
    canShoot: true,
    lastShootTime: 0,
    isMuted: false,
  })

  const [missiles, setMissiles] = useState<Missile[]>([])
  const [playerMissiles, setPlayerMissiles] = useState<PlayerMissile[]>([])
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null)
  const [explosions, setExplosions] = useState<{ id: string; x: number; y: number }[]>([])
  const [penalties, setPenalties] = useState<{ id: string; x: number; y: number; text: string }[]>([])

  const handleCorrectShot = useCallback(
    (missile: Missile) => {
      audioSystem.play("correct")

      setGameState((prev) => {
        const newScore = prev.score + 100
        const newSpeed =
          prev.level >= config.hardcoreLevel
            ? prev.missileSpeed + config.hardcoreSpeedIncrement
            : Math.max(config.minSpeed, prev.missileSpeed * config.speedIncreasePerHit)

        return {
          ...prev,
          score: newScore,
          missileSpeed: newSpeed,
          currentQuestions: new Set(),
        }
      })

      setMissiles([])
      setTimeout(() => {
        createMissileRow()
      }, 1200)
    },
    [audioSystem],
  )

  const handleIncorrectShot = useCallback(
    (playerMissile: PlayerMissile) => {
      audioSystem.play("wrong")

      setPenalties((prev) => [
        ...prev,
        {
          id: `penalty-${Date.now()}`,
          x: playerMissile.position,
          y: 150,
          text: "-50",
        },
      ])

      setTimeout(() => {
        setPenalties((prev) => prev.slice(1))
      }, 1000)

      setGameState((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - 50),
        health: prev.health - config.damagePerMiss,
      }))
    },
    [audioSystem],
  )

  const createMissileRow = useCallback(() => {
    console.log("Creating missile row - Game Over:", gameState.isGameOver, "Level:", gameState.level)

    if (gameState.isGameOver) return

    const newMissiles: Missile[] = []
    const usedQuestions = new Set<string>()

    for (let i = 0; i < config.missileColumns; i++) {
      let operation
      let attempts = 0
      do {
        operation = generateOperation(gameState.level)
        attempts++
        if (attempts > 10) break
      } while (usedQuestions.has(operation.question) || gameState.currentQuestions.has(operation.question))

      const missile: Missile = {
        id: `missile-${gameState.missileId + i}-${Date.now()}`,
        position: config.tankPositions[i] - MISSILE_WIDTH / 2, // Centro del misil alineado con centro del tanque
        top: MISSILE_VERTICAL_OFFSET,
        question: operation.question,
        answer: operation.answer,
      }

      newMissiles.push(missile)
      usedQuestions.add(operation.question)
    }

    const randomMissile = newMissiles[Math.floor(Math.random() * newMissiles.length)]

    console.log("Created missiles:", newMissiles.length, "Target answer:", randomMissile.answer)

    setGameState((prev) => ({
      ...prev,
      targetAnswer: randomMissile.answer,
      missileId: prev.missileId + config.missileColumns,
      currentQuestions: new Set([...Array.from(prev.currentQuestions), ...Array.from(usedQuestions)]),
    }))

    setMissiles(newMissiles)
  }, [gameState.level, gameState.missileId, gameState.currentQuestions, gameState.isGameOver])

  const shootMissile = useCallback(() => {
    if (!gameState.canShoot || gameState.isGameOver || gameState.targetAnswer === null) {
      return
    }

    const currentTime = Date.now()
    if (currentTime - gameState.lastShootTime < config.shootCooldown) {
      return
    }

    audioSystem.play("shoot")

    const newPlayerMissile: PlayerMissile = {
      id: `player-${Date.now()}`,
      position: config.tankPositions[gameState.currentTankPosition], // Centro exacto del tanque
      bottom: 70,
      answer: gameState.targetAnswer,
    }

    setPlayerMissiles((prev) => [...prev, newPlayerMissile])

    setGameState((prev) => ({
      ...prev,
      lastShootTime: currentTime,
      canShoot: false,
    }))

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, canShoot: true }))
    }, config.shootCooldown)
  }, [
    gameState.canShoot,
    gameState.isGameOver,
    gameState.targetAnswer,
    gameState.currentTankPosition,
    gameState.lastShootTime,
    audioSystem,
  ])

  const checkCollisionDOM = useCallback((element1: HTMLDivElement, element2: HTMLDivElement): boolean => {
    const rect1 = element1.getBoundingClientRect()
    const rect2 = element2.getBoundingClientRect()

    return (
      rect1.top <= rect2.bottom && rect1.bottom >= rect2.top && rect1.left <= rect2.right && rect1.right >= rect2.left
    )
  }, [])

  const checkCollisions = useCallback(() => {
    playerMissileRefs.current.forEach((playerElement, playerId) => {
      if (!playerElement) return

      missileRefs.current.forEach((missileElement, missileId) => {
        if (!missileElement) return

        const playerMissile = playerMissiles.find((pm) => pm.id === playerId)
        const missile = missiles.find((m) => m.id === missileId)

        if (!playerMissile || !missile) return

        const playerRect = playerElement.getBoundingClientRect()
        const missileRect = missileElement.getBoundingClientRect()

        // Calcular centros exactos
        const playerCenterX = playerRect.left + playerRect.width / 2
        const playerCenterY = playerRect.top + playerRect.height / 2
        const missileCenterX = missileRect.left + missileRect.width / 2
        const missileCenterY = missileRect.top + missileRect.height / 2

        // Calcular distancia entre centros
        const distance = Math.sqrt(
          Math.pow(playerCenterX - missileCenterX, 2) + Math.pow(playerCenterY - missileCenterY, 2),
        )

        // Radio de colisión: mitad del ancho del enemigo (24px para un enemigo de 48px)
        const collisionRadius = MISSILE_WIDTH / 2

        // Detectar colisión cuando el láser toque el área central del círculo
        if (distance <= collisionRadius) {
          const explosionId = `explosion-${Date.now()}-${Math.random()}`
          setExplosions((prev) => [
            ...prev,
            {
              id: explosionId,
              // Usar la posición exacta del enemigo (en píxeles) como en el original
              x: missile.position, // Posición left del enemigo
              y: missile.top, // Posición top del enemigo
            },
          ])

          setTimeout(() => {
            setExplosions((prev) => prev.filter((exp) => exp.id !== explosionId))
          }, 500) // Duración de 500ms como en el original

          setPlayerMissiles((prev) => prev.filter((pm) => pm.id !== playerMissile.id))
          setMissiles((prev) => prev.filter((m) => m.id !== missile.id))

          // Limpiar refs
          playerMissileRefs.current.delete(playerId)
          missileRefs.current.delete(missileId)

          // Procesar resultado de la colisión
          if (playerMissile.answer === missile.answer) {
            handleCorrectShot(missile)
          } else {
            handleIncorrectShot(playerMissile)
          }
        }
      })
    })
  }, [playerMissiles, missiles, handleCorrectShot, handleIncorrectShot])

  const checkLevelUp = useCallback(() => {
    const requiredScore = gameState.level * config.pointsPerLevel
    if (gameState.score >= requiredScore) {
      const newLevel = gameState.level + 1

      setGameState((prev) => ({
        ...prev,
        level: newLevel,
        baseLevelSpeed:
          newLevel < config.hardcoreLevel
            ? config.baseSpeed * Math.pow(config.levelSpeedMultiplier, newLevel - 1)
            : prev.baseLevelSpeed,
        missileSpeed:
          newLevel < config.hardcoreLevel
            ? config.baseSpeed * Math.pow(config.levelSpeedMultiplier, newLevel - 1)
            : prev.missileSpeed,
      }))

      const message =
        newLevel >= config.hardcoreLevel ? `¡NIVEL ${newLevel}! ¡VELOCIDAD CRÍTICA!` : `¡Nivel ${newLevel}!`

      setLevelUpMessage(message)
      setTimeout(() => setLevelUpMessage(null), 1500)
    }
  }, [gameState.score, gameState.level])

  const endGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isGameOver: true }))
    audioSystem.stopBackground()

    if (gameState.username && gameState.username.trim() !== "") {
      ScoreManager.saveScore(gameState.username, gameState.score)
    }

    setTimeout(() => {
      onGameEnd(gameState.score, gameState.level)
    }, 2000)
  }, [gameState.username, gameState.score, gameState.level, audioSystem, onGameEnd])

  useEffect(() => {
    if (gameState.health <= 0 && !gameState.isGameOver) {
      endGame()
    }
  }, [gameState.health, gameState.isGameOver, endGame])

  useEffect(() => {
    checkLevelUp()
  }, [gameState.score, checkLevelUp])

  useEffect(() => {
    if (gameState.isGameOver) return

    const interval = setInterval(() => {
      setMissiles((prev) =>
        prev
          .map((missile) => {
            const levelMultiplier = 1 + (gameState.level - 1) * 0.15
            const speed =
              gameState.level >= config.hardcoreLevel
                ? ENEMY_MISSILE_SPEED * levelMultiplier * 1.5
                : ENEMY_MISSILE_SPEED * levelMultiplier

            return {
              ...missile,
              top: missile.top + speed,
            }
          })
          .filter((missile) => {
            if (missile.top > GAME_AREA_HEIGHT - 100) {
              setGameState((prev) => ({
                ...prev,
                health: prev.health - config.damagePerMiss,
                currentQuestions: new Set([...Array.from(prev.currentQuestions)].filter((q) => q !== missile.question)),
              }))
              return false
            }
            return true
          }),
      )

      setPlayerMissiles((prev) =>
        prev
          .map((missile) => ({
            ...missile,
            bottom: missile.bottom + PLAYER_MISSILE_SPEED,
          }))
          .filter((missile) => missile.bottom < GAME_AREA_HEIGHT),
      )
    }, MISSILE_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [gameState.isGameOver, gameState.level])

  useEffect(() => {
    checkCollisions()
  }, [checkCollisions])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault()
          if (gameState.currentTankPosition > 0) {
            setGameState((prev) => ({
              ...prev,
              currentTankPosition: prev.currentTankPosition - 1,
            }))
          }
          break
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault()
          if (gameState.currentTankPosition < config.tankPositions.length - 1) {
            setGameState((prev) => ({
              ...prev,
              currentTankPosition: prev.currentTankPosition + 1,
            }))
          }
          break
        case "ArrowUp":
        case " ":
        case "w":
        case "W":
          e.preventDefault()
          shootMissile()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState.currentTankPosition, gameState.isGameOver, shootMissile])

  useEffect(() => {
    if (!isInitialized) {
      audioSystem.playBackground()

      const timer = setTimeout(() => {
        createMissileRow()
        setIsInitialized(true)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isInitialized, audioSystem, createMissileRow])

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div
        ref={gameContainerRef}
        className={clsx(
          "game-container-optimized relative",
          gameState.level >= config.hardcoreLevel && "hardcore-mode",
        )}
        style={{
          width: `${GAME_AREA_WIDTH}px`,
          height: `${GAME_AREA_HEIGHT}px`,
          maxWidth: `${GAME_AREA_WIDTH}px`,
          maxHeight: `${GAME_AREA_HEIGHT}px`,
        }}
      >
        <GameHeader
          score={gameState.score}
          highScore={gameState.highScore}
          level={gameState.level}
          health={gameState.health}
          experienceProgress={((gameState.score % config.pointsPerLevel) / config.pointsPerLevel) * 100}
          isMuted={gameState.isMuted}
          onToggleMute={() => {
            const muted = audioSystem.toggleMute()
            setGameState((prev) => ({ ...prev, isMuted: muted }))
          }}
          onExit={onExit}
        />

        <div className="absolute inset-0 top-20">
          <AnimatePresence>
            {missiles.map((missile) => (
              <motion.div
                key={missile.id}
                ref={(el) => {
                  if (el) {
                    missileRefs.current.set(missile.id, el)
                  } else {
                    missileRefs.current.delete(missile.id)
                  }
                }}
                className="missile-optimized"
                style={{
                  left: `${missile.position}px`, // Posición exacta sin ajustes adicionales
                  top: `${missile.top}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {missile.question}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {playerMissiles.map((missile) => (
              <motion.div
                key={missile.id}
                ref={(el) => {
                  if (el) {
                    playerMissileRefs.current.set(missile.id, el)
                  } else {
                    playerMissileRefs.current.delete(missile.id)
                  }
                }}
                className="player-missile-optimized"
                style={{
                  left: `${missile.position - 2}px`, // Centrado (láser de 4px de ancho)
                  bottom: `${missile.bottom}px`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {explosions.map((explosion) => (
              <motion.div
                key={explosion.id}
                className="explosion-optimized"
                style={{
                  left: `${explosion.x}px`, // Centrar explosión (64px de ancho / 2 = 32px)
                  top: `${explosion.y}px`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {penalties.map((penalty) => (
              <motion.div
                key={penalty.id}
                className="penalty-optimized"
                style={{
                  left: `${penalty.x}px`,
                  bottom: `${penalty.y}px`,
                }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -50, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {penalty.text}
              </motion.div>
            ))}
          </AnimatePresence>

          <div
            className={clsx("tank-optimized", gameState.level >= config.hardcoreLevel && "hardcore-tank")}
            style={{
              left: `${config.tankPositions[gameState.currentTankPosition] - TANK_WIDTH / 2}px`, // Centro exacto
              transition: "none",
            }}
          >
            {gameState.targetAnswer || "?"}
          </div>
        </div>

        <AnimatePresence>
          {levelUpMessage && (
            <motion.div
              className="level-up-message-optimized"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {levelUpMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-game-blue/50 rounded-xl">
            <div className="text-white text-lg">🎯 ¡Preparando batalla!</div>
          </div>
        )}
      </div>
    </div>
  )
}
