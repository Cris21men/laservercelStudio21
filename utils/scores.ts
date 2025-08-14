import { Score } from '../types/game';

export const ScoreManager = {
  loadScores(): Score[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const scores = localStorage.getItem('gameScores');
      return scores ? JSON.parse(scores) : [];
    } catch (error) {
      console.error('Error loading scores:', error);
      return [];
    }
  },

  saveScore(username: string, score: number): void {
    if (typeof window === 'undefined') return;
    if (!username || username.trim() === '') {
      console.warn('Username is empty, score will not be saved.');
      return;
    }

    try {
      const scores = this.loadScores();
      const newScore: Score = {
        username: username.trim(),
        score,
        timestamp: Date.now()
      };

      scores.push(newScore);
      
      // Ordenar puntuaciones de mayor a menor
      scores.sort((a, b) => b.score - a.score);
      
      // Mantener solo las 10 mejores puntuaciones
      if (scores.length > 10) {
        scores.length = 10;
      }

      localStorage.setItem('gameScores', JSON.stringify(scores));
      console.log('Score saved successfully:', newScore);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  },

  getHighScore(): number {
    const scores = this.loadScores();
    return scores.length > 0 ? scores[0].score : 0;
  },

  clearScores(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('gameScores');
  }
};