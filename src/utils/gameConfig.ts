import { GameConfig } from '../types/gameTypes';

export const gameConfig: GameConfig = {
  maxStatValue: 100,
  statDecayRate: 1,
  baseRewards: {
    feed: 20,
    pet: 15,
    play: 50,
  },
  actionCosts: {
    feed: 5,
    pet: 3,
    play: 0,
  },
  currencyRewards: {
    high: 30,
    medium: 25,
    low: 20,
  },
  itemCosts: {
    'premium_food': 30,
    'toy_ball': 20,
    'cleaning_kit': 25,
    'special_treat': 40,
  },
};

export const defaultPetStats = {
  happiness: 0,
  affection: 0,
  hunger: 0,
};

export const createDefaultPet = (name: string) => ({
  name,
  stats: { ...defaultPetStats },
  lastFed: Date.now(),
  lastPetted: Date.now(),
  lastPlayed: Date.now(),
  isAdopted: false,
  adoptedAt: undefined,
});

export const createDefaultGameState = (petName: string) => ({
  pet: createDefaultPet(petName),
  currency: 10,
  inventory: [],
  achievements: [],
  gameStarted: Date.now(),
  lastSave: Date.now(),
});