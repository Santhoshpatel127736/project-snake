import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01.WAV", artist: "SYNTH_CORE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "NEURAL_LINK_02.WAV", artist: "GHOST_IN_MACHINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_STATIC_03.WAV", artist: "NULL_POINTER", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  // Generate ASCII progress bar
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const asciiProgress = '[' + '#'.repeat(filledLength) + '-'.repeat(barLength - filledLength) + ']';

  return (
    <div className="w-full flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="border-2 border-[#ff00ff] p-4 bg-[#ff00ff]/10">
        <div className="text-[#ff00ff] font-mono text-xl mb-2 animate-pulse">
          &gt; EXECUTING_AUDIO_THREAD...
        </div>
        <div className="text-3xl text-[#00ffff] font-mono truncate mb-1">
          {currentTrack.title}
        </div>
        <div className="text-xl text-[#ff00ff]">
          SRC: {currentTrack.artist}
        </div>
      </div>

      <div className="text-2xl font-mono text-[#00ffff] tracking-widest text-center">
        {asciiProgress} {Math.floor(progress)}%
      </div>

      <div className="flex items-center justify-between border-2 border-[#00ffff] p-4 bg-[#00ffff]/5">
        <button 
          onClick={skipBackward}
          className="text-2xl text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff]/20 px-4 py-2 transition-colors"
        >
          [ &lt;&lt; ]
        </button>
        
        <button 
          onClick={togglePlay}
          className="text-3xl text-[#ff00ff] hover:text-[#00ffff] hover:bg-[#ff00ff]/20 px-6 py-2 border-2 border-[#ff00ff] hover:border-[#00ffff] transition-colors"
        >
          {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
        </button>
        
        <button 
          onClick={skipForward}
          className="text-2xl text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff]/20 px-4 py-2 transition-colors"
        >
          [ &gt;&gt; ]
        </button>
      </div>

      <div className="mt-4 flex items-end justify-between h-16 border-b-2 border-[#ff00ff] pb-1">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-[#ff00ff]"
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : '10%',
              transition: 'height 0.1s ease'
            }}
          />
        ))}
      </div>
      <div className="text-right text-[#ff00ff] text-lg">FREQ_ANALYZER_ACTIVE</div>
    </div>
  );
};
