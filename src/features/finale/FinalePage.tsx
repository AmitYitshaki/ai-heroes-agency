import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Check, Map, RotateCcw, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { AppShell, Button, CharacterArt, Ltr, Stars } from '../../components/ui';
import { useGame } from '../../state/GameContext';
import { displayStars } from '../../engine/scoring';

export function FinalePage() {
  const { progress, playCue } = useGame();
  const navigate = useNavigate();
  const totalBattleHalf = Object.values(progress.battleBestHalfUnits).reduce((sum,value)=>sum+value,0);
  const unlocked = Boolean(progress.battleBestHalfUnits.battle_23);
  useEffect(() => { if (unlocked) playCue('ceremony'); }, [unlocked]);
  if (!unlocked) {
    return <AppShell><section className="screen locked-finale page-enter"><CharacterArt id="char_aleph_briefing" alt="מפקדת אלף ממתינה בסוכנות"/><h1>טקס ההסמכה עדיין נעול</h1><p>השלימו את משימת הגמר כדי לפתוח את התעודה.</p><Button onClick={()=>navigate(progress.nextBattleOrder === 23 ? '/battle/battle_23' : '/map')}><Map/> חזרה למשימה</Button></section></AppShell>;
  }
  const share = async () => { const data={title:'סוכנות גיבורי ה־AI',text:'סיימתי את ההכשרה בסוכנות גיבורי ה־AI! כוח־העל שלנו הוא לדעת לבקש.',url:location.origin}; try{if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(`${data.text} ${data.url}`)}catch{/* user cancelled */} };
  return <AppShell><section className="finale-page page-enter"><div className="ceremony"><Sparkles/><span className="eyebrow">טקס הסמכה</span><h1>המשימה הושלמה</h1><p>ארבעת האזורים חזרו לפעולה. הוכחתם שפרומפט טוב הוא התחלה — בדיקה ושיפור הופכים אותו לכלי שימושי.</p><div className="ceremony__characters"><CharacterArt id={progress.characterId==='heroine'?'char_heroine_victory':'char_hero_victory'} alt="הגיבור או הגיבורה חוגגים"/><CharacterArt id="char_aleph_celebration" alt="מפקדת אלף חוגגת את ההסמכה"/><CharacterArt id="char_loop_victory" alt="לופּ-X חוגג"/></div></div><article className="certificate"><Award/><span>סוכנות גיבורי ה־AI מעניקה בזאת הסמכה של</span><h2>מהנדס/ת פרומפטים צעיר/ה</h2><p>על בנייה, בדיקה ושיפור של הוראות AI באופן ברור, ביקורתי ובטוח.</p><div className="certificate__seal"><ShieldCheck/> כוח־העל שלכם הוא לדעת לבקש</div></article><section className="journey-summary"><h2>ארגז הכלים שלכם</h2><div className="skill-summary">{['מטרה ברורה','הקשר רלוונטי','אילוצים','פורמט','דוגמאות','קריטריון הצלחה','איטרציה','אימות ופרטיות'].map((skill)=><span key={skill}><Check/>{skill}</span>)}</div><div className="summary-numbers"><div><strong><Ltr>{Object.keys(progress.battleBestHalfUnits).length} / 23</Ltr></strong><span>קרבות</span></div><div><strong><Ltr>{displayStars(totalBattleHalf)}</Ltr></strong><span>כוכבי קרבות</span></div><div><strong><Ltr>{progress.completedBonusIds.length * 2}</Ltr></strong><span>כוכבי בונוס</span></div></div><div className="life-example"><h3>קחו את השיטה לחיים</h3><p>במקום „עזרו לי ללמוד”, נסו: „סכמו את הנושא בחמש נקודות, הוסיפו שאלת בדיקה, וציינו מה צריך לאמת במקור.”</p></div><div className="final-actions"><Button onClick={()=>{playCue('region');navigate('/map')}}><Map/> חזרה למפה</Button><Button variant="secondary" onClick={share}><Share2/> אתגרו חבר/ה</Button><Button variant="ghost" onClick={()=>navigate('/')}><RotateCcw/> מסך פתיחה</Button></div></section></section></AppShell>;
}
