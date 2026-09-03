import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, MessageSquare, Radio, Sparkles } from 'lucide-react';
import type { CharacterId } from '../../schemas/game';
import { AppShell, Button, CharacterArt } from '../../components/ui';
import { useGame } from '../../state/GameContext';

export function RecruitPage() {
  const { progress, setCharacter, playCue } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  // A returning player can reach this same briefing again from Settings
  // ("מה זה פרומפט?") without re-picking a character or being sent into
  // battle_01 — see the two branches on `finish`/the ghost button below.
  const reviewOnly = Boolean((location.state as { briefingOnly?: boolean } | null)?.briefingOnly);
  const [choice, setChoice] = useState<CharacterId | null>(progress.characterId);
  const [briefing, setBriefing] = useState(reviewOnly);
  const [panel, setPanel] = useState(0);
  const choose = (id: CharacterId) => { setChoice(id); playCue('select'); };
  const continueFlow = () => { if (!choice) return; setCharacter(choice); setBriefing(true); };
  const finish = () => (reviewOnly ? navigate(-1) : navigate('/battle/battle_01'));
  const panels: Array<{ icon: ReactNode; title: string; text: ReactNode }> = [
    {
      icon: <Radio />,
      title: 'קריאת חירום',
      text: 'ארבעת אזורי הסוכנות שובשו כי בקשות היו עמומות מדי. לכל גיבור יש כוח־על, ושלכם הוא לדעת לבקש בבירור.',
    },
    {
      icon: <MessageSquare />,
      title: 'מה זה פרומפט?',
      text: <>פרומפט הוא ההוראה שאתם נותנים ל־AI. ככל שהיא ברורה יותר, כך התוצאה שימושית יותר.<br /><strong>חלש:</strong> „תעזור לי”. <strong>טוב יותר:</strong> „הסבירו בשלושה צעדים איך להתכונן למבחן”.</>,
    },
    {
      icon: <Sparkles />,
      title: 'כוח־העל שלכם',
      text: 'בכל משימה תוסיפו מטרה, הקשר, כללים ופורמט ברור, ותבדקו ותשפרו את התוצאה. לופּ־X מבצע בדיוק את מה שתבקשו — אז בואו נלמד לבקש כמו מהנדסי פרומפטים.',
    },
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
      <div className="briefing__dots" aria-label={`פאנל ${panel + 1} מתוך ${panels.length}`}>{panels.map((_, i) => <span key={i} className={i === panel ? 'active' : ''} />)}</div>
      <Button onClick={() => panel < panels.length - 1 ? setPanel(panel + 1) : finish()}>{panel < panels.length - 1 ? 'המשיכו' : reviewOnly ? 'הבנתי' : 'לקרב ההדרכה'}</Button>
      <Button variant="ghost" onClick={() => reviewOnly ? navigate(-1) : navigate('/battle/battle_01')}>{reviewOnly ? 'סגרו' : 'דלגו לקרב'}</Button>
    </div>}
  </section></AppShell>;
}
