import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import wordList from '../../data/words.json';

interface TypingGameProps {
  onComplete: (wpm: number, accuracy: number) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

const GAME_DURATION = 30;

export default function TypingGame({ onComplete, onClose, isDarkMode = false }: TypingGameProps) {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [margin, setMargin] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const letterElementsRef = useRef<HTMLDivElement>(null);

  const generateWords = (): string[] => {
    const words: string[] = [];
    for (let i = 0; i < 200; i++) {
      words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words;
  };
  const addMoreWords = () => {
    const newWords: string[] = [];
    for (let i = 0; i < 100; i++) {
      newWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    setCurrentWords(prev => [...prev, ...newWords]);
  };

  
  useEffect(() => {
    setCurrentWords(generateWords());
  }, []);

  
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      finishGame();
    }
  }, [gameState, timeLeft]);

  
  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setUserInput('');
    setCorrectChars(0);
    setTotalChars(0);
    setWordsCompleted(0);
    setTypedText('');
    setMargin(0);
    setStartTime(Date.now());
    setEndTime(null);
    inputRef.current?.focus();
  };

  const finishGame = () => {
    setEndTime(Date.now());
    setGameState('finished');
    
  };

  const calculateCoinsEarned = (wpm: number) => {
    
    return wpm >= 70 ? 30 : 20; 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;

    const value = e.target.value;
    
    
    if (value.endsWith(' ')) {
      const newTypedText = typedText + value;
      setTypedText(newTypedText);
      
      
      const wordsTyped = newTypedText.trim().split(' ');
      const lastWordTyped = wordsTyped[wordsTyped.length - 1];
      const expectedWord = currentWords[wordsTyped.length - 1];
      
      if (expectedWord) {
        
        
        let correctInWord = 0;
        for (let i = 0; i < Math.min(lastWordTyped.length, expectedWord.length); i++) {
          if (lastWordTyped[i] === expectedWord[i]) {
            correctInWord++;
          }
        }
        
        setCorrectChars(prev => prev + correctInWord);
        setTotalChars(prev => prev + lastWordTyped.length);
        
        
        setWordsCompleted(prev => prev + 1);
        
        
        
        
        if (wordsTyped.length > currentWords.length - 50) {
          addMoreWords();
        }
      }
      
      setUserInput('');
    } else {
      
      setUserInput(value);
    }
  };

  
  React.useEffect(() => {
    const currentTypedText = typedText + userInput;
    const currIndex = currentTypedText.length;
    
    if (letterElementsRef.current && letterElementsRef.current.children.length > currIndex) {
      const spanRef = letterElementsRef.current.children[currIndex] as HTMLElement;
      
      if (spanRef) {
        const top = spanRef.offsetTop;
        
        
        if (top > 60) {
          setMargin((margin) => margin + 1);
        }
      }
    }
  }, [typedText, userInput]);

  const renderWordFlow = () => {
    const wordsToShow = Math.min(currentWords.length, 150);
    const displayWords = currentWords.slice(0, wordsToShow);
    const fullText = displayWords.join(' ');
    const currentTypedText = typedText + userInput;
    
    return (
      <div 
        ref={textContainerRef}
        className="text-xl font-mono leading-relaxed p-4 relative h-36 overflow-hidden"
      >
        {/* Base text with margin-based scrolling */}
        <div 
          ref={letterElementsRef}
          className="text-gray-400 break-words"
          style={{
            marginTop: margin > 0 ? -(margin * 39) : 0, 
            transition: 'margin-top 0.1s ease-out'
          }}
        >
          {fullText.split('').map((char, index) => {
            let className = 'text-gray-400';
            
            if (index < currentTypedText.length) {
              
              if (currentTypedText[index] === char) {
                className = 'text-green-600 bg-green-100';
              } else {
                className = 'text-red-600 bg-red-100';
              }
            } else if (index === currentTypedText.length) {
              
              className = 'text-gray-400 border-l-2 border-blue-600 animate-pulse';
            }
            
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  if (gameState === 'waiting') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-rose-600'} text-center mb-4`}>Typing Speed Challenge</h2>
          <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'} text-center mb-6`}>
            Type as many words as you can in 30 seconds! 
            <br />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-rose-500'}`}>
              70+ WPM = 30 coins
              <br />
              &lt;70 WPM = 20 coins
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} className="bg-rose-500 hover:bg-rose-600 text-white">
              Start Game
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    
    const duration = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : GAME_DURATION;
    const totalTypedChars = (typedText + userInput).length; 
    const wpm = Math.round(((60 / duration) * totalTypedChars) / 5);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    const coinsEarned = calculateCoinsEarned(wpm);
    const isHighReward = wpm >= 70;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-8 max-w-lg w-full mx-4 shadow-lg`}>
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-rose-600'} mb-2`}>Typing Challenge Complete!</h2>
            <div className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Great job on your typing session!</div>
          </div>

          {/* Coins Earned Highlight */}
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-600 to-gray-500 border-gray-400' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300'} rounded-lg p-4 mb-6 text-center border-2`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src="/coin.png" alt="coin" className="w-8 h-8" style={{ imageRendering: "pixelated" }} />
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-yellow-700'}`}>+{coinsEarned} Coins Earned!</span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-yellow-600'}`}>
              {isHighReward ? 'Excellent typing speed! High reward achieved!' : 'Keep practicing to earn 50 coins (80+ WPM)'}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-rose-600'}`}>{wpm}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Words Per Minute</div>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-blue-600'}`}>{accuracy}%</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-green-600'}`}>{wordsCompleted}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Words Completed</div>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-purple-600'}`}>{Math.round(correctChars)}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct Characters</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="text-center mb-6">
            {wpm >= 80 && accuracy >= 90 && (
              <div className="text-green-600 font-semibold">Outstanding performance! You're a typing master!</div>
            )}
            {wpm >= 60 && wpm < 80 && (
              <div className="text-blue-600 font-semibold">Great typing! You're getting faster!</div>
            )}
            {wpm >= 40 && wpm < 60 && (
              <div className="text-orange-600 font-semibold">Good progress! Keep practicing to improve!</div>
            )}
            {wpm < 40 && (
              <div className="text-red-600 font-semibold">Keep practicing! Your typing will improve with time!</div>
            )}
          </div>

          <Button 
            onClick={() => {
              onComplete(wpm, accuracy);
              onClose();
            }} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white text-lg py-3"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className={`${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-pink-50 border-pink-400'} border-4 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-lg`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-rose-600'}`}>Typing Challenge</h2>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-rose-600'}`}>{timeLeft}s</div>
        </div>
        
        <div className="mb-4">
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Type the words:</div>
          <div className={`${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-300'} rounded border-2 min-h-36`}>
            {renderWordFlow()}
          </div>
        </div>

        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full text-xl p-3 border-2 border-rose-300 rounded focus:border-rose-500 focus:outline-none opacity-0 absolute -z-10"
            placeholder="Start typing..."
            autoComplete="off"
            spellCheck="false"
          />
          <div className="text-sm text-gray-500 text-center">
            Start typing immediately! Focus on the text above.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-rose-600">{wordsCompleted}</div>
            <div className="text-gray-500">Words</div>
          </div>
          <div>
            <div className="font-bold text-rose-600">
              {(() => {
                if (!startTime) return 0;
                const elapsed = (Date.now() - startTime) / 1000; 
                const totalTyped = (typedText + userInput).length; 
                return elapsed > 0 ? Math.round(((60 / elapsed) * totalTyped) / 5) : 0;
              })()}
            </div>
            <div className="text-gray-500">WPM</div>
          </div>
          <div>
            <div className="font-bold text-rose-600">
              {(() => {
                const currentTypedText = typedText + userInput;
                if (currentTypedText.length === 0) return 100;
                
                const expectedText = currentWords.slice(0, Math.ceil(currentTypedText.length / 5)).join(' ');
                let correct = 0;
                
                for (let i = 0; i < Math.min(currentTypedText.length, expectedText.length); i++) {
                  if (currentTypedText[i] === expectedText[i]) {
                    correct++;
                  }
                }
                
                return Math.round((correct / currentTypedText.length) * 100);
              })()}%
            </div>
            <div className="text-gray-500">Accuracy</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={onClose} variant="outline" className="text-sm">
            Exit Game
          </Button>
        </div>
      </div>
    </div>
  );
}