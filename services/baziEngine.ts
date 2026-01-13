
import { BirthInfo, FateReport, BaziData, BaziPillar, ZWDSPalaceInsight, BaziStructure } from "../types";
import { 
  STEMS_DATA, 
  BRANCHES_DATA, 
  SI_HUA_TABLE, 
  CHANGSHENG_TABLE, 
  WISDOM_LIBRARY, 
  ZWDS_STARS_DATA,
  DM_ESSENCE_FRAGMENTS,
  SEASON_CONTEXT,
  PALACES_DATA,
  BAZI_LOGIC_MATRIX,
  ADVANCED_BAZI_DB,
  ADVANCED_ZIWEI_DB,
  TEN_GODS_DETAILED_DATA,
  WEALTH_SYNTHESIS_DB,
  CAREER_SYNTHESIS_DB,
  SHEN_SHA_RULES
} from "../constants";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const getTenGod = (dmStem: string, targetStem: string): string => {
  const dmIdx = STEMS.indexOf(dmStem);
  const targetIdx = STEMS.indexOf(targetStem);
  const dmYinYang = dmIdx % 2;
  const targetYinYang = targetIdx % 2;
  const elements = ["木", "火", "土", "金", "水"];
  const dmEIdx = elements.indexOf(STEMS_DATA[dmStem as keyof typeof STEMS_DATA].element);
  const targetEIdx = elements.indexOf(STEMS_DATA[targetStem as keyof typeof STEMS_DATA].element);
  const diff = (targetEIdx - dmEIdx + 5) % 5;

  switch (diff) {
    case 0: return dmYinYang === targetYinYang ? "比肩" : "劫財";
    case 1: return dmYinYang === targetYinYang ? "食神" : "傷官";
    case 2: return dmYinYang === targetYinYang ? "偏財" : "正財";
    case 3: return dmYinYang === targetYinYang ? "七殺" : "正官";
    case 4: return dmYinYang === targetYinYang ? "偏印" : "正印";
    default: return "未知";
  }
};

const identifyBaziStructure = (bazi: BaziData): BaziStructure => {
  const allTenGods = [bazi.year.tenGod, bazi.month.tenGod, bazi.day.tenGod, bazi.hour.tenGod];
  const dmElement = STEMS_DATA[bazi.dayMaster as keyof typeof STEMS_DATA].element;
  const season = BRANCHES_DATA[bazi.month.earthlyBranch as keyof typeof BRANCHES_DATA].season;

  if (allTenGods.includes("傷官") && (allTenGods.includes("正印") || allTenGods.includes("偏印"))) {
    return { name: "傷官配印", description: "才華橫溢且內斂深沈，能將創意轉化為實質成就。", icon: "📜" };
  }
  if (allTenGods.includes("食神") && (allTenGods.includes("正財") || allTenGods.includes("偏財"))) {
    return { name: "食神生財", description: "生財有道，處事圓融且具備優雅的生活品味。", icon: "💰" };
  }
  if (allTenGods.includes("七殺") && (allTenGods.includes("正印") || allTenGods.includes("偏印"))) {
    return { name: "殺印相生", description: "化壓力為動力，具備強大的權威感與解決困難的能力。", icon: "🛡️" };
  }
  if ((allTenGods.includes("正財") || allTenGods.includes("偏財")) && allTenGods.includes("正官")) {
    return { name: "財官雙美", description: "名利雙收之象，具備極佳的社會地位與物質基礎。", icon: "👑" };
  }
  if (dmElement === "金" && season === "秋" && bazi.elementsBalance["火"] > 200) {
    return { name: "火煉秋金", description: "在磨練中成就卓越，性格剛毅，具備極強的競爭力。", icon: "🔥" };
  }
  if (dmElement === "木" && bazi.elementsBalance["水"] > 300) {
    return { name: "水木清華", description: "氣質清高，充滿智慧與創造力，思想純淨而深遠。", icon: "🌊" };
  }

  return { name: "中和格局", description: "性格平穩，具備極佳的調和能力與穩定發展的潛力。", icon: "☯️" };
};

