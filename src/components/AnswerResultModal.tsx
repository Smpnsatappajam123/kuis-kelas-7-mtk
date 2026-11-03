import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Grid, 
  BookOpen, 
  Sparkles,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Question, Participant } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface AnswerResultModalProps {
  question: Question;
  participant: Participant;
  userAnswer: string;
  isCorrect: boolean;
  isTimeUp: boolean;
  earnedPoints: number;
  onReturnToBoard: () => void;
  onNextQuestion?: () => void;
  onAddTeacherBonus: (participantId: string, bonusPoints: number) => void;
}

export const AnswerResultModal: React.FC<AnswerResultModalProps> = ({
  question,
  participant,
  userAnswer,
  isCorrect,
  isTimeUp,
  earnedPoints,
  onReturnToBoard,
  onNextQuestion,
  onAddTeacherBonus,
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [bonusAdded, setBonusAdded] = useState<number>(0);

  // Trigger celebration on mount if correct
  useEffect(() => {
    if (isCorrect) {
      sounds.playCorrect();
      // Burst confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#fbbf24', '#34d399', '#a855f7'],
      });
    } else {
      sounds.playWrong();
    }
  }, [isCorrect]);

  const handleBonus = (amount: number) => {
    sounds.playCorrect();
    setBonusAdded((prev) => prev + amount);
    onAddTeacherBonus(participant.id, amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 my-auto">
        {/* Result Header Badge */}
        <div className="text-center mb-5">
          {isCorrect ? (
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 font-display tracking-tight drop-shadow">
                JAWABAN BENAR!
              </h2>
              <span className="mt-1 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-sm uppercase tracking-widest border border-emerald-400/40">
                +{earnedPoints} Poin untuk {participant.name}
              </span>
            </div>
          ) : isTimeUp ? (
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                <Clock className="w-12 h-12 stroke-[2.5]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-amber-400 font-display tracking-tight">
                WAKTU HABIS!
              </h2>
              <span className="mt-1 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-sm uppercase tracking-widest border border-amber-400/40">
                0 Poin
              </span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/30">
                <XCircle className="w-12 h-12 stroke-[2.5]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-rose-400 font-display tracking-tight">
                JAWABAN BELUM TEPAT
              </h2>
              <span className="mt-1 px-4 py-1 rounded-full bg-rose-500/20 text-rose-300 font-black text-sm uppercase tracking-widest border border-rose-400/40">
                0 Poin
              </span>
            </div>
          )}
        </div>

        {/* Answers Comparison Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Jawaban {participant.name}:
            </span>
            <p className="text-base font-extrabold text-white font-mono break-words">
              {userAnswer || <span className="text-slate-500 italic">(Tidak menjawab)</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/40">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Kunci Jawaban Benar:
            </span>
            <p className="text-base font-black text-emerald-300 font-mono break-words">
              {question.correctAnswer}
            </p>
          </div>
        </div>

        {/* Step-by-Step Mathematical Explanation (Pembahasan Singkat) */}
        <div className="mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 p-4 shadow-inner">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/60">
            <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Pembahasan Matematika:</span>
            </div>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium">
            {question.explanation}
          </p>
        </div>

        {/* Teacher Bonus Controls (Discretionary Points) */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            Bonus Guru Khusus ({participant.name}):
          </span>
          <div className="flex items-center gap-2">
            {[10, 20, 50].map((pts) => (
              <button
                key={pts}
                type="button"
                onClick={() => handleBonus(pts)}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-lg font-bold transition-colors"
              >
                +{pts} Poin
              </button>
            ))}
            {bonusAdded > 0 && (
              <span className="text-amber-400 font-mono font-bold">
                (Total +{bonusAdded})
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Kembali ke Papan / Soal Berikutnya */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onReturnToBoard();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-colors flex items-center justify-center gap-2 game-btn-3d"
          >
            <Grid className="w-4 h-4 text-cyan-400" />
            KEMBALI KE PAPAN SOAL
          </button>

          {onNextQuestion && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-md shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 game-btn-3d"
            >
              <span>SOAL BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
