import { PetStats, StatEffect, Pet, WordGameResult } from '../types/gameTypes';
import { gameConfig } from './gameConfig';

export const clampStat = (value: number): number => {
  return Math.max(0, Math.min(gameConfig.maxStatValue, Math.round(value)));
};

export const applyStatEffect = (currentStats: PetStats, effect: StatEffect): PetStats => {
  return {
    happiness: clampStat(currentStats.happiness + (effect.happiness || 0)),
    affection: clampStat(currentStats.affection + (effect.affection || 0)),
    hunger: clampStat(currentStats.hunger + (effect.hunger || 0)),
  };
};

export const feedPet = (currentStats: PetStats): PetStats => {
  return applyStatEffect(currentStats, { hunger: gameConfig.baseRewards.feed });
};

export const petPet = (currentStats: PetStats): PetStats => {
  return applyStatEffect(currentStats, { affection: gameConfig.baseRewards.pet });
};

export const playWithPet = (currentStats: PetStats): PetStats => {
  return applyStatEffect(currentStats, { happiness: gameConfig.baseRewards.play });
};

export const calculateStatDecay = (pet: Pet): PetStats => {
  return {
    hunger: pet.stats.hunger,
    affection: pet.stats.affection,
    happiness: pet.stats.happiness,
  };
};



export const calculateWordGameReward = (result: WordGameResult): number => {
  const { wpm, accuracy } = result;
  
  if (wpm && wpm >= 70) {
    return gameConfig.currencyRewards.high;
  } else {
    return gameConfig.currencyRewards.low;
  }
};

export const getOverallPetHappiness = (stats: PetStats): 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' => {
  const avgStats = (stats.happiness + stats.affection + stats.hunger) / 3;
  
  if (avgStats >= 80) return 'very_happy';
  if (avgStats >= 60) return 'happy';
  if (avgStats >= 40) return 'neutral';
  if (avgStats >= 20) return 'sad';
  return 'very_sad';
};

export const generatePetDialogue = (stats: PetStats, petName: string): string => {
  const happiness = getOverallPetHappiness(stats);
  
  const dialogues = {
    very_happy: [
      `:D`,
      `I love you`
    ],
    happy: [
      `${petName} is feeling good!`,
      `:)`,
      `meow!`,
    ],
    neutral: [
      `${petName} is okay.`,
      `${petName} seems calm`,
      `${petName} is alright.`,
    ],
    sad: [
      `${petName} looks a bit down...`,
      `${petName} wants attention.`
    ],
    very_sad: [
      `:(`,
      `${petName} feels neglected`,
      `${petName} is sad`,
    ],
  };
  
  const options = dialogues[happiness];
  return options[Math.floor(Math.random() * options.length)];
};

export const canAdoptPet = (stats: PetStats): boolean => {
  return stats.happiness === 100 && stats.affection === 100 && stats.hunger === 100;
};

export const adoptPet = (pet: Pet): Pet => {
  return {
    ...pet,
    isAdopted: true,
    adoptedAt: Date.now(),
  };
};