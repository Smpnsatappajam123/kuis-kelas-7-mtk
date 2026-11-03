import React from 'react';
import { Check, X, Sparkles, Lock } from 'lucide-react';
import { Question, QuestionCardState } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface QuestionBoardProps {
  questions: Question[];
  cardStates: Record<number, QuestionCardState>;
  activeQuestionId: number | null;
  onCardClick: (question: Question) => void;
}

export const QuestionBoard: React.FC<QuestionBoardProps> = ({
  questions,
  cardStates,
  activeQuestionId,
  onCardClick,
}) => {
  // Category mini-accent dot/label helper
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'BILANGAN_BULAT':
        return {
          label: 'Bulat',
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
        };
      case 'BILANGAN_RASIONAL':
        return {
          label: 'Rasional',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
        };
      case 'RASIO_PERBANDINGAN':
        return {
          label: 'Rasio',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
        };
      case 'BENTUK_ALJABAR':
        return {
          label: 'Aljabar',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
        };
      default:
        return {
          label: 'Matematika',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
        };
    }
  };

  return (
    <div className="w-full">
      {/* Category Legend Bar for Classroom Guidance */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-5 text-xs font-bold text-slate-300 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <span className="text-slate-400 uppercase tracking-widest text-[11px]">Materi Kelas VII:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400/50" />
          <span>Bilangan Bulat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
          <span>Bilangan Rasional</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50" />
          <span>Rasio & Perbandingan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-400 inline-block shadow-sm shadow-purple-400/50" />
          <span>Bentuk Aljabar</span>
        </div>
      </div>

      {/* Grid of Cards (Adaptive 5 to 10 columns for PID landscape) */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
        {questions.map((question) => {
          const cardState = cardStates[question.id];
          const isAnswered = cardState?.status === 'answered';
          const isPlaying = activeQuestionId === question.id || cardState?.status === 'playing';
          const isUnplayed = !isAnswered && !isPlaying;
          const theme = getCategoryTheme(question.category);

          return (
            <button
              key={question.id}
              type="button"
              disabled={isAnswered || isPlaying}
              onClick={() => {
                if (isUnplayed) {
                  sounds.playClick();
                  onCardClick(question);
                }
              }}
              className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 select-none text-center min-h-[92px] sm:min-h-[105px] border-2 ${
                isAnswered
                  ? 'bg-slate-900/90 border-slate-800 text-slate-500 cursor-not-allowed opacity-80 shadow-none'
                  : isPlaying
                  ? 'bg-gradient-to-b from-amber-500/20 to-blue-900/40 border-amber-400 text-white shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/50 animate-pulse scale-105 z-10'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900/95 border-cyan-500/40 hover:border-cyan-400 text-white hover:scale-105 active:scale-95 shadow-md shadow-cyan-950/60 cursor-pointer game-btn-3d group'
              }`}
            >
              {/* Top Row: Mini Category Tag or Lock */}
              <div className="w-full flex items-center justify-between text-[10px] font-bold">
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${theme.color} ${theme.bg}`}>
                  {theme.label}
                </span>

                {isAnswered && (
                  <span className="flex items-center gap-0.5">
                    {cardState?.isCorrect ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-extrabold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        +100
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-rose-400 font-extrabold">
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        0
                      </span>
                    )}
                  </span>
                )}

                {isPlaying && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                )}
              </div>

              {/* Central Question Number (Large, high legibility for PID) */}
              <div className="my-1">
                <span
                  className={`text-2xl sm:text-3xl font-black font-display tracking-tight transition-colors ${
                    isAnswered
                      ? 'text-slate-600 line-through decoration-slate-600/60'
                      : isPlaying
                      ? 'text-amber-300 drop-shadow-md'
                      : 'text-white group-hover:text-cyan-300 drop-shadow'
                  }`}
                >
                  {question.code}
                </span>
              </div>

              {/* Bottom Row: Participant attribution badge or CTA */}
              <div className="w-full truncate text-[11px] font-bold">
                {isAnswered && cardState?.answeredByParticipantName ? (
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cardState.answeredByParticipantColor || '#94a3b8' }}
                    />
                    <span 
                      className="truncate text-[10px] max-w-[80px]"
                      style={{ color: cardState.answeredByParticipantColor || '#94a3b8' }}
                      title={cardState.answeredByParticipantName}
                    >
                      {cardState.answeredByParticipantName}
                    </span>
                  </div>
                ) : isPlaying ? (
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Sedang Main
                  </span>
                ) : (
                  <span className="text-[10px] text-cyan-400/80 group-hover:text-cyan-300 transition-colors uppercase font-mono tracking-wider">
                    100 Poin
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
