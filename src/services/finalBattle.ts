import type { Battle23OutcomeKey } from '../schemas/game';

export type LocalGateCode = 'local_empty' | 'local_length' | 'local_invalid_characters' | 'local_pii_mission' | 'local_pii_pattern' | 'local_forbidden' | 'local_unknown_token' | 'local_out_of_scope';
export type LocalGateResult = { ok: true; normalizedText: string } | { ok: false; code: LocalGateCode; message: string };

const allowedWords = new Set(`שחזר שחזרו את לוח הלוח התכנית התוכנית תוכנית לפי מדריך המדריך בדיוק חמישה חמש חמשת שלבים השלבים שלב כרשימה רשימה ממוספרת ממוספרים וודא ודאו בדוק בדקו שכל כל מופיעים יופיעו בסדר הנכון בלבד על בסיס הפעלת לוחות פתיחת שערים תאורה חלוקת תגים בדיקת קשר בלי ללא תוספות מידע מאומת עובדות מהמדריך לופּ כדי שלנו הסוכנות צור צרו הכינו הכן כתוב כתבו והצג הציגו מתוך והקפד הקפידו לשמור שמור בלונים מופע הוסף הוסיפו לתכנית לתוכנית`.split(/\s+/));
const personalWords = /(?:שם|כתובת|טלפון|סיסמ(?:ה|ת)|אימייל|דוא״ל|רפואי|תעודת\s*זהות)/u;
const forbiddenWords = /(?:נשק|פגיעה|אלימות|סמים|פורנו|התאבד)/u;
const piiPattern = /(?:https?:\/\/|www\.|@|\b\d{6,}\b|\+?\d[\d\s-]{7,}\d)/u;

export function runLocalGate(input: string): LocalGateResult {
  if (typeof input !== 'string') return { ok: false, code: 'local_invalid_characters', message: 'הקלט אינו בפורמט טקסט.' };
  const normalizedText = input.normalize('NFKC').replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u206F]/gu, '').replace(/\s+/g, ' ').trim();
  if (!normalizedText) return { ok: false, code: 'local_empty', message: 'כתבו בקשה קצרה על משימת השחזור.' };
  if (normalizedText.length < 5 || normalizedText.length > 600) return { ok: false, code: 'local_length', message: 'הבקשה צריכה להכיל בין 5 ל־600 תווים.' };
  if (personalWords.test(normalizedText)) return { ok: false, code: 'local_pii_mission', message: 'נמצא סוג של מידע אישי. מחקו אותו וכתבו רק על המשימה.' };
  if (piiPattern.test(normalizedText)) return { ok: false, code: 'local_pii_pattern', message: 'נמצא דפוס שעלול להיות מידע אישי. מחקו אותו לפני השיגור.' };
  if (forbiddenWords.test(normalizedText)) return { ok: false, code: 'local_forbidden', message: 'הבקשה כוללת תוכן שאינו שייך למשימה. נסחו בקשה בטוחה.' };
  if (!/^[\u0590-\u05FF\s.,:;!?"'׳״־-]+$/u.test(normalizedText)) return { ok: false, code: 'local_invalid_characters', message: 'השתמשו במילים בעברית ובסימני פיסוק רגילים בלבד.' };
  const words = normalizedText.replace(/[.,:;!?"'׳״־-]/g, ' ').split(/\s+/).filter(Boolean);
  const unknown = words.find((word) => !allowedWords.has(word));
  if (unknown) return { ok: false, code: 'local_unknown_token', message: 'נמצאה מילה שאינה באוצר המשימה. נסחו בעזרת המילים שבמדריך.' };
  if (!words.some((word) => ['שחזר', 'שחזרו', 'תכנית', 'תוכנית', 'לוח'].includes(word))) return { ok: false, code: 'local_out_of_scope', message: 'כתבו בקשה שעוסקת בשחזור לוח התכנית.' };
  return { ok: true, normalizedText };
}

export interface FinalBattleClassifier { classify(normalizedText: string): Promise<Battle23OutcomeKey>; }

export class LocalFinalBattleClassifier implements FinalBattleClassifier {
  async classify(text: string): Promise<Battle23OutcomeKey> {
    if (/בלונים|מופע/u.test(text)) return 'unverified_information';
    if (!/שחזר|שחזרו/u.test(text) || !/מדריך|המדריך/u.test(text)) return 'unclear_goal_or_context';
    if (!/חמישה|חמש/u.test(text) || !/בדיוק/u.test(text)) return 'missing_constraint';
    if (!/ממוספרת|ממוספרים/u.test(text)) return 'missing_format';
    if (!/(וודא|וודאו|בדוק|בדקו)/u.test(text) || !/מופיעים|יופיעו/u.test(text)) return 'missing_success_criteria';
    return 'full_success';
  }
}

const networkOutcomes = new Set<Battle23OutcomeKey>(['unclear_goal_or_context', 'missing_constraint', 'missing_format', 'missing_success_criteria', 'unverified_information', 'full_success']);
export function validateClassifierOutcome(value: unknown): Battle23OutcomeKey { return typeof value === 'string' && networkOutcomes.has(value as Battle23OutcomeKey) ? value as Battle23OutcomeKey : 'unclear_goal_or_context'; }
