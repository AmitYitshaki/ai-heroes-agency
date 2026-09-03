import type { CosmeticItem } from '../schemas/game';

export const cosmetics: CosmeticItem[] = [
  { itemId: 'head_signal', visitId: 1, slot: 'head', label: 'אנטנת אות', description: 'אנטנה כחולה עם ניצוץ זהב', priceHalfUnits: 10, swatch: '#1E4FD8' },
  { itemId: 'head_visor', visitId: 1, slot: 'head', label: 'מגן ראייה', description: 'מצחייה סגולה לסריקה', priceHalfUnits: 16, swatch: '#6A3FA8' },
  { itemId: 'head_crown', visitId: 1, slot: 'head', label: 'כתר תדרים', description: 'קשת זהב טכנולוגית', priceHalfUnits: 24, swatch: '#F0A81E' },
  { itemId: 'armor_mist', visitId: 2, slot: 'armor', label: 'שריון ערפל', description: 'לוחות כחולים בהירים', priceHalfUnits: 10, swatch: '#4A5B7E' },
  { itemId: 'armor_factory', visitId: 2, slot: 'armor', label: 'שריון מפעל', description: 'פסי נחושת חזקים', priceHalfUnits: 16, swatch: '#B8480C' },
  { itemId: 'armor_prism', visitId: 2, slot: 'armor', label: 'שריון מנסרה', description: 'לוחות סגולים מבריקים', priceHalfUnits: 24, swatch: '#6A3FA8' },
  { itemId: 'move_spark', visitId: 3, slot: 'movement', label: 'שובל ניצוץ', description: 'נקודות זהב בשיגור', priceHalfUnits: 10, swatch: '#F0A81E' },
  { itemId: 'move_wave', visitId: 3, slot: 'movement', label: 'גל תכלת', description: 'פס תנועה רגוע', priceHalfUnits: 16, swatch: '#0F6E6E' },
  { itemId: 'move_portal', visitId: 3, slot: 'movement', label: 'שער סגול', description: 'טבעת פיקסלים קצרה', priceHalfUnits: 24, swatch: '#6A3FA8' },
  { itemId: 'emblem_star', visitId: 4, slot: 'emblem', label: 'סמל כוכב', description: 'חותמת סוכנות מוזהבת', priceHalfUnits: 8, swatch: '#F0A81E' },
  { itemId: 'emblem_shield', visitId: 4, slot: 'emblem', label: 'סמל מגן', description: 'הילה ירוקה בטוחה', priceHalfUnits: 16, swatch: '#0F8A5F' },
  { itemId: 'emblem_hero', visitId: 4, slot: 'emblem', label: 'סמל גיבור', description: 'גלימת אור כחולה', priceHalfUnits: 24, swatch: '#1E4FD8' },
];

export const bonusQuestions = [
  { id: 'bonus_1', title: 'בונוס הסתברות', question: 'אותו פרומפט יצר שתי תשובות שונות. מה נכון לעשות?', options: ['לבדוק כל תשובה מול הקריטריון', 'לבחור תמיד בראשונה', 'להניח שהארוכה נכונה'], correct: 0 },
  { id: 'bonus_2', title: 'בונוס אמת או בדיה', question: 'תשובה נשמעת בטוחה. מה הופך אותה לאמינה?', options: ['השוואה למקור מתאים', 'כותרת גדולה', 'הרבה סימני קריאה'], correct: 0 },
  { id: 'bonus_3', title: 'בונוס פרטיות', question: 'איזה פרט לא שולחים אם הוא לא נחוץ למשימה?', options: ['מספר טלפון אישי', 'פורמט רשימה', 'אורך שלושה משפטים'], correct: 0 },
];
