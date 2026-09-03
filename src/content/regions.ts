import type { RegionId } from '../schemas/game';

export interface RegionDefinition {
  id: RegionId;
  name: string;
  villain: string;
  range: [number, number];
  color: string;
  tint: string;
  promise: string;
}

export const regions: RegionDefinition[] = [
  { id: 'recruitment', name: 'גיוס והדרכה', villain: 'תקלה בסימולטור', range: [1, 1], color: '#1E4FD8', tint: '#E7EDFD', promise: 'הפעילו את ליבת המטרה' },
  { id: 'fog_district', name: 'רובע הערפל', villain: 'מר בערך', range: [2, 7], color: '#4A5B7E', tint: '#EAEDF5', promise: 'הפכו בקשות עמומות לברורות' },
  { id: 'no_limits_factory', name: 'מפעל בלי גבולות', villain: 'עוד־ועוד', range: [8, 13], color: '#B8480C', tint: '#FDEBDB', promise: 'הציבו גבולות ובקרת איכות' },
  { id: 'command_maze', name: 'מבוך הפקודות', villain: 'תסבוכת', range: [14, 18], color: '#6A3FA8', tint: '#F0E9FB', promise: 'סדרו, בדקו ושפרו' },
  { id: 'certainty_tower', name: 'מגדל הוודאות', villain: 'ד״ר ודאות', range: [19, 22], color: '#0F6E6E', tint: '#E1F2F2', promise: 'אמתו מידע והגנו על פרטיות' },
  { id: 'finale', name: 'משימת הגמר', villain: 'המשבש', range: [23, 23], color: '#14171F', tint: '#F4EAD6', promise: 'חברו את כל כוחות הפרומפט' },
];

export const regionForBattle = (order: number) => regions.find((region) => order >= region.range[0] && order <= region.range[1]) ?? regions[0];
