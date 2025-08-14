export interface GameState {
  currentTankPosition: number;
  targetAnswer: number | null;
  score: number;
  highScore: number;
  missileSpeed: number;
  baseLevelSpeed: number;
  username: string;
  health: number;
  level: number;
  isGameOver: boolean;
  currentQuestions: Set<string>;
  missileIntervals: NodeJS.Timeout[];
  missileId: number;
  missileTimeout: NodeJS.Timeout | null;
  canShoot: boolean;
  lastShootTime: number;
  isMuted: boolean;
}

export interface GameConfig {
  tankPositions: number[];
  baseSpeed: number;
  levelSpeedMultiplier: number;
  pointsPerLevel: number;
  healthMax: number;
  damagePerMiss: number;
  missileColumns: number;
  speedIncreasePerHit: number;
  minSpeed: number;
  hardcoreLevel: number;
  hardcoreSpeedIncrement: number;
  shootCooldown: number;
}

export interface Operation {
  question: string;
  answer: number;
}

export interface Score {
  username: string;
  score: number;
  timestamp?: number;
}

export interface Missile {
  id: string;
  position: number;
  top: number;
  question: string;
  answer: number;
}

export interface PlayerMissile {
  id: string;
  position: number;
  bottom: number;
  answer: number;
}