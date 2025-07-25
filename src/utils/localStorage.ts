import { GameState } from '../types/gameTypes';

const GAME_SAVE_KEY = 'pixelPetGameSave';

export const saveGameState = (gameState: GameState): boolean => {
  try {
    const saveData = {
      ...gameState,
      lastSave: Date.now(),
    };
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saveData = localStorage.getItem(GAME_SAVE_KEY);
    if (!saveData) {
      return null;
    }
    return JSON.parse(saveData) as GameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): boolean => {
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear game state:', error);
    return false;
  }
};

export const exportGameState = (): string | null => {
  try {
    const gameState = loadGameState();
    if (!gameState) return null;
    return JSON.stringify(gameState, null, 2);
  } catch (error) {
    console.error('Failed to export game state:', error);
    return null;
  }
};

export const importGameState = (saveData: string): boolean => {
  try {
    const gameState = JSON.parse(saveData) as GameState;
    return saveGameState(gameState);
  } catch (error) {
    console.error('Failed to import game state:', error);
    return false;
  }
};