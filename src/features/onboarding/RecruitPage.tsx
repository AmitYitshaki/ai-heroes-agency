import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Check, Radio, Sparkles } from 'lucide-react';
import type { CharacterId } from '../../schemas/game';
import { AppShell, Button, CharacterArt } from '../../components/ui';
import { useGame } from '../../state/GameContext';

export function RecruitPage() {
  const { progress, setCharacter, playCue } = useGame();
  const [choice, setChoice] = useState<CharacterId | null>(progress.characterId);
  const [briefing, setBriefing] = useState(false);
  const [panel, setPanel] = useState(0);
  const navigate = useNavigate();
  const choose = (id: CharacterId) => { setChoice(id); playCue('select'); };
  const continueFlow = () => { if (!choice) return; setCharacter(choice); setBriefing(true); };
  const panels = [
    { icon:<Radio />, title:'קריאת חירום', text:'ארבעת אזורי הסוכנות שובשו. בקשות עמומות מפעילות את לופּ בדרך הלא נכונה.' },
    { icon:<Bot />, title:'הכירו את לופּ-X', text:'לופּ מבצע לפי ההוראות והדפוסים שקיבל. הוא לא יודע אם תשובה נכונה — אתם בודקים.' },
    { icon:<Sparkles />, title:'כוח־העל שלכם', text:'כתבו הוראה, ראו כיצד לופּ מפרש אותה, ואז שפרו עד שהמשימה מצליחה.' },
  ];
  return <AppShell><section className="screen page-enter">
    {!briefing ? <>
      <header className="screen-heading"><span className="eyebrow">שלב 1 · גיוס</span><h1>בחרו דמות</h1><p>לשתי הדמויות אותם כוחות ואותו מסע.</p></header>
      <div className="hero-grid" role="radiogroup" aria-label="בחירת דמות">
        <button role="radio" aria-checked={choice === 'hero'} className={`hero-card ${choice === 'hero' ? 'selected' : ''}`} onClick={() => choose('hero')}><CharacterArt id="char_hero_selected" alt="גיבור־על במדי הסוכנות" /><strong>גיבור־על</strong>{choice === 'hero' && <span className="selected-label"><Check /> נבחר</span>}</button>
        <button role="radio" aria-checked={choice === 'heroine'} className={`hero-card ${choice === 'heroine' ? 'selected' : ''}`} onClick={() => choose('heroine')}><CharacterArt id="char_heroine_selected" alt="גיבורת־על במדי הסוכנות" /><strong>גיבורת־על</strong>{choice === 'heroine' && <span className="selected-label"><Check /> נבחר</span>}</button>
      </div>
      <div className="sticky-action"><Button disabled={!choice} onClick={continueFlow}>{choice ? 'לתדריך הגיוס' : 'בחרו דמות'}</Button></div>
    </> : <div className="briefing">
      <div className="briefing__art"><CharacterArt id="char_aleph_briefing" alt="מפקדת אלף מעבירה תדריך" /><div className="speech">{panels[panel].icon}<h1>{panels[panel].title}</h1><p>{panels[panel].text}</p></div></div>
      <div className="briefing__dots" aria-label={`פאנל ${panel + 1} מתוך 3`}>{panels.map((_,i)=><span key={i} className={i===panel?'active':''}/>)}</div>
      <Button onClick={() => panel < panels.length - 1 ? setPanel(panel + 1) : navigate('/battle/battle_01')}>{panel < panels.length - 1 ? 'המשיכו' : 'לקרב ההדרכה'}</Button>
      <Button variant="ghost" onClick={() => navigate('/battle/battle_01')}>דלגו לקרב</Button>
    </div>}
  </section></AppShell>;
}
