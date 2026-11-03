import React from 'react';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Pause, 
  Play, 
  RotateCcw, 
  Home, 
  Users, 
  User, 
  HelpCircle 
} from 'lucide-react';
import { GameMode } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  mode: GameMode;
  totalQuestions: number;
  usedQuestionsCount: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetGame: () => void;
  onReturnToMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showHelp: boolean;
  onToggleHelp: () => void;
  gameView: 'setup' | 'board' | 'result';
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  totalQuestions,
  usedQuestionsCount,
  isPaused,
  onTogglePause,
  onResetGame,
  onReturnToMenu,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  showHelp,
  onToggleHelp,
  gameView,
}) => {
  const remaining = Math.max(0, totalQuestions - usedQuestionsCount);
  const progressPercent = totalQuestions > 0 ? (usedQuestionsCount / totalQuestions) * 100 : 0;

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/20 text-white px-4 py-3 sm:px-6 shadow-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Titles */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300 bg-clip-text text-transparent font-display">
                MATH CHALLENGE ARENA
              </h1>
              {gameView !== 'setup' && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-500/40">
                  {mode === 'team' ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  {mode === 'team' ? 'Mode Kelompok' : 'Mode Individu'}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
              The Ultimate Mathematics Battle · Kelas VII SMP
            </p>
          </div>
        </div>

        {/* HUD Game Progress (Shown during board view) */}
        {gameView === 'board' && (
          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2 shadow-inner">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 gap-4 mb-1">
                <span>Soal: <span className="text-cyan-400 font-mono text-sm">{usedQuestionsCount}</span> / {totalQuestions}</span>
                <span className="text-slate-400">Sisa: <span className="text-amber-400 font-mono">{remaining}</span></span>
              </div>
              <div className="w-36 sm:w-48 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {isPaused && (
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded text-xs font-extrabold animate-pulse uppercase">
                Dijeda
              </span>
            )}
          </div>
        )}

        {/* Quick Toolbar Action Buttons (Large touch targets for PID) */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume button */}
          {gameView === 'board' && (
            <button
              onClick={() => {
                sounds.playClick();
                onTogglePause();
              }}
              title={isPaused ? 'Lanjutkan Permainan' : 'Jeda Permainan'}
              className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-md game-btn-3d ${
                isPaused
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 shadow-md transition-colors game-btn-3d"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleFullscreen();
            }}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (PID)'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 shadow-md transition-colors game-btn-3d"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Help Instructions Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleHelp();
            }}
            title="Panduan Permainan"
            className={`p-2.5 rounded-xl border shadow-md transition-colors game-btn-3d ${
              showHelp 
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Game (during board) */}
          {gameView === 'board' && (
            <button
              onClick={() => {
                sounds.playClick();
                onResetGame();
              }}
              title="Reset Permainan"
              className="p-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 border border-rose-600/50 text-rose-200 shadow-md transition-colors game-btn-3d"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Return to Setup Menu */}
          {gameView !== 'setup' && (
            <button
              onClick={() => {
                sounds.playClick();
                onReturnToMenu();
              }}
              title="Kembali ke Menu Pengaturan"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 shadow-md transition-colors game-btn-3d"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
