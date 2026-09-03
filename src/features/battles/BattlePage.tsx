import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bot, Check, ChevronDown, CircleHelp, Lightbulb, Play, ScanLine, ShieldCheck, Sparkles, Target, WandSparkles } from 'lucide-react';
import { battleById } from '../../content/battles';
import { regionForBattle } from '../../content/regions';
import { calculateScore, evaluateSelections } from '../../engine/scoring';
import type { ComponentProvenance } from '../../schemas/game';
import { AppShell, Button, CharacterArt, Ltr, Stars, StatusPill } from '../../components/ui';
import { useGame } from '../../state/GameContext';
import { FinalBattlePage } from './FinalBattlePage';

type Phase = 'briefing' | 'compose' | 'dispatch' | 'outcome' | 'feedback' | 'victory' | 'score';
const villainArt: Record<string, string> = { 'fog_district':'char_bearach_idle', 'no_limits_factory':'char_odveod_idle', 'command_maze':'char_tangle_idle', 'certainty_tower':'char_certainty_idle', 'finale':'char_mashbesh_idle' };
const helpMessages = [
  'הפרומפט עוד לא מספיק מדויק — נסו לשפר אותו.',
  'בדקו איזה רכיב עדיין לא מתאים למטרה.',
  'כמעט! יש עוד פרט שאפשר לדייק בעצמכם.',
  'צמצמנו לשתי אפשרויות בכל חלק שנותר.',
  'שמרו את מה שעבד ושנו רק רכיב אחד.',
  'לופּ יכול להשלים את החלק האחרון יחד איתכם.',
];

export function BattlePage() {
  const { battleId = '' } = useParams();
  if (battleId === 'battle_23') return <FinalBattlePage />;
  return <StandardBattle battleId={battleId} />;
}

