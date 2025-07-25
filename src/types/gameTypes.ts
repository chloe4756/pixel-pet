export interface PetStats {
  happiness: number;
  affection: number;
  hunger: number;
}

export interface Pet {
  name: string;
  stats: PetStats;
  lastFed: number;
  lastPetted: number;
  lastPlayed: number;
  isAdopted: boolean;
  adoptedAt?: number;
}

export interface GameState {
  pet: Pet;
  currency: number;
  inventory: InventoryItem[];
  achievements: Achievement[];
  gameStarted: number;
  lastSave: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'cosmetic' | 'cleaning';
  quantity: number;
  effect?: StatEffect;
}

export interface StatEffect {
  happiness?: number;
  affection?: number;
  hunger?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  completedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface WordGameResult {
  wpm?: number;
  score?: number;
  accuracy: number;
  timeElapsed?: number;
  wordsCompleted?: number;
  currencyEarned?: number;
}

export interface GameConfig {
  maxStatValue: number;
  statDecayRate: number;
  baseRewards: {
    feed: number;
    pet: number;
    play: number;
  };
  actionCosts: {
    feed: number;
    pet: number;
    play: number;
  };
  currencyRewards: {
    high: number;
    medium: number;
    low: number;
  };
  itemCosts: Record<string, number>;
}