export interface BonusQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

// The single source of truth for a bonus topic: its identity, its wheel
// segment's label/color, and the question pool it can present. The bonus
// wheel's segments are derived directly from this array (see
// `buildWheelSegments` in `utils/wheelGeometry.ts`) — there is no separate,
// hand-positioned list of wheel labels to keep in sync.
export interface BonusTopic {
  id: string;
  label: string;
  color: string;
  questions: BonusQuestion[];
}

export const bonusTopics: BonusTopic[] = [
  {
    id: 'probability',
    label: 'הסתברות',
    color: '#E7EDFD',
    questions: [
      { id: 'probability_1', question: 'אותו פרומפט יצר שתי תשובות שונות. מה נכון לעשות?', options: ['לבדוק כל תשובה מול הקריטריון', 'לבחור תמיד בראשונה', 'להניח שהארוכה נכונה'], correct: 0 },
    ],
  },
  {
    id: 'truth',
    label: 'אמת או בדיה',
    color: '#F3E8FF',
    questions: [
      { id: 'truth_1', question: 'תשובה נשמעת בטוחה. מה הופך אותה לאמינה?', options: ['השוואה למקור מתאים', 'כותרת גדולה', 'הרבה סימני קריאה'], correct: 0 },
    ],
  },
  {
    id: 'privacy',
    label: 'פרטיות',
    color: '#E3F5EC',
    questions: [
      { id: 'privacy_1', question: 'איזה פרט לא שולחים אם הוא לא נחוץ למשימה?', options: ['מספר טלפון אישי', 'פורמט רשימה', 'אורך שלושה משפטים'], correct: 0 },
    ],
  },
];

export function validateBonusRegistry(topics = bonusTopics): string[] {
  const errors: string[] = [];
  if (topics.length === 0) errors.push('חייב להיות לפחות נושא בונוס אחד');
  topics.forEach((topic) => { if (topic.questions.length === 0) errors.push(`לנושא ${topic.id} אין שאלות`); });
  if (new Set(topics.map((topic) => topic.id)).size !== topics.length) errors.push('מזהה נושא בונוס כפול');
  const allQuestionIds = topics.flatMap((topic) => topic.questions.map((question) => question.id));
  if (new Set(allQuestionIds).size !== allQuestionIds.length) errors.push('מזהה שאלת בונוס כפול');
  return errors;
}
