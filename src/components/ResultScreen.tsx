import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Medal, 
  Award, 
  RotateCcw, 
  Home, 
  Play, 
  Sparkles,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { Participant, GameMode } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface ResultScreenProps {
  participants: Participant[];
  mode: GameMode;
  totalQuestions: number;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
  onResetGame: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  participants,
  mode,
  totalQuestions,
  onPlayAgain,
  onReturnToMenu,
  onResetGame,
}) => {
  // Sort participants by score descending
  const sorted = [...participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correctCount - a.correctCount;
  });

  const firstPlace = sorted[0];
  const secondPlace = sorted[1];
  const thirdPlace = sorted[2];

  useEffect(() => {
    // Play celebratory victory fanfare
    sounds.playFanfare();

    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Celebration Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest mb-3 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Kompetisi Selesai · Math Challenge Arena
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-display tracking-tight drop-shadow-lg mb-2">
          CONGRATULATIONS!
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
          Selamat kepada para juara yang telah menunjukkan kehebatan dalam menyelesaikan tantangan matematika kelas VII!
        </p>
      </div>

      {/* 3D Podium Section */}
      <div className="mb-12">
        <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-3xl mx-auto pt-8">
          {/* 2nd Place (Silver) */}
          {secondPlace && (
            <div className="flex-1 max-w-[200px] flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-lg border-2 border-slate-300 mb-3 relative group"
                style={{ backgroundColor: secondPlace.color }}
              >
                {secondPlace.avatarIcon}
                <div className="absolute -top-3 -right-2 p-1.5 bg-slate-300 rounded-full text-slate-900 shadow">
                  <Medal className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white text-center truncate w-full">
                {secondPlace.name}
              </span>
              <span className="text-xs sm:text-sm font-black font-mono text-slate-300 mb-2">
                {secondPlace.score} Poin
              </span>

              {/* 2nd Podium Base */}
              <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-2 border-x-2 border-slate-400 flex flex-col items-center justify-center p-3 shadow-xl">
                <span className="text-3xl sm:text-4xl font-black font-display text-slate-300">2</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Juara II</span>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Champion) */}
          {firstPlace && (
            <div className="flex-1 max-w-[240px] flex flex-col items-center -mt-8">
              <div className="relative mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-2xl border-4 border-amber-300 ring-4 ring-amber-400/50"
                  style={{ backgroundColor: firstPlace.color }}
                >
                  {firstPlace.avatarIcon}
                </div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 p-2 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full text-slate-950 shadow-xl shadow-amber-500/50 animate-bounce">
                  <Trophy className="w-6 h-6 fill-current" />
                </div>
              </div>
              <span className="font-black text-base sm:text-lg text-amber-300 text-center truncate w-full drop-shadow">
                {firstPlace.name}
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-amber-400 mb-2">
                {firstPlace.score} Poin
              </span>

              {/* 1st Podium Base */}
              <div className="w-full h-44 sm:h-52 rounded-t-2xl bg-gradient-to-t from-amber-950/70 via-amber-800/60 to-amber-600/60 border-t-4 border-x-4 border-amber-300 flex flex-col items-center justify-center p-3 shadow-2xl shadow-amber-500/30">
                <span className="text-4xl sm:text-5xl font-black font-display text-amber-300 drop-shadow">1</span>
                <span className="text-xs font-black uppercase tracking-widest text-amber-200">CHAMPION</span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {thirdPlace && (
            <div className="flex-1 max-w-[200px] flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-lg border-2 border-amber-700 mb-3 relative group"
                style={{ backgroundColor: thirdPlace.color }}
              >
                {thirdPlace.avatarIcon}
                <div className="absolute -top-3 -right-2 p-1.5 bg-amber-700 rounded-full text-white shadow">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white text-center truncate w-full">
                {thirdPlace.name}
              </span>
              <span className="text-xs sm:text-sm font-black font-mono text-amber-600 mb-2">
                {thirdPlace.score} Poin
              </span>

              {/* 3rd Podium Base */}
              <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-x-2 border-amber-700 flex flex-col items-center justify-center p-3 shadow-xl">
                <span className="text-2xl sm:text-3xl font-black font-display text-amber-600">3</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Juara III</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Final Standings Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl mb-10 overflow-hidden">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 font-display">
          <Trophy className="w-5 h-5 text-amber-400" />
          TABEL KLASEMEN AKHIR
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">{mode === 'team' ? 'Nama Kelompok' : 'Nama Peserta'}</th>
                <th className="py-3 px-4 text-center">Soal Dijawab</th>
                <th className="py-3 px-4 text-center">Benar</th>
                <th className="py-3 px-4 text-center">Akurasi</th>
                <th className="py-3 px-4 text-right">Total Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((p, index) => {
                const accuracy = p.answeredCount > 0 ? Math.round((p.correctCount / p.answeredCount) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-center w-16">
                      {index === 0 ? (
                        <span className="text-amber-400 font-black text-base">🥇 #1</span>
                      ) : index === 1 ? (
                        <span className="text-slate-300 font-black text-base">🥈 #2</span>
                      ) : index === 2 ? (
                        <span className="text-amber-600 font-black text-base">🥉 #3</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{p.answeredCount}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-bold">{p.correctCount}</td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs font-bold text-cyan-300">
                        {accuracy}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-lg text-amber-300">
                      {p.score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            sounds.playCorrect();
            onPlayAgain();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-400 text-slate-950 font-black text-lg tracking-wider uppercase shadow-xl shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 game-btn-3d border-2 border-white/60 font-display"
        >
          <Play className="w-5 h-5 fill-current" />
          MAIN LAGI (ULANG KARTU)
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onReturnToMenu();
          }}
          className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-colors flex items-center gap-2 game-btn-3d"
        >
          <Home className="w-5 h-5 text-cyan-400" />
          KEMBALI KE MENU
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onResetGame();
          }}
          className="px-6 py-4 rounded-2xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-bold text-base border border-rose-700/60 transition-colors flex items-center gap-2 game-btn-3d"
        >
          <RotateCcw className="w-5 h-5" />
          RESET GAME
        </button>
      </div>
    </div>
  );
};
