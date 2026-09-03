import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Gift, RotateCw, Sparkles } from 'lucide-react';
import { bonusTopics, availableTopicsForSpin } from '../../content/bonus';
import { buildWheelSegments } from '../../utils/wheelGeometry';
import type { BonusSelection } from '../../schemas/game';
import { AppShell, Button, Ltr } from '../../components/ui';
import { BonusWheel } from '../../components/BonusWheel';
import { useGame } from '../../state/GameContext';

export function BonusPage() {
  const { bonusId = '1' } = useParams();
  const parsedBonus = Number(bonusId);
  const visitIndex = Number.isFinite(parsedBonus) ? Math.min(2, Math.max(0, Math.floor(parsedBonus) - 1)) : 0;
  const visitBonusId = `bonus_${visitIndex + 1}`;
  const { progress, chooseBonusTopic, completeBonus, playCue } = useGame();

  // Topics chosen for *other* visits this journey (this visit's own entry,
  // if any, is deliberately excluded here so the wheel it already landed on
  // still contains that segment after a refresh).
  const usedTopicIds = Object.entries(progress.bonusSelections)
    .filter(([id]) => id !== visitBonusId)
    .map(([, entry]) => entry.topicId);
  const availableTopics = availableTopicsForSpin(bonusTopics, usedTopicIds);
  const segments = buildWheelSegments(availableTopics);

  // A selection already recorded for this visit (from an earlier spin this
  // session, or restored after a refresh) is read once at mount and never
  // re-drawn — spinning again on the same visit is not offered once this is
  // set. `completedBonusIds` can only ever be set together with a recorded
  // selection going forward; the fallback below only matters for a save
  // written before this field existed.
  //
  // `alreadyCompleted` is captured once at mount, not re-derived from the
  // live `progress` on every render: this visit's own `check()` call below
  // updates `progress.completedBonusIds` and local `result` together in the
  // same batched render, so a live re-check here would make the "just
  // completed" screen misreport itself as "already collected" the instant
  // it succeeds. A stale answer is exactly what a page freshly opened on an
  // already-completed visit wants, and that case reads it once anyway.
  const [alreadyCompleted] = useState(() => progress.completedBonusIds.includes(visitBonusId));
  const [selection, setSelection] = useState<BonusSelection | null>(progress.bonusSelections[visitBonusId] ?? null);
  const fallbackTopic = bonusTopics[visitIndex % bonusTopics.length];
  const effective = selection ?? (alreadyCompleted ? { topicId: fallbackTopic.id, questionId: fallbackTopic.questions[0].id } : null);
  let topic = null as typeof bonusTopics[number] | null;
  let question = null as typeof bonusTopics[number]['questions'][number] | null;
  if (effective) {
    topic = bonusTopics.find((candidate) => candidate.id === effective.topicId) ?? fallbackTopic;
    question = topic.questions.find((candidate) => candidate.id === effective.questionId) ?? topic.questions[0];
  }

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<'success' | 'retry' | null>(alreadyCompleted ? 'success' : null);
  const navigate = useNavigate();
  const requiredBattle = [7, 13, 18][visitIndex];

  if (!progress.battleBestHalfUnits[`battle_${String(requiredBattle).padStart(2, '0')}`]) {
    return <AppShell><section className="screen guard"><Gift/><div><h1>הבונוס עדיין נעול</h1><p>השלימו קודם את קרב <Ltr>{requiredBattle}</Ltr>.</p><Button onClick={() => navigate('/map')}>חזרה למפה</Button></div></section></AppShell>;
  }

  const revealed = topic !== null && question !== null;

  const spin = () => {
    setSelection(chooseBonusTopic(visitBonusId));
    playCue('region');
  };

  const check = () => {
    if (!question) return;
    if (selectedOption === question.correct) {
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
      <h1>{revealed && topic ? `בונוס: ${topic.label}` : 'גלגל המשימה'}</h1>
      <p>הפרס קבוע וגלוי מראש: <strong><Ltr>+2</Ltr> כוכבים</strong>. הגלגל בוחר את הנושא, לא את הפרס.</p>
    </header>
    <div className="wheel-panel">
      {/* One wheel instance for the whole page: its `selectedSegmentId` prop
          goes from null to the landed topic id exactly once (on spin, or
          already-set on a reload after spinning), which is what drives the
          landing animation — see BonusWheel. */}
      <BonusWheel segments={segments} selectedSegmentId={revealed && topic ? topic.id : null} reducedMotion={progress.settings.reducedMotion} />
      {!revealed && <Button onClick={spin}><RotateCw/> בחרו נושא</Button>}
    </div>
    {revealed && topic && question && <div className="bonus-challenge">
      <span className="chosen-category"><Sparkles/> הנושא שנבחר: {topic.label}</span>
      <h2>{question.question}</h2>
      <div className="choice-grid">{question.options.map((option, index) => <button key={option} className={`power-card ${selectedOption === index ? 'selected' : ''}`} aria-pressed={selectedOption === index} onClick={() => setSelectedOption(index)}>
        <span className="power-card__index"><Ltr>{String.fromCharCode(65 + index)}</Ltr></span>
        <strong>{option}</strong>{selectedOption === index && <span className="card-state"><Check/> נבחר</span>}
      </button>)}</div>
      {result === 'retry' && <p className="help-note" role="alert">התשובה עדיין לא נשענת על בדיקה. נסו שוב.</p>}
      {result === 'success' ? <div className="bonus-success"><Gift/>
        <h2>{alreadyCompleted ? 'הפרס כבר נאסף' : 'בונוס הושלם!'}</h2>
        <strong><Ltr>+2</Ltr> כוכבים</strong><p>העסקה נשמרת פעם אחת בלבד.</p>
        <Button onClick={() => navigate('/map')}>חזרה למפה</Button>
      </div> : <Button disabled={selectedOption === null} onClick={check}>בדקו תשובה</Button>}
    </div>}
    <Button variant="ghost" onClick={() => navigate('/map')}>דלגו וחזרו למפה</Button>
  </section></AppShell>;
}
