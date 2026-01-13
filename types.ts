
export interface BirthInfo {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: string;
}

export interface BaziPillar {
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
}

export interface BaziData {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;
  elementsBalance: Record<string, number>;
}

export interface PalaceData {
  name: string;
  description: string;
  keyStars: string[];
  luckRating: number; // 1-100
  prediction: string;
  fortuneAdvice: string; // New field for "趨吉避凶"
}

export interface FateReport {
  bazi: BaziData;
  palaces: PalaceData[];
  overallFortune: string;
  wealthLuck: string;
  careerLuck: string;
  loveLuck: string;
  healthAdvice: string;
  currentCycle: string;
}

export enum AppState {
  IDLE,
  LOADING,
  RESULT
}
