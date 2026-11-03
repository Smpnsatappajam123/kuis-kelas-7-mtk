import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Pause, 
  Play, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Delete,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Question, Participant } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface QuestionModalProps {
  question: Question;
  participant: Participant;
  timerDuration: number;
  isGamePaused: boolean;
  onSubmitAnswer: (answer: string, isTimeUp?: boolean) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  participant,
  timerDuration,
  isGamePaused,
  onSubmitAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Timer interval ref
  const timerRef = useRef<number | null>(null);

  // Handle countdown
  useEffect(() => {
    if (isGamePaused || isTimerPaused || isSubmitting) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          sounds.playTimeUp();
          // Time is up!
          handleTimeUp();
          return 0;
        }

        // Sound cues
        if (prev <= 6 && prev > 1) {
          sounds.playWarning();
        } else {
          sounds.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGamePaused, isTimerPaused, isSubmitting]);

  const handleTimeUp = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Answer submitted as empty or current option with timeUp flag
    const finalAnswer = question.type === 'isian_singkat' ? textAnswer : selectedOption;
    onSubmitAnswer(finalAnswer, true);
  };

  const handleManualSubmit = () => {
    if (isSubmitting) return;
    const finalAnswer = question.type === 'isian_singkat' ? textAnswer.trim() : selectedOption;
    if (!finalAnswer) {
      alert('Silakan pilih atau ketikkan jawaban terlebih dahulu!');
      return;
    }
    sounds.playClick();
    setIsSubmitting(true);
    onSubmitAnswer(finalAnswer, false);
  };

  // Virtual Keypad for PID Touchscreen
  const handleKeypadPress = (key: string) => {
    sounds.playClick();
    if (key === 'BACKSPACE') {
      setTextAnswer((prev) => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setTextAnswer('');
    } else {
      setTextAnswer((prev) => prev + key);
    }
  };

  // Timer percentage and color
  const timerPercent = (timeLeft / timerDuration) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-cyan-900/60 my-auto animate-scaleUp">
        {/* Top Bar: Question Info & Active Turn Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-xl text-xs font-black uppercase tracking-wider">
              Soal #{question.code}
            </span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold">
              {question.categoryLabel}
            </span>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold">
              {question.difficulty}
            </span>
          </div>

          {/* Active Participant Banner */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
            <span className="text-xs uppercase font-extrabold text-slate-400">Giliran:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: participant.color }}
              />
              <span
                className="font-black text-sm sm:text-base font-display"
                style={{ color: participant.color }}
              >
                {participant.name}
              </span>
            </div>
          </div>
        </div>

        {/* Central HUD: Big Countdown Timer Bar */}
        <div className="mb-6 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
              <span className="text-xs uppercase font-black text-slate-300 tracking-wider">Sisa Waktu Menjawab:</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Teacher Pause/Resume Button for Timer */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsTimerPaused(!isTimerPaused);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                  isTimerPaused
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-700/80 text-slate-300 border-slate-600 hover:text-white'
                }`}
                title="Jeda / Lanjutkan timer untuk penjelasan guru"
              >
                {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isTimerPaused ? 'Lanjut' : 'Jeda Timer Guru'}</span>
              </button>

              <span
                className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                  isUrgent ? 'text-rose-400 animate-pulse' : 'text-amber-300'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Animated Visual Timer Progress */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isUrgent
                  ? 'bg-rose-500 shadow-md shadow-rose-500/50'
                  : timeLeft < timerDuration * 0.4
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        {/* The Question Text (Large, clean, high visibility) */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-inner">
          <p className="text-lg sm:text-2xl font-bold text-white leading-relaxed font-display text-center">
            {question.question}
          </p>
        </div>

        {/* Answer Options Area based on question type */}
        <div className="mb-6">
          {/* 1. Multiple Choice Options */}
          {question.type === 'pilihan_ganda' && question.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {question.options.map((option, index) => {
                const label = ['A', 'B', 'C', 'D'][index];
                const isSelected = selectedOption === option;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedOption(option);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all game-btn-3d ${
                      isSelected
                        ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 scale-102 ring-2 ring-cyan-400/50'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-750'
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 shadow-md'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="text-base sm:text-lg font-bold flex-1">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. True / False Options */}
          {question.type === 'benar_salah' && (
            <div className="grid grid-cols-2 gap-4">
              {['Benar', 'Salah'].map((val) => {
                const isSelected = selectedOption === val;
                const isBenar = val === 'Benar';

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedOption(val);
                    }}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all font-display game-btn-3d ${
                      isSelected
                        ? isBenar
                          ? 'bg-emerald-600/30 border-emerald-400 text-white ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/30 scale-102'
                          : 'bg-rose-600/30 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-lg shadow-rose-500/30 scale-102'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                      {val}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Short Answer with PID Touch Virtual Keypad */}
          {question.type === 'isian_singkat' && (
            <div className="space-y-4">
              {/* Display Box for Typed Answer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 shadow-inner">
                <span className="text-xs uppercase font-extrabold text-slate-400">Jawaban Anda:</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-wider min-h-[36px]">
                  {textAnswer || <span className="text-slate-600">Tekan tombol angka di bawah...</span>}
                </span>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('CLEAR')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                >
                  Bersihkan
                </button>
              </div>

              {/* Touchscreen Keypad for PID */}
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '/', ',', 'x'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypadPress(key)}
                      className="h-12 rounded-xl bg-slate-700/80 hover:bg-slate-600 border border-slate-600 text-white font-black text-lg transition-all game-btn-3d"
                    >
                      {key}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('BACKSPACE')}
                    className="col-span-2 h-12 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 font-bold text-sm flex items-center justify-center gap-1 transition-all game-btn-3d"
                  >
                    <Delete className="w-5 h-5" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: JAWAB / KIRIM JAWABAN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>Pastikan jawaban telah disepakati oleh tim sebelum menekan tombol Kirim.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleManualSubmit}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-lg tracking-wider uppercase shadow-lg shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 game-btn-3d border-2 border-white/50"
            >
              <Send className="w-5 h-5" />
              KIRIM JAWABAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