function StandardBattle({ battleId }: { battleId: string }) {
  const battle = battleById[battleId];
  const { progress, completeBattle, playCue } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('briefing');
  const [selected, setSelected] = useState<string[]>([]);
  const [retained, setRetained] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [aid, setAid] = useState<ComponentProvenance>('user_independent');
  const [success, setSuccess] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [demoDone, setDemoDone] = useState(battle?.order !== 1);
  const [scoreData, setScoreData] = useState<{ score: number; delta: number; best: number } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const region = battle ? regionForBattle(battle.order) : regionForBattle(1);

  useEffect(() => { headingRef.current?.focus(); }, [phase]);
  useEffect(() => { if (battle?.villain) playCue('boss'); }, [battle?.battleId]);
  useEffect(() => {
    if (phase !== 'dispatch') return;
    const timer = window.setTimeout(() => runEvaluation(), progress.settings.reducedMotion ? 250 : attempts ? 1200 : 2400);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const visibleChoices = useMemo(() => {
    if (!battle) return [];
    if (attempts < 4) return battle.choices;
    const correct = battle.choices.filter((choice) => battle.correctChoiceIds.includes(choice.id));
    const distractor = battle.choices.find((choice) => !battle.correctChoiceIds.includes(choice.id));
    return distractor ? [...correct, distractor] : correct;
  }, [battle, attempts]);

  if (!battle) return <AppShell><section className="screen"><h1>המשימה לא נמצאה</h1><p>מזהה הקרב אינו קיים. ההתקדמות לא השתנתה.</p><Button onClick={() => navigate('/map')}>חזרה למפה</Button></section></AppShell>;
  if (battle.order > progress.nextBattleOrder) return <AppShell><section className="screen guard"><ShieldCheck/><h1>המשימה עדיין נעולה</h1><p>השלימו קודם את קרב <Ltr>{battle.order - 1}</Ltr>. שום התקדמות לא השתנתה.</p><Button onClick={() => navigate('/map')}>חזרה למפה</Button></section></AppShell>;

  const ordered = battle.order === 14;
  const choose = (id: string) => {
    if (retained.includes(id)) return;
    playCue('select');
    const limit = battle.correctChoiceIds.length;
    if (limit === 1) setSelected([id]);
    else setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length >= limit ? [...current.slice(1), id] : [...current, id]);
  };

  const start = () => {
    if (!demoDone) {
      setOutcome('לופּ הבין את השטח, אבל אין לו מטרה. הפרומפט כלל מצב — לא פעולה.');
      setSuccess(false);
      setPhase('outcome');
      playCue('feedback');
    } else setPhase('compose');
  };

  const runEvaluation = () => {
    const isCorrect = evaluateSelections(selected, battle.correctChoiceIds, ordered);
    if (isCorrect) {
      setSuccess(true); setOutcome(battle.successMessage); playCue('success');
    } else {
      const wrong = battle.choices.find((choice) => selected.includes(choice.id) && !battle.correctChoiceIds.includes(choice.id));
      const correctPicked = selected.filter((id) => battle.correctChoiceIds.includes(id));
      setRetained((current) => [...new Set([...current, ...correctPicked])]);
      setSuccess(false); setOutcome(wrong?.outcome ?? battle.partialMessage); playCue('feedback');
      setAttempts((value) => value + 1);
    }
    setPhase('outcome');
  };

  const retry = () => {
    if (!demoDone) { setDemoDone(true); setPhase('compose'); return; }
    setSelected(retained);
    if (attempts >= 6) setAid('system_completed');
    else if (attempts >= 4) setAid('user_choice_two');
    setPhase(attempts >= 6 ? 'feedback' : 'compose');
  };

  const guided = () => { setAid('system_completed'); setSelected([...battle.correctChoiceIds]); setPhase('dispatch'); };
  const goToScore = () => {
    const provenance: ComponentProvenance[] = battle.criteria.map(() => aid);
    const score = calculateScore(provenance);
    const committed = completeBattle(battle.battleId, battle.order, score, battle.unlockPower);
    setScoreData({ score, ...committed }); setPhase('score'); playCue('stars');
  };
  const next = () => battle.workshopVisit ? navigate(`/workshop/${battle.workshopVisit}`) : battle.order === 22 ? navigate('/workshop/4') : navigate('/map');

  const loopPose = phase === 'dispatch' ? 'char_loop_launch' : success ? 'char_loop_victory' : phase === 'outcome' ? 'char_loop_partial' : 'char_loop_build';
  return <AppShell><article className={`battle battle--${battle.regionId}`} style={{ '--region': region.color, '--region-tint': region.tint } as React.CSSProperties}>
    <header className="battle-bar"><span><Ltr>קרב {battle.order} / 23</Ltr></span><span className="skill-chip"><Target />{battle.skillLabel}</span></header>
    {phase === 'briefing' && <section className="battle-panel intro-panel page-enter">
      <div className="stage"><CharacterArt id="char_loop_idle" alt="לופּ-X ממתין לפקודה" /><div className="stage__versus">מול</div>{battle.villain && <CharacterArt id={villainArt[battle.regionId]} alt={`${battle.villain} מציג את התקלה`} />}</div>
      <div><span className="eyebrow">{region.name}</span><h1 ref={headingRef} tabIndex={-1}>{battle.title}</h1><p className="story">{battle.story}</p><div className="objective"><Target/><div><strong>מטרת המשימה</strong><p>{battle.objective}</p></div></div></div>
      <Button onClick={start}>{demoDone ? 'התחילו סריקה' : 'שגרו'}</Button>
    </section>}
    {phase === 'compose' && <section className="battle-panel work-panel page-enter">
      <header><span className="eyebrow"><ScanLine /> {templateLabel(battle.battleType)}</span><h1 ref={headingRef} tabIndex={-1}>{battle.instruction}</h1></header>
      {battle.promptFrame && <div className="prompt-frame"><Bot/><span>{battle.promptFrame}</span></div>}
      <details className="concept"><summary><CircleHelp /> מה זה אומר?</summary><p>{battle.concept}</p></details>
      {retained.length > 0 && <div className="retained-list" aria-label="רכיבים נכונים שנשמרו">{retained.map((id) => <StatusPill key={id} kind="retained">{battle.choices.find((choice) => choice.id === id)?.label}</StatusPill>)}</div>}
      <div className={`choice-grid choice-grid--${battle.battleType}`} role={battle.correctChoiceIds.length === 1 ? 'radiogroup' : 'group'} aria-label="אפשרויות לפרומפט">
        {visibleChoices.map((choice, index) => {
          const picked = selected.includes(choice.id), kept = retained.includes(choice.id);
          return <button key={choice.id} className={`power-card ${picked ? 'selected' : ''} ${kept ? 'retained' : ''}`} onClick={() => choose(choice.id)} aria-pressed={picked} disabled={kept}>
            <span className="power-card__index"><Ltr>{ordered ? index + 1 : String.fromCharCode(65 + index)}</Ltr></span><span><strong>{choice.label}</strong>{choice.detail && <small>{choice.detail}</small>}</span>{kept ? <span className="card-state"><Check/> נכון — נשמר</span> : picked && <span className="card-state"><Check/> נבחר</span>}
          </button>;
        })}
      </div>
      {attempts > 0 && <div className="help-note"><Lightbulb/><p>{helpMessages[Math.min(attempts - 1, 5)]}</p><span><Ltr>שלב עזרה {Math.min(attempts, 6)} / 6</Ltr></span></div>}
      <div className="sticky-action"><Button disabled={selected.length !== battle.correctChoiceIds.length} onClick={() => { setPhase('dispatch'); playCue('dispatch'); }}>{selected.length !== battle.correctChoiceIds.length ? `בחרו ${battle.correctChoiceIds.length === 1 ? 'אפשרות' : `${battle.correctChoiceIds.length} רכיבים`}` : 'שגרו ללופּ'}</Button></div>
    </section>}
    {phase === 'dispatch' && <section className="battle-panel dispatch-panel" aria-busy="true"><h1 ref={headingRef} tabIndex={-1}>משגר ללופּ…</h1><CharacterArt id="char_loop_launch" alt="לופּ-X משגר את הפרומפט" /><div className="dispatch-progress"><span /></div><p>לופּ מבצע בדיוק את הפרומפט שבניתם.</p></section>}
    {phase === 'outcome' && <section className={`battle-panel outcome-panel ${success ? 'success' : 'partial'}`} aria-live="polite">
      <div className="world-result"><CharacterArt id={loopPose} alt={success ? 'לופּ-X מציג תוצאה מוצלחת' : 'לופּ-X מציג תוצאה חלקית'} /><div className="result-symbol" aria-hidden="true">{success ? '✓' : '…'}</div></div>
      <span className="eyebrow">{success ? 'תוצאה מלאה' : 'תוצאה חלקית'}</span><h1 ref={headingRef} tabIndex={-1}>{success ? 'המשימה הצליחה!' : 'לופּ פירש את הבקשה'}</h1><p className="result-copy">{outcome}</p>
      <div className="causal"><strong>למה זה קרה?</strong><p>{success ? battle.concept : battle.partialMessage}</p></div>
      <Button variant={success ? 'primary' : 'improve'} onClick={() => success ? setPhase('victory') : retry()}>{success ? 'לניצחון' : demoDone ? 'שפרו את הפרומפט' : 'הוסיפו מטרה'}</Button>
    </section>}
    {phase === 'feedback' && <section className="battle-panel guided-panel"><WandSparkles/><h1 ref={headingRef} tabIndex={-1}>משלימים יחד</h1><p>החלקים הנכונים נשמרו. לופּ יסמן את הפתרון כדי שתוכלו להשלים את הקרב.</p><div className="solution-preview">{battle.correctChoiceIds.map((id) => <StatusPill key={id} kind="retained">{battle.choices.find((choice) => choice.id === id)?.label}</StatusPill>)}</div><Button onClick={guided}>השלימו עם לופּ</Button></section>}
    {phase === 'victory' && <section className="battle-panel victory-panel"><CharacterArt id="char_loop_victory" alt="לופּ-X חוגג את הצלחת המשימה" /><Sparkles/><h1 ref={headingRef} tabIndex={-1}>חותמת משימה!</h1><p>{battle.successMessage}</p><blockquote>{battle.concept}</blockquote><Button onClick={goToScore}>חשבו כוכבים</Button></section>}
    {phase === 'score' && scoreData && <section className="battle-panel score-panel"><span className="mission-stamp"><Check/> המשימה הושלמה</span><h1 ref={headingRef} tabIndex={-1}>{scoreData.delta > 0 ? 'שיא חדש!' : 'אימון מצוין'}</h1><Stars halfUnits={scoreData.score}/><div className="criteria-list">{battle.criteria.map((criterion) => <div key={criterion}><Check/><span>{criterion}</span><strong>{aid === 'user_independent' ? '1' : aid === 'user_choice_two' ? '0.5' : 'מודרך'}</strong></div>)}</div><p className="delta">{scoreData.delta > 0 ? <>נוספו לארנק <strong><Ltr>+{scoreData.delta / 2}</Ltr> כוכבים</strong></> : <>השיא נשאר <strong><Ltr>{scoreData.best / 2} / 5</Ltr></strong></>}</p><Button onClick={next}>{battle.workshopVisit ? 'לסדנה' : 'התקדמו למפה'}</Button></section>}
  </article></AppShell>;
}

function templateLabel(type: string) {
  return ({ prompt_assembly:'הרכבת פרומפט', fault_scan:'סריקת תקלה', power_selection:'בחירת כוח', fault_repair:'תיקון תקלה', robot_test:'מבחן רובוט', responsibility_shield:'מגן אחריות', combo:'קרב שילוב' } as Record<string,string>)[type];
}
