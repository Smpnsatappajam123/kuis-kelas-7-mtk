import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Clock, 
  Sliders, 
  Layers, 
  Shuffle, 
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';
import { GameMode, GameSettings, Participant } from '../types/game';
import { TEAM_COLORS, DEFAULT_TEAM_NAMES } from '../data/teamPresets';
import { sounds } from '../utils/soundEffects';

interface SetupScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  teams: Participant[];
  onUpdateTeams: (newTeams: Participant[]) => void;
  individuals: Participant[];
  onUpdateIndividuals: (newIndividuals: Participant[]) => void;
  onStartGame: () => void;
  onResetDefaults: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  settings,
  onUpdateSettings,
  teams,
  onUpdateTeams,
  individuals,
  onUpdateIndividuals,
  onStartGame,
  onResetDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [newPlayerName, setNewPlayerName] = useState<string>('');

  // Set team count quickly (2 - 8)
  const handleSetTeamCount = (count: number) => {
    sounds.playClick();
    const currentLength = teams.length;
    if (count === currentLength) return;

    if (count > currentLength) {
      const addedTeams: Participant[] = [];
      for (let i = currentLength; i < count; i++) {
        const color = TEAM_COLORS[i % TEAM_COLORS.length];
        addedTeams.push({
          id: `team-${Date.now()}-${i}`,
          name: DEFAULT_TEAM_NAMES[i] || `Kelompok ${i + 1}`,
          color: color.hex,
          bgClass: color.bgClass,
          borderClass: color.borderClass,
          textClass: color.textClass,
          avatarIcon: `${i + 1}`,
          score: 0,
          answeredCount: 0,
          correctCount: 0,
        });
      }
      onUpdateTeams([...teams, ...addedTeams]);
    } else {
      onUpdateTeams(teams.slice(0, count));
    }
  };

  // Add individual participant
  const handleAddIndividual = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPlayerName.trim()) return;
    sounds.playClick();
    const nextIndex = individuals.length;
    const color = TEAM_COLORS[nextIndex % TEAM_COLORS.length];
    const newParticipant: Participant = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
      color: color.hex,
      bgClass: color.bgClass,
      borderClass: color.borderClass,
      textClass: color.textClass,
      avatarIcon: newPlayerName.trim().charAt(0).toUpperCase() || `${nextIndex + 1}`,
      score: 0,
      answeredCount: 0,
      correctCount: 0,
    };
    onUpdateIndividuals([...individuals, newParticipant]);
    setNewPlayerName('');
  };

  // Remove individual participant
  const handleRemoveIndividual = (id: string) => {
    if (individuals.length <= 2) {
      alert('Minimal harus ada 2 peserta untuk memulai kompetisi!');
      return;
    }
    sounds.playClick();
    onUpdateIndividuals(individuals.filter((p) => p.id !== id));
  };

  // Save edited name
  const handleSaveName = (id: string, isTeam: boolean) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    sounds.playClick();
    if (isTeam) {
      onUpdateTeams(
        teams.map((t) => (t.id === id ? { ...t, name: editingName.trim() } : t))
      );
    } else {
      onUpdateIndividuals(
        individuals.map((p) =>
          p.id === id ? { ...p, name: editingName.trim(), avatarIcon: editingName.trim().charAt(0).toUpperCase() } : p
        )
      );
    }
    setEditingId(null);
    setEditingName('');
  };

  const questionCountOptions = [10, 20, 30, 40, 50];
  const timerOptions = [15, 30, 45, 60, 90];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Welcome Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Arena Edukasi Proyektor Interaktif Digital
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-2 drop-shadow-md">
          PENGATURAN PERMAINAN
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
          Pilih mode permainan, tentukan jumlah peserta/kelompok, dan sesuaikan durasi waktu sebelum meluncur ke arena pertempuran matematika!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Participant / Team Mode Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              1. Pilih Mode Permainan
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onUpdateSettings({ mode: 'team' });
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all font-display game-btn-3d ${
                  settings.mode === 'team'
                    ? 'bg-blue-600/30 border-cyan-400 text-white shadow-lg shadow-blue-500/30 ring-2 ring-cyan-400/40'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 ${settings.mode === 'team' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-lg font-black tracking-wide">MODE KELOMPOK</span>
                <span className="text-xs font-medium text-slate-400 mt-1">Kompetisi 2 - 8 regu/tim kelas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onUpdateSettings({ mode: 'individual' });
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all font-display game-btn-3d ${
                  settings.mode === 'individual'
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/40'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 ${settings.mode === 'individual' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <User className="w-6 h-6" />
                </div>
                <span className="text-lg font-black tracking-wide">MODE INDIVIDU</span>
                <span className="text-xs font-medium text-slate-400 mt-1">Pemain individu perorangan</span>
              </button>
            </div>
          </div>

          {/* Mode Kelompok Details */}
          {settings.mode === 'team' && (
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-3">
                  <span>Jumlah Kelompok (2 - 8 Regu)</span>
                  <span className="text-cyan-400 font-mono text-sm font-black">{teams.length} Kelompok</span>
                </label>
                {/* Quick selector buttons 2 - 8 */}
                <div className="grid grid-cols-7 gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleSetTeamCount(count)}
                      className={`h-12 rounded-xl font-black text-lg transition-all border-2 game-btn-3d ${
                        teams.length === count
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 border-white shadow-md shadow-cyan-500/40 scale-105'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teams List & Name Editing */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Daftar Nama & Warna Identitas Kelompok:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {teams.map((team, idx) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: team.color }}
                        >
                          {idx + 1}
                        </div>
                        {editingId === team.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveName(team.id, true)}
                              autoFocus
                              className="w-full bg-slate-950 border border-cyan-400 text-white rounded-lg px-2.5 py-1 text-sm focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveName(team.id, true)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                              title="Simpan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-200 text-sm truncate">
                            {team.name}
                          </span>
                        )}
                      </div>
                      {editingId !== team.id && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setEditingId(team.id);
                            setEditingName(team.name);
                          }}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                          title="Ubah Nama Kelompok"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode Individu Details */}
          {settings.mode === 'individual' && (
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daftar Peserta Individu ({individuals.length} Peserta)
                </label>
              </div>

              {/* Add New Participant Form */}
              <form onSubmit={handleAddIndividual} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik nama peserta baru..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 game-btn-3d"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </form>

              {/* Participants List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {individuals.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-sm text-sm"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.avatarIcon}
                      </div>
                      {editingId === player.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName(player.id, false)}
                            autoFocus
                            className="w-full bg-slate-950 border border-purple-400 text-white rounded-lg px-2.5 py-1 text-sm focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveName(player.id, false)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                            title="Simpan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-200 text-sm truncate">
                          {player.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingId !== player.id && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setEditingId(player.id);
                            setEditingName(player.name);
                          }}
                          className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                          title="Ubah Nama"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveIndividual(player.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                        title="Hapus Peserta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Game Rules & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              2. Parameter Permainan
            </h3>

            {/* Question Count */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Jumlah Soal di Papan
                </span>
                <span className="text-cyan-400 font-mono font-bold">{settings.questionCount} Soal</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onUpdateSettings({ questionCount: count });
                    }}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all game-btn-3d ${
                      settings.questionCount === count
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Duration */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Durasi Waktu Menjawab
                </span>
                <span className="text-amber-400 font-mono font-bold">{settings.timerDuration} Detik</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {timerOptions.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onUpdateSettings({ timerDuration: seconds });
                    }}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all game-btn-3d ${
                      settings.timerDuration === seconds
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            {/* Question Order */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <Shuffle className="w-4 h-4 text-emerald-400" />
                Urutan Soal di Papan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onUpdateSettings({ questionOrder: 'random' });
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 game-btn-3d ${
                    settings.questionOrder === 'random'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                  Acak (Direkomendasikan)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onUpdateSettings({ questionOrder: 'sequential' });
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 game-btn-3d ${
                    settings.questionOrder === 'sequential'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Berurutan (Materi A - D)
                </button>
              </div>
            </div>

            {/* Scoring Info */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-slate-200 font-bold">
                <span>Aturan Penilaian:</span>
                <span className="text-emerald-400">+100 Poin per Benar</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Jawaban salah atau waktu habis bernilai 0 poin. Guru dapat memberikan bonus tambahan secara manual jika diperlukan.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playCorrect();
                  onStartGame();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-400 text-slate-950 font-black text-xl tracking-wider uppercase shadow-xl shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 font-display border-2 border-white/60 game-btn-3d"
              >
                <Play className="w-6 h-6 fill-current" />
                MULAI PERMAINAN
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onResetDefaults();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 game-btn-3d"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                Atur Ulang Pengaturan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