const determineStrength = (bazi: BaziData): 'strong' | 'weak' => {
  const dmElement = STEMS_DATA[bazi.dayMaster as keyof typeof STEMS_DATA].element;
  const supports = {
    "木": ["木", "水"], "火": ["火", "木"], "土": ["土", "火"], "金": ["金", "土"], "水": ["水", "金"]
  }[dmElement as '木'|'火'|'土'|'金'|'水'];

  let score = 0;
  if (supports.includes(bazi.month.element)) score += 40;
  const dayBranchElement = BRANCHES_DATA[bazi.day.earthlyBranch as keyof typeof BRANCHES_DATA].element;
  if (supports.includes(dayBranchElement)) score += 20;
  if (supports.includes(bazi.year.element)) score += 10;
  if (supports.includes(bazi.hour.element)) score += 10;
  
  const totalBalance = bazi.elementsBalance;
  const selfEnergy = supports.reduce((acc, el) => acc + (totalBalance[el] || 0), 0);
  if (selfEnergy > 550) score += 20;

  return score >= 50 ? 'strong' : 'weak';
};

const calculateZWDSInsight = (monthIdx: number, hourIdx: number, yearStem: string, dayStem: string): ZWDSPalaceInsight[] => {
  const stars = Object.keys(ZWDS_STARS_DATA);
  const lifePos = (monthIdx + 12 - hourIdx) % 12;
  const yearSihua = SI_HUA_TABLE[yearStem as keyof typeof SI_HUA_TABLE];

  const palaceConfigs = [
    { name: '命宮', offset: 0, icon: '🏛️' },
    { name: '財帛宮', offset: 8, icon: '🪙' },
    { name: '官祿宮', offset: 4, icon: '📜' },
    { name: '遷移宮', offset: 6, icon: '🌍' },
    { name: '福德宮', offset: 10, icon: '✨' },
    { name: '田宅宮', offset: 9, icon: '🏠' }
  ];

  return palaceConfigs.map(conf => {
    const pos = (lifePos + conf.offset) % 12;
    const starName = stars[pos % stars.length];
    const starData = ZWDS_STARS_DATA[starName];
    const palaceData = PALACES_DATA[conf.name as keyof typeof PALACES_DATA] || { function: "宮位深層感應中。", personality: "代表生命特定領域的動能。", connection: "與整體命運交織。" };
    const changsheng = CHANGSHENG_TABLE[dayStem][BRANCHES[pos]];

    // 檢查四化
    let sihuaTag = "";
    if (yearSihua.lu === starName) sihuaTag = "化祿";
    if (yearSihua.quan === starName) sihuaTag = "化權";
    if (yearSihua.ke === starName) sihuaTag = "化科";
    if (yearSihua.ji === starName) sihuaTag = "化忌";

    // 匹配資料庫順序
    const sihuaKey = `${conf.name}_${starName}_${sihuaTag}`;
    const advStatusKey = `${conf.name}_${starName}_${changsheng}`;
    const basicAdvKey = `命宮_${starName}_${changsheng}`;

    let mainTraitContent = "";
    if (sihuaTag && ADVANCED_ZIWEI_DB[sihuaKey]) {
      mainTraitContent = ADVANCED_ZIWEI_DB[sihuaKey].content;
    } else if (ADVANCED_ZIWEI_DB[advStatusKey]) {
      mainTraitContent = ADVANCED_ZIWEI_DB[advStatusKey].content;
    } else if (ADVANCED_ZIWEI_DB[basicAdvKey]) {
      mainTraitContent = ADVANCED_ZIWEI_DB[basicAdvKey].content;
    } else {
      mainTraitContent = `主星「${starName}」在${conf.name}，代表您的「${starData.keyword}」能量正處於「${changsheng}」的動態循環中。這意味著您在處理${conf.name}相關事務時，傾向於${starData.traits.split('。')[0]}。`;
    }

    const detailedTrait = `
【${conf.name}解析：${starName}${sihuaTag ? ' · ' + sihuaTag : ''}】
${mainTraitContent}

【星曜特徵：${starData.keyword}】
${starData.traits}

【宮位職能】
${palaceData.function} ${palaceData.personality}

【能量狀態：${changsheng}位】
目前該宮位處於「${changsheng}」階段，象徵著該領域的動能${
      changsheng === '長生' ? '正蓬勃發展，生氣盎然' :
      changsheng === '沐浴' ? '帶有某種不穩定的魅力與轉化' :
      changsheng === '冠帶' ? '正趨於成熟，展現競爭力' :
      changsheng === '臨官' ? '進入穩定高峰，具備掌控力' :
      changsheng === '帝旺' ? '達到極致，需防物極必反' :
      changsheng === '衰' ? '趨於守成，智慧重於行動' :
      changsheng === '病' ? '能量波動，需防範過度內耗' :
      changsheng === '死' ? '極度沈潛，是醞釀重生的終點' :
      changsheng === '墓' ? '內斂儲藏，適合厚積薄發' :
      changsheng === '絕' ? '看似無路，實則醞釀全新的可能' :
      changsheng === '胎' ? '如胎胞孕育，充滿未知希望' : '正在緩緩恢復，具備耐力'
    }。
    `.trim();

    return {
      palace: conf.name,
      star: starName + (sihuaTag ? ` (${sihuaTag})` : ""),
      trait: detailedTrait,
      function: starData.function
    };
  });
};

