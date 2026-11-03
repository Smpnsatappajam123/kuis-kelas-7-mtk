import { Participant } from '../types/game';

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
  badgeBg: string;
}

export const TEAM_COLORS: ColorPreset[] = [
  {
    id: 'blue',
    name: 'Biru Elektrik',
    hex: '#2563EB',
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
    glowClass: 'shadow-blue-500/50',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'red',
    name: 'Merah Bara',
    hex: '#EF4444',
    bgClass: 'bg-red-600',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
    glowClass: 'shadow-red-500/50',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
  {
    id: 'amber',
    name: 'Kuning Emas',
    hex: '#F59E0B',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-400',
    glowClass: 'shadow-amber-500/50',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'emerald',
    name: 'Hijau Zamrud',
    hex: '#10B981',
    bgClass: 'bg-emerald-600',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/50',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'purple',
    name: 'Ungu Nebula',
    hex: '#8B5CF6',
    bgClass: 'bg-purple-600',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
    glowClass: 'shadow-purple-500/50',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'pink',
    name: 'Merah Muda',
    hex: '#EC4899',
    bgClass: 'bg-pink-600',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-400',
    glowClass: 'shadow-pink-500/50',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  {
    id: 'cyan',
    name: 'Cyan Samudra',
    hex: '#06B6D4',
    bgClass: 'bg-cyan-600',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
    glowClass: 'shadow-cyan-500/50',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 'orange',
    name: 'Oranye Berapi',
    hex: '#F97316',
    bgClass: 'bg-orange-600',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
    glowClass: 'shadow-orange-500/50',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
];

export const DEFAULT_TEAM_NAMES = [
  'Tim Garuda',
  'Tim Rajawali',
  'Tim Harimau',
  'Tim Elang',
  'Tim Singa',
  'Tim Badak',
  'Tim Laskar',
  'Tim Bintang',
];

export const DEFAULT_INDIVIDUAL_NAMES = [
  'Ahmad',
  'Budi',
  'Citra',
  'Dewi',
  'Eko',
  'Fajar',
];

export function createDefaultTeams(count: number): Participant[] {
  const safeCount = Math.min(Math.max(count, 2), 8);
  return Array.from({ length: safeCount }).map((_, index) => {
    const color = TEAM_COLORS[index % TEAM_COLORS.length];
    return {
      id: `team-${index + 1}`,
      name: DEFAULT_TEAM_NAMES[index] || `Kelompok ${index + 1}`,
      color: color.hex,
      bgClass: color.bgClass,
      borderClass: color.borderClass,
      textClass: color.textClass,
      avatarIcon: `${index + 1}`,
      score: 0,
      answeredCount: 0,
      correctCount: 0,
    };
  });
}

export function createDefaultIndividuals(): Participant[] {
  return DEFAULT_INDIVIDUAL_NAMES.map((name, index) => {
    const color = TEAM_COLORS[index % TEAM_COLORS.length];
    return {
      id: `player-${index + 1}`,
      name,
      color: color.hex,
      bgClass: color.bgClass,
      borderClass: color.borderClass,
      textClass: color.textClass,
      avatarIcon: name.charAt(0),
      score: 0,
      answeredCount: 0,
      correctCount: 0,
    };
  });
}
