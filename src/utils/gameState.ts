import { useState, useEffect, useCallback } from 'react';
import { GameState, Pet, PetStats } from '../types/gameTypes';
import { createDefaultGameState } from './gameConfig';
import { saveGameState, loadGameState } from './localStorage';
import { 
  feedPet, 
  petPet, 
  playWithPet, 
  calculateStatDecay, 
  generatePetDialogue,
  calculateWordGameReward,
  canAdoptPet,
  adoptPet
} from './gameLogic';
import { gameConfig } from './gameConfig';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const loadGame = () => {
      const savedGame = loadGameState();
      if (savedGame) {
        
        const updatedStats = calculateStatDecay(savedGame.pet);
        const updatedPet = {
          ...savedGame.pet,
          stats: updatedStats
        };
        const updatedGameState = {
          ...savedGame,
          pet: updatedPet
        };
        setGameState(updatedGameState);
        saveGameState(updatedGameState);
      }
      setIsLoading(false);
    };

    loadGame();
  }, []);

  
  useEffect(() => {
    if (gameState && !isLoading) {
      saveGameState(gameState);
    }
  }, [gameState, isLoading]);

  const createNewGame = useCallback((petName: string) => {
    const newGameState = createDefaultGameState(petName);
    setGameState(newGameState);
    saveGameState(newGameState);
  }, []);

  const updatePetStats = useCallback((newStats: PetStats, actionType: 'feed' | 'pet' | 'play') => {
    if (!gameState) return;

    const now = Date.now();

    let updatedPet: Pet = {
      ...gameState.pet,
      stats: newStats,
      lastFed: actionType === 'feed' ? now : gameState.pet.lastFed,
      lastPetted: actionType === 'pet' ? now : gameState.pet.lastPetted,
      lastPlayed: actionType === 'play' ? now : gameState.pet.lastPlayed,
    };

    
    if (!updatedPet.isAdopted && canAdoptPet(newStats)) {
      updatedPet = adoptPet(updatedPet);
    }

    setGameState(prev => prev ? { ...prev, pet: updatedPet } : null);
  }, [gameState]);

  const feedPetAction = useCallback(() => {
    if (!gameState) return false;
    
    const cost = gameConfig.actionCosts.feed;
    if (!spendCurrency(cost)) {
      
      return false;
    }
    
    const newStats = feedPet(gameState.pet.stats);
    updatePetStats(newStats, 'feed');
    return true;
  }, [gameState, updatePetStats]);

  const petPetAction = useCallback(() => {
    if (!gameState) return false;
    
    const cost = gameConfig.actionCosts.pet;
    if (!spendCurrency(cost)) {
      
      return false;
    }
    
    const newStats = petPet(gameState.pet.stats);
    updatePetStats(newStats, 'pet');
    return true;
  }, [gameState, updatePetStats]);

  const playWithPetAction = useCallback(() => {
    if (!gameState) return;
    const newStats = playWithPet(gameState.pet.stats);
    updatePetStats(newStats, 'play');
  }, [gameState, updatePetStats]);

  const addCurrency = useCallback((amount: number) => {
    if (!gameState) return;
    setGameState(prev => prev ? { 
      ...prev, 
      currency: Math.max(0, prev.currency + amount) 
    } : null);
  }, [gameState]);

  const spendCurrency = useCallback((amount: number): boolean => {
    if (!gameState || gameState.currency < amount) return false;
    setGameState(prev => prev ? { 
      ...prev, 
      currency: prev.currency - amount 
    } : null);
    return true;
  }, [gameState]);

  const completeWordGame = useCallback((wpm: number, accuracy: number) => {
    if (!gameState) return;
    
    const wordGameResult = { wpm, accuracy };
    const currencyReward = calculateWordGameReward(wordGameResult);
    
    
    addCurrency(currencyReward);
    
    
    const newStats = playWithPet(gameState.pet.stats);
    updatePetStats(newStats, 'play');
  }, [gameState, addCurrency, updatePetStats]);

  const getPetDialogue = useCallback(() => {
    if (!gameState) return '';
    if (gameState.pet.isAdopted) {
      return `${gameState.pet.name} is your beloved adopted pet!`;
    }
    return generatePetDialogue(gameState.pet.stats, gameState.pet.name);
  }, [gameState]);

  const isPetAdopted = useCallback(() => {
    return gameState?.pet.isAdopted || false;
  }, [gameState]);

  const canPetBeAdopted = useCallback(() => {
    return gameState ? canAdoptPet(gameState.pet.stats) : false;
  }, [gameState]);

  return {
    gameState,
    isLoading,
    createNewGame,
    feedPetAction,
    petPetAction,
    playWithPetAction,
    completeWordGame,
    addCurrency,
    spendCurrency,
    getPetDialogue,
    isPetAdopted,
    canPetBeAdopted,
  };
};