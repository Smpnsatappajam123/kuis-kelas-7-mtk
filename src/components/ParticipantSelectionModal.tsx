import React from 'react';
import { Users, User, X, Zap } from 'lucide-react';
import { Participant, Question, GameMode } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface ParticipantSelectionModalProps {
  question: Question;
  mode: GameMode;
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
  onCancel: () => void;
}

export const ParticipantSelectionModal: React.FC<ParticipantSelectionModalProps> = ({
  question,
  mode,
  participants,
  onSelectParticipant,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-widest mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            Kartu Soal Nomor #{question.code}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
            {mode === 'team' ? 'PILIH KELOMPOK PENJAWAB' : 'PILIH PESERTA PENJAWAB'}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Siapakah yang berhak menjawab pertanyaan ini? Sentuh salah satu pilihan di bawah.
          </p>
        </div>

        {/* Participants Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
          {participants.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                sounds.playCorrect();
                onSelectParticipant(p);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border-2 transition-all hover:scale-105 active:scale-95 shadow-lg group game-btn-3d text-center"
              style={{
                borderColor: `${p.color}80`,
              }}
            >
              {/* Avatar / Badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white mb-2.5 shadow-md shadow-black/40 group-hover:scale-110 transition-transform font-display"
                style={{ backgroundColor: p.color }}
              >
                {mode === 'team' ? (
                  <span>{idx + 1}</span>
                ) : (
                  <span>{p.avatarIcon}</span>
                )}
              </div>

              {/* Name */}
              <span className="font-extrabold text-white text-sm sm:text-base line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {p.name}
              </span>

              {/* Current Score Tag */}
              <span className="text-xs font-mono text-slate-400 mt-1 font-bold">
                {p.score} Poin
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-colors"
          >
            Batal & Pilih Kartu Lain
          </button>
        </div>
      </div>
    </div>
  );
};
