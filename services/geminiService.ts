
import { GoogleGenAI, Type } from "@google/genai";
import { BirthInfo, FateReport } from "../types";

// 偵錯顯示：如果環境變數缺失，則輸出指定錯誤
if (!process.env.API_KEY) {
  console.error("未偵測到環境變數，請檢查 Netlify 設定。");
}

/**
 * 根據使用者輸入產生唯一的整數種子值
 */
const generateSeedFromInfo = (info: BirthInfo): number => {
  const str = `${info.name}-${info.birthYear}-${info.birthMonth}-${info.birthDay}-${info.birthHour}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // 轉換為 32 位元整數
  }
  return Math.abs(hash);
};

export const getFateInterpretation = async (info: BirthInfo): Promise<FateReport> => {
  // 遵循規範：直接使用 process.env.API_KEY 初始化
  // 注意：SDK 規定必須使用 { apiKey: ... } 具名參數
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const seed = generateSeedFromInfo(info);
  
  const prompt = `你是一位精通八字算命與紫微斗數的東方命理大師。
  請針對以下生辰資訊進行精密的命理運算與解讀：
  姓名：${info.name}
  出生日期：國曆 ${info.birthYear}年${info.birthMonth}月${info.birthDay}日
  出生時辰：${info.birthHour}

  請以 JSON 格式回傳，包含八字（四柱）、紫微斗數主要宮位解讀、整體運勢、財運、事業、感情、健康建議以及目前大運。
  對於紫微斗數的每個宮位，請額外提供一個名為 'fortuneAdvice' 的欄位，內容為針對該宮位的『趨吉避凶』簡短建議。
  請確保內容充滿玄學神祕感且用詞優雅。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0,
      seed: seed,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bazi: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.OBJECT, properties: { heavenlyStem: { type: Type.STRING }, earthlyBranch: { type: Type.STRING }, element: { type: Type.STRING } }, required: ["heavenlyStem", "earthlyBranch", "element"] },
              month: { type: Type.OBJECT, properties: { heavenlyStem: { type: Type.STRING }, earthlyBranch: { type: Type.STRING }, element: { type: Type.STRING } }, required: ["heavenlyStem", "earthlyBranch", "element"] },
              day: { type: Type.OBJECT, properties: { heavenlyStem: { type: Type.STRING }, earthlyBranch: { type: Type.STRING }, element: { type: Type.STRING } }, required: ["heavenlyStem", "earthlyBranch", "element"] },
              hour: { type: Type.OBJECT, properties: { heavenlyStem: { type: Type.STRING }, earthlyBranch: { type: Type.STRING }, element: { type: Type.STRING } }, required: ["heavenlyStem", "earthlyBranch", "element"] },
              dayMaster: { type: Type.STRING },
              elementsBalance: { 
                type: Type.OBJECT, 
                properties: {
                  wood: { type: Type.NUMBER },
                  fire: { type: Type.NUMBER },
                  earth: { type: Type.NUMBER },
                  metal: { type: Type.NUMBER },
                  water: { type: Type.NUMBER }
                },
                required: ["wood", "fire", "earth", "metal", "water"]
              }
            },
            required: ["year", "month", "day", "hour", "dayMaster", "elementsBalance"]
          },
          palaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                keyStars: { type: Type.ARRAY, items: { type: Type.STRING } },
                luckRating: { type: Type.NUMBER },
                prediction: { type: Type.STRING },
                fortuneAdvice: { type: Type.STRING }
              },
              required: ["name", "description", "keyStars", "luckRating", "prediction", "fortuneAdvice"]
            }
          },
          overallFortune: { type: Type.STRING },
          wealthLuck: { type: Type.STRING },
          careerLuck: { type: Type.STRING },
          loveLuck: { type: Type.STRING },
          healthAdvice: { type: Type.STRING },
          currentCycle: { type: Type.STRING }
        },
        required: ["bazi", "palaces", "overallFortune", "wealthLuck", "careerLuck", "loveLuck", "healthAdvice", "currentCycle"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const askFollowUpQuestion = async (info: BirthInfo, report: FateReport, question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `
    你是一位溫和且專業的命理大師，現在要為使用者「${info.name}」解惑。
    使用者的命盤摘要如下：
    - 八字日主：${report.bazi.dayMaster}
    - 整體運勢評語：${report.overallFortune}
    使用者的提問是：「${question}」
    請以親切、易懂、白話文的方式回答。字數約 150-250 字。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    },
  });

  return response.text || "天機混亂，請再試一次。";
};
