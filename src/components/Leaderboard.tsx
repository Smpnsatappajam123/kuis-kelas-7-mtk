import React from 'react';
import { Trophy, Medal, Award, Plus, Minus } from 'lucide-react';
import { Participant, GameMode } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface LeaderboardProps {
  participants: Participant[];
  mode: GameMode;
  onAdjustScore?: (id: string, delta: number) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  participants,
  mode,
  onAdjustScore,
}) => {
  // Sort by highest score first, then by correct count
  const sorted = [...participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correctCount - a.correctCount;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white text-base tracking-wide font-display">
            PAPAN SKOR ARENA
          </h3>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {mode === 'team' ? `${participants.length} Kelompok` : `${participants.length} Peserta`}
        </span>
      </div>

      {/* Participants Ranking List */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {sorted.map((p, index) => {
          const isFirst = index === 0 && p.score > 0;
          const isSecond = index === 1 && p.score > 0;
          const isThird = index === 2 && p.score > 0;

          return (
            <div
              key={p.id}
              className={`relative flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                isFirst
                  ? 'bg-gradient-to-r from-amber-500/15 via-slate-800/90 to-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Left: Rank Badge & Avatar & Name */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                {/* Rank Indicator */}
                <div className="w-6 flex items-center justify-center shrink-0">
                  {isFirst ? (
                    <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                  ) : isSecond ? (
                    <Medal className="w-5 h-5 text-slate-300" />
                  ) : isThird ? (
                    <Award className="w-5 h-5 text-amber-700" />
                  ) : (
                    <span className="font-mono text-xs font-black text-slate-500">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Team / Player Color Avatar */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.avatarIcon}
                </div>

                {/* Name & Stats */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-white truncate">
                      {p.name}
                    </span>
                    {isFirst && (
                      <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] font-black rounded uppercase">
                        Juara 1
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span>Dijawab: <b className="text-slate-300">{p.answeredCount}</b></span>
                    <span>·</span>
                    <span>Benar: <b className="text-emerald-400">{p.correctCount}</b></span>
                  </div>
                </div>
              </div>

              {/* Right: Score Value and Teacher +/- Adjust */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span
                    className={`text-lg sm:text-xl font-black font-mono tracking-tight ${
                      isFirst ? 'text-amber-400' : 'text-cyan-300'
                    }`}
                  >
                    {p.score}
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-1 font-semibold">
                    Poin
                  </span>
                </div>

                {/* Teacher Discretionary Quick Buttons */}
                {onAdjustScore && (
                  <div className="flex flex-col gap-0.5 ml-1">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onAdjustScore(p.id, 10);
                      }}
                      title="Tambah 10 Poin Bonus"
                      className="p-1 rounded bg-slate-700/80 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onAdjustScore(p.id, -10);
                      }}
                      title="Kurangi 10 Poin"
                      className="p-1 rounded bg-slate-700/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
