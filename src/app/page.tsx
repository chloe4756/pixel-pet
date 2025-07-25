'use client'

import { useState, useEffect, useRef } from "react";
import PixelContainer from "../components/PixelContainer";
import { useGameState } from "../utils/gameState";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import TypingGame from "../components/games/TypingGame";

export default function Home() {
  const {
    gameState,
    isLoading,
    createNewGame,
    feedPetAction,
    petPetAction,
    playWithPetAction,
    completeWordGame,
    getPetDialogue,
    isPetAdopted,
    canPetBeAdopted,
  } = useGameState();

  const [showNameInput, setShowNameInput] = useState(false);
  const [petName, setPetName] = useState("");
  const [showTypingGame, setShowTypingGame] = useState(false);
  const [showFeedingAnimation, setShowFeedingAnimation] = useState(false);
  const [currentFoodType, setCurrentFoodType] = useState<'fishy' | 'milk'>('fishy');
  const [showPettingAnimation, setShowPettingAnimation] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showInsufficientFundsPopup, setShowInsufficientFundsPopup] = useState(false);
  const [showAdoptionCelebration, setShowAdoptionCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialShown, setTutorialShown] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState && isPetAdopted() && !showAdoptionCelebration) {
      setShowAdoptionCelebration(true);
    }
  }, [gameState, isPetAdopted, showAdoptionCelebration]);

  useEffect(() => {
    if (gameState && gameState.pet && !tutorialShown) {
      const { happiness, affection, hunger } = gameState.pet.stats;
      const isNewPet = happiness === 0 && affection === 0 && hunger === 0;
      
      if (isNewPet) {
        setShowTutorial(true);
        setTutorialShown(true);
      }
    }
  }, [gameState, tutorialShown]);

  useEffect(() => {
    if (showNameInput && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameInput]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundImage: `url(/staticBackground.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated"
        }}
      >
        <div className="text-rose-600 bg-white/80 px-4 py-2 rounded">Loading your pet...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundImage: `url(/staticBackground.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated"
        }}
      >
        <PixelContainer showFeedingAnimation={false} foodType={currentFoodType} showPet={false} isDarkMode={isDarkMode} showPettingAnimation={false} showHeartAnimation={false}>
          <div className="bg-pink-50 p-6 text-center">
            <h1 className="text-rose-600 text-lg mb-4">Welcome to Pixel Pet!</h1>
            {!showNameInput ? (
              <Button
                onClick={() => setShowNameInput(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Start New Game
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-rose-600 text-sm mb-2">
                    What's your pet's name?
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && petName.trim()) {
                        createNewGame(petName.trim());
                      }
                    }}
                    className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter pet name"
                    maxLength={20}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (petName.trim()) {
                        createNewGame(petName.trim());
                      }
                    }}
                    disabled={!petName.trim()}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Create Pet
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNameInput(false);
                      setPetName("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PixelContainer>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-center p-4 relative"
      style={{ 
        backgroundImage: `url(${isDarkMode ? '/staticNight.png' : '/staticBackground.png'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated"
      }}
    >
      {/* Dark mode toggle - moon icon */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-20 left-20 z-50 hover:scale-110 transition-all"
        style={{ transformOrigin: 'top left' }}
      >
        <img 
          src={isDarkMode ? "/moon.png" : "/sun.png"}
          alt={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className={`${isDarkMode ? "w-32 h-32" : "w-40 h-40"} -translate-x-1/2 -translate-y-1/2`}
          style={{ imageRendering: "pixelated" }}
        />
      </button>
      <div className="flex flex-col items-center mt-16 lg:mt-0">
        {/* Mobile stats - above container in a row */}
        <div className="lg:hidden mb-12 w-full max-w-sm">
          <div className="flex gap-2 justify-center mb-2">
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs text-rose-600 mb-1">Happiness</div>
              <div className="text-xs font-bold text-rose-600 mb-1">{gameState.pet.stats.happiness}/100</div>
              <Progress 
                value={gameState.pet.stats.happiness} 
                className="h-1.5 bg-rose-200"
              />
            </div>

            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs text-rose-600 mb-1">Affection</div>
              <div className="text-xs font-bold text-rose-600 mb-1">{gameState.pet.stats.affection}/100</div>
              <Progress 
                value={gameState.pet.stats.affection} 
                className="h-1.5 bg-rose-200"
              />
            </div>

            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs text-rose-600 mb-1">Hunger</div>
              <div className="text-xs font-bold text-rose-600 mb-1">{gameState.pet.stats.hunger}/100</div>
              <Progress 
                value={gameState.pet.stats.hunger} 
                className="h-1.5 bg-rose-200"
              />
            </div>
          </div>

          <div className="text-center text-rose-600 text-sm font-bold flex items-center justify-center gap-1">
            <img src="/coin.png" alt="coin" className="w-4 h-4" style={{ imageRendering: "pixelated" }} />
            {gameState.currency} coins
          </div>
        </div>

        <div className="scale-75 lg:scale-100">
          <PixelContainer showFeedingAnimation={showFeedingAnimation} foodType={currentFoodType} isDarkMode={isDarkMode} showPettingAnimation={showPettingAnimation} showHeartAnimation={showHeartAnimation}>
            <div className="bg-pink-50 px-4 py-3 border-b-2 border-rose-300">
              <h1 className="text-rose-600 text-center font-bold">
                {gameState.pet.name}
              </h1>
            </div>

            <div className="h-96 relative overflow-hidden">
              <img
                src={isDarkMode ? '/nightBackground.gif' : '/Background.gif'}
                alt={isDarkMode ? "Pixel art night landscape" : "Pixel art landscape with rolling green hills, clouds, and yellow flowers"}
                className="w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="bg-pink-50 p-4">
              <div className="text-center text-rose-600 text-sm">
                {getPetDialogue()}
              </div>
            </div>
          </PixelContainer>
        </div>
      </div>

      {/* Desktop stats - side panel */}
      <div className="hidden lg:block fixed top-8 right-8 p-4 space-y-4 min-w-48 bg-white/20 backdrop-blur-sm rounded-xl">
        <h2 className="text-rose-600 font-bold text-center text-sm">{gameState.pet.name}'s Stats</h2>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-rose-600">
              <span>Happiness</span>
              <span className="ml-8">{gameState.pet.stats.happiness}/100</span>
            </div>
            <Progress 
              value={gameState.pet.stats.happiness} 
              className="h-2 bg-rose-200"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-rose-600">
              <span>Affection</span>
              <span className="ml-8">{gameState.pet.stats.affection}/100</span>
            </div>
            <Progress 
              value={gameState.pet.stats.affection} 
              className="h-2 bg-rose-200"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-rose-600">
              <span>Hunger</span>
              <span className="ml-8">{gameState.pet.stats.hunger}/100</span>
            </div>
            <Progress 
              value={gameState.pet.stats.hunger} 
              className="h-2 bg-rose-200"
            />
          </div>
        </div>

        <div className="text-center text-rose-600 text-sm font-bold border-t border-rose-300 pt-3 flex items-center justify-center gap-1">
          <img src="/coin.png" alt="coin" className="w-4 h-4" style={{ imageRendering: "pixelated" }} />
          {gameState.currency} coins
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-6 w-full max-w-md scale-100 lg:scale-125 justify-between">
          <button
            onClick={() => {
              const success = feedPetAction();
              if (success) {
                setShowFeedingAnimation(true);
                setCurrentFoodType(prev => prev === 'fishy' ? 'milk' : 'fishy');
                setTimeout(() => setShowFeedingAnimation(false), 3500);
              } else {
                setShowInsufficientFundsPopup(true);
              }
            }}
            className="bg-pink-50 hover:bg-pink-100 text-rose-600 flex-1 py-4 border-4 border-pink-400 rounded-lg shadow-lg font-bold text-base transition-all hover:scale-105 active:scale-95"
            style={{ imageRendering: "pixelated" }}
          >
            <div>Feed</div>
            <div className="flex items-center justify-center gap-1 text-xs mt-1 opacity-75">
              <img src="/coin.png" alt="coin" className="w-3 h-3" style={{ imageRendering: "pixelated" }} />
              5
            </div>
          </button>
          <button
            onClick={() => {
              const success = petPetAction();
              if (success) {
                setShowPettingAnimation(true);
                setShowHeartAnimation(true);
                setTimeout(() => setShowPettingAnimation(false), 3500);
                setTimeout(() => setShowHeartAnimation(false), 3500);
              } else {
                setShowInsufficientFundsPopup(true);
              }
            }}
            className="bg-pink-50 hover:bg-pink-100 text-rose-600 flex-1 py-4 border-4 border-pink-400 rounded-lg shadow-lg font-bold text-base transition-all hover:scale-105 active:scale-95"
            style={{ imageRendering: "pixelated" }}
          >
            <div>Pet</div>
            <div className="flex items-center justify-center gap-1 text-xs mt-1 opacity-75">
              <img src="/coin.png" alt="coin" className="w-3 h-3" style={{ imageRendering: "pixelated" }} />
              3
            </div>
          </button>
          <button
            onClick={() => setShowTypingGame(true)}
            className="w-52 bg-pink-50 hover:bg-pink-100 text-rose-600 flex-1 py-4 border-4 border-pink-400 rounded-lg shadow-lg font-bold text-base transition-all hover:scale-105 active:scale-95"
            style={{ imageRendering: "pixelated" }}
          >
            <div>Play</div>
            <div className="flex items-center justify-center gap-1 text-xs mt-1 opacity-75">
              Earn
            </div>
          </button>
        </div>
      </div>

      {showTypingGame && (
        <TypingGame
          onComplete={(wpm, accuracy) => {
            completeWordGame(wpm, accuracy);
            setShowTypingGame(false);
          }}
          onClose={() => setShowTypingGame(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {showInsufficientFundsPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-6 mx-4 max-w-sm text-center shadow-lg`}>
            <h3 className={`${isDarkMode ? 'text-gray-100' : 'text-rose-600'} font-bold text-lg mb-2`}>Not Enough Coins!</h3>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-rose-600'} text-sm mb-4`}>
              You need more coins to do that. Press the <strong>Play</strong> button to earn coins by playing the typing game!
            </p>
            <button
              onClick={() => setShowInsufficientFundsPopup(false)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50">
          <div className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-6 mx-4 max-w-lg text-center shadow-lg`}>
            <h3 className={`${isDarkMode ? 'text-gray-100' : 'text-rose-600'} font-bold text-xl mb-4`}>Welcome to Pixel Pet!</h3>
            <div className={`${isDarkMode ? 'text-gray-200' : 'text-rose-600'} text-sm mb-6 space-y-3 text-left`}>
              <p><strong>Goal:</strong> Care for your pet by raising all stats to 100 to adopt them!</p>
              <p><strong>Currency:</strong> Play the typing game to earn coins for pet care</p>
              <p><strong>Actions:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• <strong>Feed</strong> (5 coins) - Increases hunger</li>
                <li>• <strong>Pet</strong> (3 coins) - Increases affection</li>
                <li>• <strong>Play</strong> (free) - Opens typing game to earn coins</li>
              </ul>
              <div className={`mt-4 p-3 ${isDarkMode ? 'bg-gray-600' : 'bg-rose-100'} rounded-lg`}>
                <p><strong>Hidden Features:</strong></p>
                <p>• Hover over your pet to pet it!</p>
                <p>• Click the sun/moon in the corner for dark mode!</p>
              </div>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-bold text-lg w-full"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}


      {showAdoptionCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-8 mx-4 max-w-md text-center shadow-lg`}>
            <h3 className={`${isDarkMode ? 'text-gray-100' : 'text-rose-600'} font-bold text-xl mb-3`}>Congratulations!</h3>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-rose-600'} text-sm mb-4`}>
              <strong>{gameState?.pet.name}</strong> has been successfully adopted! 
              You've taken amazing care of your pet by getting all stats to 100! 
              <span className="block mt-2">{gameState?.pet.name} is now your beloved companion!</span>
            </p>
            <button
              onClick={() => {
                setShowAdoptionCelebration(false);
                localStorage.removeItem('pixelPetGameSave');
                window.location.reload();
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
            >
              Amazing!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}