const getShenShaForBranch = (branch: string, dayStem: string, yearBranch: string, dayBranch: string): string[] => {
  const result: string[] = [];
  
  // 天乙貴人 (依日主查全盤支)
  const guiRenBranches = SHEN_SHA_RULES["天乙貴人"][dayStem as keyof typeof SHEN_SHA_RULES["天乙貴人"]];
  if (guiRenBranches?.includes(branch)) result.push("天乙貴人");
  
  // 驛馬 (依年支/日支查全盤支)
  if (SHEN_SHA_RULES["驛馬"][yearBranch as keyof typeof SHEN_SHA_RULES["驛馬"]] === branch) result.push("驛馬");
  if (SHEN_SHA_RULES["驛馬"][dayBranch as keyof typeof SHEN_SHA_RULES["驛馬"]] === branch) result.push("驛馬");

  // 桃花 (依年支/日支查全盤支)
  if (SHEN_SHA_RULES["桃花"][yearBranch as keyof typeof SHEN_SHA_RULES["桃花"]] === branch) result.push("桃花");
  if (SHEN_SHA_RULES["桃花"][dayBranch as keyof typeof SHEN_SHA_RULES["桃花"]] === branch) result.push("桃花");

  // 華蓋 (依年支/日支查全盤支)
  if (SHEN_SHA_RULES["華蓋"][yearBranch as keyof typeof SHEN_SHA_RULES["華蓋"]] === branch) result.push("華蓋");
  if (SHEN_SHA_RULES["華蓋"][dayBranch as keyof typeof SHEN_SHA_RULES["華蓋"]] === branch) result.push("華蓋");

  return [...new Set(result)];
};

