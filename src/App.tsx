import React, { useState, useEffect } from 'react';
import { 
  GameMode, 
  GameSettings, 
  GameView, 
  Participant, 
  Question, 
  QuestionCardState 
} from './types/game';
import { QUESTIONS_BANK } from './data/questions';
import { createDefaultTeams, createDefaultIndividuals } from './data/teamPresets';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { QuestionBoard } from './components/QuestionBoard';
import { Leaderboard } from './components/Leaderboard';
import { ParticipantSelectionModal } from './components/ParticipantSelectionModal';
import { QuestionModal } from './components/QuestionModal';
import { AnswerResultModal } from './components/AnswerResultModal';
import { ResultScreen } from './components/ResultScreen';
import { ConfirmationModal } from './components/ConfirmationModal';
import { HelpModal } from './components/HelpModal';
import { sounds } from './utils/soundEffects';
import { Trophy, ArrowRight, Play, Flag } from 'lucide-react';

const STORAGE_KEY = 'MATH_CHALLENGE_ARENA_STATE_V1';

export default function App() {
  // Game Settings State
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'team',
    questionCount: 30,
    timerDuration: 45,
    questionOrder: 'random',
  });

  // Participants State
  const [teams, setTeams] = useState<Participant[]>(() => createDefaultTeams(4));
  const [individuals, setIndividuals] = useState<Participant[]>(() => createDefaultIndividuals());

  // Game Flow State
  const [gameView, setGameView] = useState<GameView>('setup');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [cardStates, setCardStates] = useState<Record<number, QuestionCardState>>({});
  
  // Interactive Modal States
  const [selectedQuestionForTurn, setSelectedQuestionForTurn] = useState<Question | null>(null);
  const [turnParticipant, setTurnParticipant] = useState<Participant | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [answerResultData, setAnswerResultData] = useState<{
    question: Question;
    participant: Participant;
    userAnswer: string;
    isCorrect: boolean;
    isTimeUp: boolean;
    earnedPoints: number;
  } | null>(null);

  // Global Controls State
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Restore game state from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.individuals) setIndividuals(parsed.individuals);
        if (parsed.gameView) setGameView(parsed.gameView);
        if (parsed.activeQuestions && parsed.activeQuestions.length > 0) {
          setActiveQuestions(parsed.activeQuestions);
        }
        if (parsed.cardStates) setCardStates(parsed.cardStates);
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage:', e);
    }
  }, []);

  // Save state to localStorage whenever critical state updates
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          settings,
          teams,
          individuals,
          gameView,
          activeQuestions,
          cardStates,
        })
      );
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [settings, teams, individuals, gameView, activeQuestions, cardStates]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Current active participants list based on mode
  const currentParticipants = settings.mode === 'team' ? teams : individuals;

  // Prepare questions and start game
  const handleStartGame = () => {
    let pool = [...QUESTIONS_BANK];

    if (settings.questionOrder === 'random') {
      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    const selected = pool.slice(0, settings.questionCount);
    // Assign clean display codes "01", "02", ... for consistent visual numbering
    const mappedQuestions = selected.map((q, idx) => ({
      ...q,
      code: String(idx + 1).padStart(2, '0'),
    }));

    setActiveQuestions(mappedQuestions);

    // Reset card states
    const initialCardStates: Record<number, QuestionCardState> = {};
    mappedQuestions.forEach((q) => {
      initialCardStates[q.id] = {
        questionId: q.id,
        status: 'unplayed',
      };
    });
    setCardStates(initialCardStates);

    // Reset participant scores and counts
    if (settings.mode === 'team') {
      setTeams((prev) =>
        prev.map((t) => ({ ...t, score: 0, answeredCount: 0, correctCount: 0 }))
      );
    } else {
      setIndividuals((prev) =>
        prev.map((p) => ({ ...p, score: 0, answeredCount: 0, correctCount: 0 }))
      );
    }

    setGameView('board');
  };

  // Reset all settings to defaults
  const handleResetDefaults = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Atur Ulang Pengaturan?',
      message: 'Seluruh pengaturan mode, nama peserta, dan parameter waktu akan dikembalikan ke kondisi awal bawaan.',
      confirmLabel: 'Ya, Atur Ulang',
      cancelLabel: 'Batal',
      isDestructive: true,
      onConfirm: () => {
        setSettings({
          mode: 'team',
          questionCount: 30,
          timerDuration: 45,
          questionOrder: 'random',
        });
        setTeams(createDefaultTeams(4));
        setIndividuals(createDefaultIndividuals());
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Click on a question card
  const handleCardClick = (question: Question) => {
    if (isGamePaused) {
      alert('Permainan sedang dijeda! Tekan tombol "Lanjut" di bagian atas untuk melanjutkan.');
      return;
    }

    // Double check that card is unplayed
    const state = cardStates[question.id];
    if (state && state.status !== 'unplayed') return;

    setSelectedQuestionForTurn(question);
  };

  // Participant chosen for turn
  const handleSelectParticipant = (participant: Participant) => {
    if (!selectedQuestionForTurn) return;

    // Lock card to 'playing'
    setCardStates((prev) => ({
      ...prev,
      [selectedQuestionForTurn.id]: {
        questionId: selectedQuestionForTurn.id,
        status: 'playing',
        answeredByParticipantId: participant.id,
        answeredByParticipantName: participant.name,
        answeredByParticipantColor: participant.color,
      },
    }));

    setTurnParticipant(participant);
    setIsQuestionModalOpen(true);
  };

  // Submit Answer
  const handleSubmitAnswer = (submittedAnswer: string, isTimeUp: boolean = false) => {
    if (!selectedQuestionForTurn || !turnParticipant) return;

    const question = selectedQuestionForTurn;
    const participant = turnParticipant;

    // Normalize comparison for grading
    const normalize = (val: string) =>
      val
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/,/g, '.');

    let isCorrect = false;
    if (!isTimeUp && submittedAnswer) {
      const cleanSub = normalize(submittedAnswer);
      const cleanCorrect = normalize(question.correctAnswer);

      if (cleanSub === cleanCorrect) {
        isCorrect = true;
      } else if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
        isCorrect = question.acceptableAnswers.some((ans) => normalize(ans) === cleanSub);
      }
    }

    const earnedPoints = isCorrect ? question.points : 0;

    // Permanently lock card to 'answered'
    setCardStates((prev) => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        status: 'answered',
        answeredByParticipantId: participant.id,
        answeredByParticipantName: participant.name,
        answeredByParticipantColor: participant.color,
        selectedAnswer: submittedAnswer,
        isCorrect,
        earnedPoints,
      },
    }));

    // Update participant score and counts
    const updateParticipants = (list: Participant[]) =>
      list.map((p) => {
        if (p.id === participant.id) {
          return {
            ...p,
            score: p.score + earnedPoints,
            answeredCount: p.answeredCount + 1,
            correctCount: p.correctCount + (isCorrect ? 1 : 0),
          };
        }
        return p;
      });

    if (settings.mode === 'team') {
      setTeams(updateParticipants);
    } else {
      setIndividuals(updateParticipants);
    }

    // Close question modal and open result modal
    setIsQuestionModalOpen(false);
    setAnswerResultData({
      question,
      participant,
      userAnswer: submittedAnswer,
      isCorrect,
      isTimeUp,
      earnedPoints,
    });
  };

  // Teacher manual score bonus from result modal or leaderboard
  const handleTeacherScoreAdjust = (participantId: string, delta: number) => {
    const updater = (list: Participant[]) =>
      list.map((p) => (p.id === participantId ? { ...p, score: Math.max(0, p.score + delta) } : p));

    if (settings.mode === 'team') {
      setTeams(updater);
    } else {
      setIndividuals(updater);
    }
  };

  // Return to board from answer result modal
  const handleReturnToBoardFromResult = () => {
    setAnswerResultData(null);
    setSelectedQuestionForTurn(null);
    setTurnParticipant(null);

    // Check if all questions are answered!
    const allAnswered = activeQuestions.every(
      (q) => cardStates[q.id]?.status === 'answered'
    );
    if (allAnswered) {
      setTimeout(() => {
        setGameView('result');
      }, 300);
    }
  };

  // Pick Next Unplayed Question
  const handleNextQuestion = () => {
    setAnswerResultData(null);
    setSelectedQuestionForTurn(null);
    setTurnParticipant(null);

    const nextUnplayed = activeQuestions.find(
      (q) => !cardStates[q.id] || cardStates[q.id].status === 'unplayed'
    );

    if (nextUnplayed) {
      setSelectedQuestionForTurn(nextUnplayed);
    } else {
      // All answered
      setGameView('result');
    }
  };

  // Reset Game in progress
  const handleResetGamePrompt = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset Permainan?',
      message: 'Apakah Anda yakin ingin mereset permainan ini? Seluruh kartu soal akan dibuka kembali dan skor akan dihitung dari 0.',
      confirmLabel: 'Ya, Reset Game',
      cancelLabel: 'Batal',
      isDestructive: true,
      onConfirm: () => {
        handleStartGame();
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Return to Menu Prompt
  const handleReturnToMenuPrompt = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Kembali ke Menu Pengaturan?',
      message: 'Progres pertempuran saat ini akan ditinggalkan dan Anda akan kembali ke menu pengaturan tim/peserta.',
      confirmLabel: 'Kembali ke Menu',
      cancelLabel: 'Lanjut Main',
      isDestructive: false,
      onConfirm: () => {
        setGameView('setup');
        setSelectedQuestionForTurn(null);
        setIsQuestionModalOpen(false);
        setAnswerResultData(null);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // End Game Early Prompt
  const handleEndGameEarly = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Akhiri Permainan Sekarang?',
      message: 'Permainan akan langsung diselesaikan dan papan podium juara akan ditampilkan berdasarkan skor saat ini.',
      confirmLabel: 'Lihat Hasil Akhir',
      cancelLabel: 'Lanjut Bertanding',
      isDestructive: false,
      onConfirm: () => {
        setGameView('result');
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Play Again with same teams/participants but fresh board
  const handlePlayAgain = () => {
    handleStartGame();
  };

  const usedQuestionsCount = activeQuestions.filter(
    (q) => cardStates[q.id]?.status === 'answered'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Global Header */}
      <Header
        mode={settings.mode}
        totalQuestions={activeQuestions.length}
        usedQuestionsCount={usedQuestionsCount}
        isPaused={isGamePaused}
        onTogglePause={() => setIsGamePaused(!isGamePaused)}
        onResetGame={handleResetGamePrompt}
        onReturnToMenu={handleReturnToMenuPrompt}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showHelp={showHelp}
        onToggleHelp={() => setShowHelp(!showHelp)}
        gameView={gameView}
      />

      {/* Main Game Stage */}
      <main className="flex-1 relative z-10 w-full flex flex-col">
        {/* VIEW 1: SETUP SCREEN */}
        {gameView === 'setup' && (
          <SetupScreen
            settings={settings}
            onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
            teams={teams}
            onUpdateTeams={setTeams}
            individuals={individuals}
            onUpdateIndividuals={setIndividuals}
            onStartGame={handleStartGame}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {/* VIEW 2: MAIN QUESTION BOARD ARENA */}
        {gameView === 'board' && (
          <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-5 flex flex-col">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start flex-1">
              {/* Question Board Grid (8 or 9 cols on large screen) */}
              <div className="xl:col-span-8 2xl:col-span-9 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-cyan-400 uppercase tracking-widest font-display">
                      PILIH KARTU SOAL:
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      (Sentuh nomor untuk membuka soal)
                    </span>
                  </div>

                  {/* End game early button for teachers */}
                  <button
                    type="button"
                    onClick={handleEndGameEarly}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors game-btn-3d"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Akhiri & Lihat Podium
                  </button>
                </div>

                <QuestionBoard
                  questions={activeQuestions}
                  cardStates={cardStates}
                  activeQuestionId={selectedQuestionForTurn?.id || null}
                  onCardClick={handleCardClick}
                />
              </div>

              {/* Real-Time Leaderboard Sidebar (4 or 3 cols) */}
              <div className="xl:col-span-4 2xl:col-span-3 xl:sticky xl:top-24">
                <Leaderboard
                  participants={currentParticipants}
                  mode={settings.mode}
                  onAdjustScore={handleTeacherScoreAdjust}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FINAL RESULTS & PODIUM */}
        {gameView === 'result' && (
          <ResultScreen
            participants={currentParticipants}
            mode={settings.mode}
            totalQuestions={activeQuestions.length}
            onPlayAgain={handlePlayAgain}
            onReturnToMenu={handleReturnToMenuPrompt}
            onResetGame={handleResetGamePrompt}
          />
        )}
      </main>

      {/* Modal 1: Participant Turn Selection Modal */}
      {selectedQuestionForTurn && !isQuestionModalOpen && !answerResultData && (
        <ParticipantSelectionModal
          question={selectedQuestionForTurn}
          mode={settings.mode}
          participants={currentParticipants}
          onSelectParticipant={handleSelectParticipant}
          onCancel={() => setSelectedQuestionForTurn(null)}
        />
      )}

      {/* Modal 2: Question & Timer Active Modal */}
      {isQuestionModalOpen && selectedQuestionForTurn && turnParticipant && (
        <QuestionModal
          question={selectedQuestionForTurn}
          participant={turnParticipant}
          timerDuration={settings.timerDuration}
          isGamePaused={isGamePaused}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )}

      {/* Modal 3: Answer Result & Explanation Modal */}
      {answerResultData && (
        <AnswerResultModal
          question={answerResultData.question}
          participant={answerResultData.participant}
          userAnswer={answerResultData.userAnswer}
          isCorrect={answerResultData.isCorrect}
          isTimeUp={answerResultData.isTimeUp}
          earnedPoints={answerResultData.earnedPoints}
          onReturnToBoard={handleReturnToBoardFromResult}
          onNextQuestion={handleNextQuestion}
          onAddTeacherBonus={handleTeacherScoreAdjust}
        />
      )}

      {/* Modal 4: Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        cancelLabel={confirmModalConfig.cancelLabel}
        isDestructive={confirmModalConfig.isDestructive}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Modal 5: Help & Touch Instructions Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
