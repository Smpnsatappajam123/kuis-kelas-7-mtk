import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isDestructive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-white mb-2 font-display">
            {title}
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onCancel();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-colors"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onConfirm();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg game-btn-3d ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
