import React from 'react';
import { HelpCircle, X, Touchpad, Trophy, Clock, Check, Users } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl sm:text-2xl font-black text-white font-display">
            PANDUAN MAIN DI PROYEKTOR (PID)
          </h3>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
              <Touchpad className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">1. Memilih Kartu Soal</h4>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Sentuh kartu soal mana saja yang masih berwarna cerah (status Belum Dimainkan). Kartu bernomor 01 hingga 50.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">2. Menentukan Peserta / Kelompok</h4>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Tentukan regu atau peserta yang berhak menjawab. Setelah dipilih, kartu langsung terkunci untuk giliran mereka.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">3. Menjawab Sesuai Timer</h4>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Timer hitung mundur berjalan otomatis. Siswa dapat menyentuh opsi A/B/C/D, Benar/Salah, atau keypad virtual angka pada layar PID.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base">4. Skor Otomatis & Kunci Permanen</h4>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Jawaban benar mendapatkan +100 poin, salah 0 poin. Kartu yang sudah dijawab akan terkunci permanen agar tidak ada soal ganda.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30"
          >
            SAYA MENGERTI
          </button>
        </div>
      </div>
    </div>
  );
};
