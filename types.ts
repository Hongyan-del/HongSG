
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
  tenGod: string;
  hiddenStems: string[];
  naYin: string;
  changsheng: string; // 十二長生能量狀態
  perPillarShenSha?: string[]; // 該柱位觸發的神煞
}

export interface BaziData {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;
  elementsBalance: Record<string, number>;
}

export interface WisdomQuote {
  text: string;
  author: string;
  source: string;
}

export interface ZWDSPalaceInsight {
  palace: string;
  star: string;
  trait: string;
  function: string;
}

export interface BaziStructure {
  name: string;
  description: string;
  icon: string; // 識別符號，如 "☯️", "🔥", "🌊" 等
}

export interface FateReport {
  bazi: BaziData;
  baziStructure: BaziStructure; // 八字格局
  overallFortune: string;
  wealthLuck: string;
  careerLuck: string;
  loveLuck: string;
  personality: string;
  healthAdvice: string;
  currentCycle: string;
  characterTags: string[]; // 性格標籤雲
  shensha: string[]; // 神煞系統總結
  wisdomQuote: WisdomQuote; // 智慧語錄
  zwdsInsight: ZWDSPalaceInsight[]; // 紫微三合深入解析
}

export enum AppState {
  IDLE,
  RESULT
}
