import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#00ffff] font-sans selection:bg-[#ff00ff] selection:text-[#000000] overflow-hidden relative tear-effect">
      <div className="scanlines" />
      <div className="static-noise" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 h-screen flex flex-col">
        {/* Header */}
        <header className="border-b-4 border-[#ff00ff] pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-mono text-[#ff00ff] glitch-text" data-text="SYS.SNAKE_PROTOCOL">
              SYS.SNAKE_PROTOCOL
            </h1>
            <p className="text-2xl tracking-widest mt-2">
              STATUS: <span className="text-[#00ffff] animate-pulse">ONLINE</span> // DIRECTIVE: CONSUME_BIOMASS
            </p>
          </div>
          <div className="text-left md:text-right font-mono text-xl md:text-2xl flex flex-col gap-2">
            <div className="text-[#ff00ff] bg-[#ff00ff]/10 p-2 border border-[#ff00ff]">
              MAX_YIELD: {highScore.toString().padStart(4, '0')}
            </div>
            <div className="text-[#00ffff] bg-[#00ffff]/10 p-2 border border-[#00ffff]">
              CUR_YIELD: {score.toString().padStart(4, '0')}
            </div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Game Section */}
          <section className="flex flex-col items-center justify-center border-4 border-[#00ffff] p-6 bg-[#050505] relative shadow-[0_0_30px_rgba(0,255,255,0.2)]">
            <div className="absolute top-0 left-0 bg-[#00ffff] text-[#000000] px-3 py-1 font-bold text-xl">SECTOR_ALPHA</div>
            <div className="absolute top-0 right-0 border-b-4 border-l-4 border-[#00ffff] w-8 h-8" />
            <div className="absolute bottom-0 left-0 border-t-4 border-r-4 border-[#00ffff] w-8 h-8" />
            <div className="absolute bottom-0 right-0 border-t-4 border-l-4 border-[#00ffff] w-8 h-8" />
            
            <div className="mt-8">
              <SnakeGame onScoreChange={handleScoreChange} />
            </div>
          </section>

          {/* Music Section */}
          <aside className="border-4 border-[#ff00ff] p-6 bg-[#050505] relative flex flex-col gap-6 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
            <div className="absolute top-0 right-0 bg-[#ff00ff] text-[#000000] px-3 py-1 font-bold text-xl">AUDIO_DECODER</div>
            <div className="absolute top-0 left-0 border-b-4 border-r-4 border-[#ff00ff] w-8 h-8" />
            <div className="absolute bottom-0 left-0 border-t-4 border-r-4 border-[#ff00ff] w-8 h-8" />
            <div className="absolute bottom-0 right-0 border-t-4 border-l-4 border-[#ff00ff] w-8 h-8" />
            
            <div className="mt-8">
              <MusicPlayer />
            </div>
          </aside>
        </main>

        <footer className="mt-8 border-t-4 border-[#00ffff] pt-4 flex justify-between text-2xl">
          <span>TERMINAL_ID: 9X-BETA</span>
          <span className="animate-pulse text-[#ff00ff]">AWAITING_INPUT...</span>
        </footer>
      </div>
    </div>
  );
}
