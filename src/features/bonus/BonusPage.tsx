import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Gift, RotateCw, Sparkles } from 'lucide-react';
import { bonusTopics } from '../../content/bonus';
import { buildWheelSegments } from '../../utils/wheelGeometry';
import { AppShell, Button, Ltr } from '../../components/ui';
import { BonusWheel } from '../../components/BonusWheel';
import { useGame } from '../../state/GameContext';

export function BonusPage() {
  const { bonusId = '1' } = useParams();
  const parsedBonus = Number(bonusId);
  const visitIndex = Number.isFinite(parsedBonus) ? Math.min(2, Math.max(0, Math.floor(parsedBonus) - 1)) : 0;
  const visitBonusId = `bonus_${visitIndex + 1}`;
  const topic = useMemo(
    () => bonusTopics[Math.floor(Math.random() * bonusTopics.length)],
    [visitIndex],
  );
  const question = topic.questions[0];
  const segments = useMemo(() => buildWheelSegments(bonusTopics), []);
  const { progress, completeBonus, playCue } = useGame();
  const [spun, setSpun] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'success' | 'retry' | null>(
    progress.completedBonusIds.includes(visitBonusId) ? 'success' : null,
  );
  const navigate = useNavigate();
  const requiredBattle = [7, 13, 18][visitIndex];

  if (!progress.battleBestHalfUnits[`battle_${String(requiredBattle).padStart(2, '0')}`]) {
    return <AppShell><section className="screen guard"><Gift/><div><h1>הבונוס עדיין נעול</h1><p>השלימו קודם את קרב <Ltr>{requiredBattle}</Ltr>.</p><Button onClick={() => navigate('/map')}>חזרה למפה</Button></div></section></AppShell>;
  }

  const revealed = spun || result !== null;

  const check = () => {
    if (selected === question.correct) {
      completeBonus(visitBonusId);
      setResult('success');
      playCue('stars');
    } else {
      setResult('retry');
      playCue('feedback');
    }
  };

  return <AppShell><section className="screen bonus-page page-enter">
    <header className="screen-heading">
      <span className="eyebrow"><Gift/> שלב בונוס אופציונלי</span>
      <h1>{revealed ? `בונוס: ${topic.label}` : 'גלגל המשימה'}</h1>
      <p>הפרס קבוע וגלוי מראש: <strong><Ltr>+2</Ltr> כוכבים</strong>. הגלגל בוחר את הנושא, לא את הפרס.</p>
    </header>
    <div className="wheel-panel">
      {/* One wheel instance for the whole page: its `selectedSegmentId` prop
          goes from null to `topic.id` exactly once (on spin, or already-set
          on a reload after spinning), which is what drives the landing
          animation — see BonusWheel. */}
      <BonusWheel segments={segments} selectedSegmentId={revealed ? topic.id : null} reducedMotion={progress.settings.reducedMotion} />
      {!revealed && <Button onClick={() => { setSpun(true); playCue('region'); }}><RotateCw/> בחרו נושא</Button>}
    </div>
    {revealed && <div className="bonus-challenge">
      <span className="chosen-category"><Sparkles/> הנושא שנבחר: {topic.label}</span>
      <h2>{question.question}</h2>
      <div className="choice-grid">{question.options.map((option, index) => <button key={option} className={`power-card ${selected === index ? 'selected' : ''}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <span className="power-card__index"><Ltr>{String.fromCharCode(65 + index)}</Ltr></span>
        <strong>{option}</strong>{selected === index && <span className="card-state"><Check/> נבחר</span>}
      </button>)}</div>
      {result === 'retry' && <p className="help-note" role="alert">התשובה עדיין לא נשענת על בדיקה. נסו שוב.</p>}
      {result === 'success' ? <div className="bonus-success"><Gift/>
        <h2>{progress.completedBonusIds.includes(visitBonusId) ? 'הפרס כבר נאסף' : 'בונוס הושלם!'}</h2>
        <strong><Ltr>+2</Ltr> כוכבים</strong><p>העסקה נשמרת פעם אחת בלבד.</p>
        <Button onClick={() => navigate('/map')}>חזרה למפה</Button>
      </div> : <Button disabled={selected === null} onClick={check}>בדקו תשובה</Button>}
    </div>}
    <Button variant="ghost" onClick={() => navigate('/map')}>דלגו וחזרו למפה</Button>
  </section></AppShell>;
}