export const calculateBazi = (info: BirthInfo): FateReport => {
  const date = new Date(info.birthYear, info.birthMonth - 1, info.birthDay);
  const jd = Math.floor(date.getTime() / 86400000) + 2440588;
  const yearOffset = info.birthYear - 1900;
  const yearStem = STEMS[(yearOffset + 6) % 10];
  const yearBranch = BRANCHES[(yearOffset + 0) % 12];
  const monthIdx = (info.birthMonth + 1) % 12;
  const monthStem = STEMS[(yearOffset * 12 + info.birthMonth + 1) % 10];
  const monthBranch = BRANCHES[monthIdx];
  const dayOffset = jd - 2415021;
  const dayStem = STEMS[dayOffset % 10];
  const dayBranch = BRANCHES[dayOffset % 12];
  const hourChar = info.birthHour.charAt(0);
  const safeHourIdx = BRANCHES.indexOf(hourChar) === -1 ? 0 : BRANCHES.indexOf(hourChar);
  const hourStem = STEMS[(dayOffset % 5 * 2 + safeHourIdx) % 10];
  const hourBranch = BRANCHES[safeHourIdx];

  const balance: Record<string, number> = { "木": 0, "火": 0, "土": 0, "金": 0, "水": 0 };
  const pillars_raw = [{ s: yearStem, b: yearBranch }, { s: monthStem, b: monthBranch }, { s: dayStem, b: dayBranch }, { s: hourStem, b: hourBranch }];
  
  pillars_raw.forEach(p => {
    balance[STEMS_DATA[p.s as keyof typeof STEMS_DATA].element] += 100;
    BRANCHES_DATA[p.b as keyof typeof BRANCHES_DATA].hidden.forEach(h => {
      balance[STEMS_DATA[h.s as keyof typeof STEMS_DATA].element] += h.w;
    });
  });

  const createPillar = (s: string, b: string): BaziPillar => ({
    heavenlyStem: s, earthlyBranch: b, element: STEMS_DATA[s as keyof typeof STEMS_DATA].element,
    tenGod: s === dayStem ? "日主" : getTenGod(dayStem, s),
    hiddenStems: BRANCHES_DATA[b as keyof typeof BRANCHES_DATA].hidden.map(h => h.s),
    naYin: "五行之氣",
    changsheng: CHANGSHENG_TABLE[dayStem][b],
    perPillarShenSha: getShenShaForBranch(b, dayStem, yearBranch, dayBranch)
  });

  const bazi: BaziData = {
    year: createPillar(yearStem, yearBranch), month: createPillar(monthStem, monthBranch),
    day: createPillar(dayStem, dayBranch), hour: createPillar(hourStem, hourBranch),
    dayMaster: dayStem, elementsBalance: balance
  };

  const strength = determineStrength(bazi);
  const baziStructure = identifyBaziStructure(bazi);
  const seasonName = BRANCHES_DATA[monthBranch as keyof typeof BRANCHES_DATA].season;
  const dmElement = STEMS_DATA[dayStem as keyof typeof STEMS_DATA].element;
  const zwdsInsight = calculateZWDSInsight(monthIdx, safeHourIdx, yearStem, dayStem);
  
  // 十神動力學統計與解析
  const tenGodCounts: Record<string, number> = {};
  [bazi.year.tenGod, bazi.month.tenGod, bazi.day.tenGod, bazi.hour.tenGod].forEach(tg => {
    if (tg !== "日主") tenGodCounts[tg] = (tenGodCounts[tg] || 0) + 1;
  });
  const dominantTenGod = Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const tenGodInsight = dominantTenGod && TEN_GODS_DETAILED_DATA[dominantTenGod] 
    ? `\n\n【十神動力學：${dominantTenGod}主導】\n您的命盤中「${dominantTenGod}」能量顯著。${TEN_GODS_DETAILED_DATA[dominantTenGod].trait}。在行為模式上，${TEN_GODS_DETAILED_DATA[dominantTenGod].behavior}\n針對您${dayStem}命（${dmElement}主）的感應：${TEN_GODS_DETAILED_DATA[dominantTenGod].elementNuance[dmElement] || ""}`
    : "";

  // 神煞匯總
  const allShenSha = [
    ...(bazi.year.perPillarShenSha || []),
    ...(bazi.month.perPillarShenSha || []),
    ...(bazi.day.perPillarShenSha || []),
    ...(bazi.hour.perPillarShenSha || [])
  ];
  const uniqueShenSha = [...new Set(allShenSha)];

  // 資源掌控 (Wealth) 合成解析
  const wealthStar = zwdsInsight[1].star.split(' ')[0];
  const wealthTenGod = tenGodCounts["正財"] ? "正財" : (tenGodCounts["偏財"] ? "偏財" : "");
  const wealthKey = `${wealthStar}_${wealthTenGod}`;
  const wealthLuckText = WEALTH_SYNTHESIS_DB[wealthKey] || 
    `【資源獲取特質】結合紫微財帛宮主星「${wealthStar}」與八字財星能量，您的資源掌控傾向於「${ZWDS_STARS_DATA[wealthStar]?.keyword || '穩健模式'}」。\n建議：${wealthTenGod === '偏財' ? '關注市場波動與資訊差帶來的機會。' : '建立標準化的體系，追求長期穩定的現金流。'}`;

  // 職場位能 (Career) 合成解析
  const careerStar = zwdsInsight[2].star.split(' ')[0];
  const careerTenGod = tenGodCounts["正官"] ? "正官" : (tenGodCounts["七殺"] ? "七殺" : "");
  const careerKey = `${careerStar}_${careerTenGod}`;
  const careerLuckText = CAREER_SYNTHESIS_DB[careerKey] || 
    `【職場行為模式】紫微官祿宮主星「${careerStar}」反映了您的工作姿態，結合八字官殺能量，展現出「${ZWDS_STARS_DATA[careerStar]?.keyword || '專業化'}」的位能。\n引導：${careerTenGod === '七殺' ? '在充滿挑戰與開創性的職能中更能發揮潛力。' : '在制度完善、具備明確晉升路徑的體系中更容易獲得認可。'}`;

  const advBaziKey = `${dayStem}_${dayBranch}_${CHANGSHENG_TABLE[dayStem][dayBranch]}`;
  const advMatch = ADVANCED_BAZI_DB[advBaziKey];
  
  const baziMatrixKey = `${dayStem}_${seasonName}_${strength}`;
  const baziDefaultMatch = BAZI_LOGIC_MATRIX[baziMatrixKey];
  const personalityText = (advMatch ? advMatch.content : (baziDefaultMatch ? baziDefaultMatch.content : `【${strength === 'strong' ? '身強' : '身弱'}】${DM_ESSENCE_FRAGMENTS[dayStem]?.[strength]}`)) + tenGodInsight;
  
  const sortedBValues = (Object.values(balance) as number[]).sort((a, b) => b - a);
  const diff = sortedBValues[0] - sortedBValues[4];
  const isTurningPoint = diff > 450 || info.birthYear % 10 === 0;
  const quoteType = isTurningPoint ? 'TURNING' : (diff > 350 ? 'IMBALANCE' : 'STABLE');
  const quote = WISDOM_LIBRARY[quoteType][Math.floor(Math.random() * WISDOM_LIBRARY[quoteType].length)];

  const overallFortuneStrategy = `
【格局應用：星能化合】
您的核心命格由日主「${dayStem}」坐「${dayBranch}」與紫微命宮「${zwdsInsight[0].star}」共同建構。
在「${baziStructure.name}」的格局引導下，展現出「${ZWDS_STARS_DATA[zwdsInsight[0].star.split(' ')[0]].keyword}」的生命底色。
這意味著您的靈魂藍圖不僅具備強大的開創性，更因「${baziStructure.name}」的結構加持，而擁有獨特的世俗競爭優勢。
${personalityText}
  `.trim();

  const healthAdviceText = `
【生命指引：修煉與平衡全書】

【命主原型深度解析：${dayStem}命之${strength === 'strong' ? '盛' : '柔'}】
您的生命本質如同${dayStem === '甲' ? '參天大樹，充滿向上的動能與韌性，但在大風中需防折損。' : dayStem === '乙' ? '靈動之藤，適應力極強，擅長以柔克剛，但需尋求穩固的支柱。' : dayStem === '丙' ? '烈日當空，熱情能照亮他人，但能量過度發散時易灼傷自我。' : dayStem === '丁' ? '文明之火，內遷而持久，是引導靈魂的燭光，但需防範內耗陰火。' : dayStem === '戊' ? '厚重泰山，穩如磐石，是眾人的依靠，但過於固執則會阻礙變革。' : dayStem === '己' ? '豐饒之地，包容萬物，具備極佳的耕耘力，但需防優柔寡斷。' : dayStem === '庚' ? '開山之斧，執行力與果斷力是您的利器，但需透過修煉來去其戾氣。' : dayStem === '辛' ? '璀璨珠寶，精緻且自尊心強，追求極致的美感，但學會適度示弱。' : dayStem === '壬' ? '奔騰江河，胸懷大志且充滿智慧，但水無定形，需明確的堤防引導。' : '連綿雨露，感性而滋潤萬物，具備驚人的洞察力，但心緒易隨環境波動。'}
格局識別：【${baziStructure.name}】。${advMatch ? '特定感應：' + advMatch.content : ''}

【月令時空脈絡：${seasonName}季之動能】
出生於「${monthBranch}」月，${SEASON_CONTEXT[monthBranch]}。
此時空的初始頻率與您的紫微命宮「${zwdsInsight[0].star}」產生了深刻的共振。這種編碼不僅決定了您的性格，更在您面對人生轉捩點時，提供了一套與生俱來的緩衝與應變機制。

【能量平衡策略與終極修煉】
目前的能量雷達反映出您的五行分佈正處於「${isTurningPoint ? '關鍵的生命轉折期' : '穩定的自我優化期'}」。
針對您的【${baziStructure.name}】格局建議如下：
${strength === 'strong' 
  ? '由於能量充沛，容易陷入「過度掌控」的陷阱。稻盛和夫先生提倡的「利他之心」是您當前最重要的修煉。在事業高峰期懂得「謙虛」與「讓利」，反而能建立更強大的社會護城河。請練習放下對結果的絕對執著。' 
  : '由於能量內斂，在執行大型計畫時常感到心力交瘁。查理·蒙格的「安全邊際」思維是您的生存指南。學會專注於自己的「能力圈」，在優勢領域內發動精確打擊，而非盲目消耗。借力使力，依附穩定的架構。'
}

【哲學實踐指南】
${quote.author}在《${quote.source}》中曾言：「${quote.text}」。
這份智慧正是為您當下的局勢量身打造。當您的內在良知（紫微原型）與外在行動（八字格局）達成知行合一，命運的枷鎖便會轉化為通往自由的階梯。
  `.trim();

  return {
    bazi,
    baziStructure,
    personality: personalityText,
    overallFortune: overallFortuneStrategy,
    wealthLuck: wealthLuckText,
    careerLuck: careerLuckText,
    loveLuck: `【人際指引】身處「${bazi.day.changsheng}」位，與遷移宮「${zwdsInsight[3].star}」形成對應。`,
    healthAdvice: healthAdviceText,
    currentCycle: `當前修煉：${quote.text}`,
    characterTags: advMatch ? advMatch.tags : (baziDefaultMatch ? baziDefaultMatch.tags : ['強勢', '韌性']),
    shensha: uniqueShenSha,
    wisdomQuote: quote,
    zwdsInsight
  };
};
