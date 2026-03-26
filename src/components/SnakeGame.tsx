import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 100;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative bg-[#000000] border-4 border-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
          backgroundColor: 'rgba(0, 255, 255, 0.05)'
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute w-5 h-5 ${i === 0 ? 'bg-[#ff00ff] z-10' : 'bg-[#00ffff]'}`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              boxShadow: i === 0 ? '0 0 10px #ff00ff' : 'none'
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="absolute w-5 h-5 bg-[#ff00ff] animate-pulse"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            boxShadow: '0 0 15px #ff00ff'
          }}
        />

        {/* Overlays */}
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-[#000000]/80 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff] m-2">
            {isGameOver ? (
              <div className="text-center p-4">
                <h2 className="text-[#ff00ff] text-3xl font-mono mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-[#00ffff] text-xl mb-6">ENTITY_COLLISION</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-[#ff00ff] hover:bg-[#00ffff] text-[#000000] font-mono text-xl transition-colors uppercase"
                >
                  [ REBOOT_SYSTEM ]
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <h2 className="text-[#00ffff] text-3xl font-mono mb-6 glitch-text" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-3 bg-[#00ffff] hover:bg-[#ff00ff] text-[#000000] font-mono text-xl transition-colors uppercase"
                >
                  [ INITIALIZE ]
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-8 text-[#00ffff] text-xl bg-[#00ffff]/10 p-3 border border-[#00ffff]">
        <div>INPUT: ARROWS</div>
        <div>HALT: SPACE</div>
      </div>
    </div>
  );
};
