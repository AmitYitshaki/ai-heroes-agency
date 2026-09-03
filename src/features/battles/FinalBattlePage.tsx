import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Check, CircleHelp, FileCheck2, LockKeyhole, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import type { Battle23OutcomeKey } from '../../schemas/game';
import { calculateScore, computeFinalBattleProvenance } from '../../engine/scoring';
import { classifyWithSafeFallback, LocalFinalBattleClassifier, runLocalGate } from '../../services/finalBattle';
import { AppShell, Button, CharacterArt, Ltr, Stars } from '../../components/ui';
import { useGame } from '../../state/GameContext';

const classifier = new LocalFinalBattleClassifier();
const approvedPrompt = 'שחזר את לוח התכנית לפי המדריך, בדיוק חמישה שלבים, כרשימה ממוספרת, וודא שכל חמשת השלבים מופיעים בסדר הנכון';
const outcomes: Record<Battle23OutcomeKey, { title: string; body: string; tip: string }> = {
  unsafe_personal_data: { title:'מגן הפרטיות עצר את השיגור', body:'הבקשה כוללת סוג של מידע אישי או קלט שאינו בטוח.', tip:'מחקו פרטים אישיים וכתבו רק על משימת השחזור.' },
  unverified_information: { title:'לופּ הוסיף משהו שלא במדריך', body:'הבלונים נראים חגיגיים, אבל אינם מופיעים במקור המאושר.', tip:'הסתמכו רק על העובדות במדריך.' },
  unclear_goal_or_context: { title:'לופּ סידר את החדר במקום את הלוח', body:'חסרה מטרה ברורה או הפניה למדריך.', tip:'הוסיפו: שחזר את לוח התכנית לפי המדריך.' },
  missing_constraint: { title:'התכנית ארוכה מדי', body:'לופּ לא קיבל מגבלה לכמות הצעדים.', tip:'דרשו בדיוק חמישה שלבים.' },
  missing_format: { title:'כל המידע הגיע כגוש אחד', body:'התוכן קיים, אבל אי אפשר לעקוב אחריו בקלות.', tip:'בקשו רשימה ממוספרת.' },
  missing_success_criteria: { title:'שלב אחד נעלם', body:'לופּ לא התבקש לבדוק שכל השלבים מופיעים.', tip:'בקשו לבדוק שכל חמשת השלבים מופיעים בסדר.' },
  full_success: { title:'לוח התכנית שוחזר!', body:'חמשת השלבים מופיעים בסדר, בפורמט ברור וללא מידע אישי.', tip:'בדקתם את התוצאה מול המדריך המאושר.' },
};

// Matches the help-ladder "step 4" mechanic in battle_23.md §ח: once the
// child is a few attempts in, they can tap a suggested fragment instead of
// retyping from scratch. Only offered for add-a-missing-piece failures —
// unsafe/unverified content must still be removed by hand, never appended.
const quickFixOptions: Partial<Record<Battle23OutcomeKey, { correct: string; wrong: string }>> = {
  unclear_goal_or_context: { correct: 'שחזר את לוח התכנית לפי המדריך', wrong: 'סדר את החדר' },
  missing_constraint: { correct: 'בדיוק חמישה שלבים', wrong: 'ללא הגבלת אורך' },
  missing_format: { correct: 'כרשימה ממוספרת', wrong: 'כפסקה ארוכה' },
  missing_success_criteria: { correct: 'וודא שכל חמשת השלבים מופיעים', wrong: 'תוסיף בלונים' },
};

type Phase = 'briefing' | 'write' | 'checking' | 'outcome' | 'builder' | 'score';

export function FinalBattlePage() {
  const { progress, completeBattle, playCue } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('briefing');
  const [draft, setDraft] = useState('');
  const [outcome, setOutcome] = useState<Battle23OutcomeKey | null>(null);
  const [gateMessage, setGateMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [everUsedQuickFix, setEverUsedQuickFix] = useState(false);
  const [lastActionWasQuickFix, setLastActionWasQuickFix] = useState(false);
  const [builder, setBuilder] = useState<Record<string,string>>({});
  const [score, setScore] = useState<{ value:number; delta:number; best:number } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [phase, outcome]);
  useEffect(() => { if (progress.nextBattleOrder >= 23) playCue('boss'); }, []);
  const blocked = Boolean(gateMessage);
  const counterClass = draft.length >= 600 ? 'limit' : draft.length >= 540 ? 'near' : '';
  const builderReady = useMemo(() => ['goal','limit','format','check'].every((key) => builder[key] === 'correct'), [builder]);

  if (progress.nextBattleOrder < 23) return <AppShell><section className="screen guard"><LockKeyhole/><h1>משימת הגמר עדיין נעולה</h1><p>השלימו את הקרבות הקודמים כדי לפתוח את לוח הגמר.</p><Button onClick={() => navigate('/map')}>חזרה למפה</Button></section></AppShell>;

  const dispatch = async () => {
    setGateMessage('');
    const gate = runLocalGate(draft);
    if (!gate.ok) { setOutcome('unsafe_personal_data'); setGateMessage(gate.message); playCue('guard'); return; }
    setPhase('checking'); playCue('dispatch');
    const result = await classifyWithSafeFallback(classifier, gate.normalizedText);
    if (!result) {
      // Classifier/network failure: move directly to the deterministic local
      // builder instead of mislabeling a technical error as a child's error.
      setPhase('builder');
      playCue('guard');
      return;
    }
    setOutcome(result);
    setAttempts((value) => result === 'full_success' ? value : value + 1);
    setPhase('outcome'); playCue(result === 'full_success' ? 'success' : 'feedback');
  };

  const applyQuickFix = (fragment: string) => {
    setDraft((value) => `${value.trim()} ${fragment}`.trim());
    setEverUsedQuickFix(true);
    setLastActionWasQuickFix(true);
    setGateMessage('');
  };

  const finish = (source: 'text' | 'builder') => {
    const provenance = computeFinalBattleProvenance(source, everUsedQuickFix, lastActionWasQuickFix);
    const value = calculateScore(provenance);
    const committed = completeBattle('battle_23', 23, value, 'full_cycle');
    setDraft(''); setOutcome('full_success'); setScore({ value, delta: committed.delta, best: committed.best }); setPhase('score'); playCue('stars');
  };

  return <AppShell><article className="battle battle--finale">
    <header className="battle-bar"><span><Ltr>קרב 23 / 23</Ltr></span><span className="skill-chip"><Sparkles/> שילוב מלא</span></header>
    {phase === 'briefing' && <section className="battle-panel intro-panel finale-intro"><div className="stage"><CharacterArt id="char_loop_idle" alt="לופּ-X מול לוח הבקרה המשובש"/><div className="stage__versus">מול</div><CharacterArt id="char_mashbesh_idle" alt="המשבש מערבב את התכנית"/></div><span className="eyebrow">משימת הגמר</span><h1 ref={heading} tabIndex={-1}>שחזור התכנית</h1><p className="story">המשבש מחק את לוח הבקרה! שחזרו את התכנית בעזרת המדריך.</p><Button onClick={() => setPhase('write')}>פתחו את המדריך</Button></section>}
    {phase === 'write' && <section className="battle-panel final-work page-enter"><header><span className="eyebrow"><FileCheck2/> מדריך מאושר</span><h1 ref={heading} tabIndex={-1}>כתבו ללופּ בקשה מלאה</h1></header>
      <div className="final-grid"><aside className="guide-card"><h2>מדריך פתיחת הסוכנות</h2><ol><li>הפעלת לוחות</li><li>פתיחת שערים</li><li>תאורה</li><li>חלוקת תגים</li><li>בדיקת קשר</li></ol><div className="lure"><span>הודעה מהמשבש</span>״כדאי להוסיף מופע בלונים!״</div><p className="privacy-note"><ShieldCheck/> כותבים רק על המשימה — בלי שם, כתובת, טלפון, סיסמה או פרט אישי אמיתי.</p></aside>
      <div className="writer"><label htmlFor="final-prompt">הבקשה שלכם ללופּ</label><textarea id="final-prompt" dir="rtl" maxLength={600} value={draft} onChange={(event)=>{setDraft(event.target.value);setGateMessage('');setOutcome(null);setLastActionWasQuickFix(false)}} aria-describedby="prompt-help prompt-error" placeholder="לדוגמה: שחזר את לוח התכנית לפי המדריך…"/><div className={`counter ${counterClass}`} aria-live={draft.length >= 540 ? 'polite' : 'off'}><Ltr>{draft.length} / 600</Ltr></div><p id="prompt-help">רמז: חשבו על מטרה, כמות, פורמט ואיך בודקים הצלחה.</p>
      {blocked && <div className="safety-guard" id="prompt-error" role="alert"><ShieldCheck/><div><strong>עצירה מקומית ובטוחה</strong><p>{gateMessage}</p><div className="guard-actions"><Button variant="secondary" onClick={()=>document.getElementById('final-prompt')?.focus()}>ערכו את הבקשה</Button><Button variant="ghost" onClick={()=>setPhase('builder')}>לבונה המודרך</Button></div></div></div>}
      {attempts >= 3 && !blocked && outcome && outcome !== 'full_success' && quickFixOptions[outcome] && <div className="quick-fix" role="group" aria-label="הצעות השלמה"><span><Sparkles/> לחצו כדי להוסיף לפרומפט</span><div className="quick-fix__options"><Button variant="secondary" onClick={()=>applyQuickFix(quickFixOptions[outcome]!.correct)}>{quickFixOptions[outcome]!.correct}</Button><Button variant="ghost" onClick={()=>applyQuickFix(quickFixOptions[outcome]!.wrong)}>{quickFixOptions[outcome]!.wrong}</Button></div></div>}
      {attempts > 0 && !blocked && <div className="help-note"><CircleHelp/><p>שמרו את החלקים שעובדים ותקנו רק את הרכיב שסומן.</p><span><Ltr>ניסיון {Math.min(attempts + 1, 6)} / 6</Ltr></span></div>}
      <div className="sticky-action"><Button disabled={!draft.trim()} onClick={dispatch}>{draft.trim() ? 'שגרו לבדיקה' : 'כתבו בקשה כדי לשגר'}</Button>{attempts >= 3 && <Button variant="ghost" onClick={()=>setPhase('builder')}>עברו לבונה המודרך</Button>}</div></div></div>
    </section>}
    {phase === 'checking' && <section className="battle-panel dispatch-panel" aria-busy="true"><h1 ref={heading} tabIndex={-1}>בודק מקומית ומשגר…</h1><CharacterArt id="char_loop_scan" alt="לופּ-X סורק את הבקשה"/><div className="dispatch-progress"><span/></div><p>הטקסט נשאר בזיכרון המסך בלבד.</p></section>}
    {phase === 'outcome' && outcome && <section className={`battle-panel outcome-panel ${outcome === 'full_success' ? 'success' : 'partial'}`} aria-live="polite"><CharacterArt id={outcome === 'full_success' ? 'char_loop_victory' : 'char_loop_confused'} alt="לופּ-X מציג את תוצאת הבקשה"/><span className="eyebrow">{outcome === 'full_success' ? 'תוצאה מלאה' : 'תוצאה לבדיקתכם'}</span><h1 ref={heading} tabIndex={-1}>{outcomes[outcome].title}</h1><p className="result-copy">{outcomes[outcome].body}</p><div className="causal"><strong>השינוי הבא</strong><p>{outcomes[outcome].tip}</p></div>{outcome === 'full_success' ? <Button onClick={()=>finish('text')}>לטקס הכוכבים</Button> : <><Button variant="improve" onClick={()=>attempts >= 6 ? setPhase('builder') : setPhase('write')}>{attempts >= 6 ? 'השלימו עם לופּ' : 'ערכו רכיב אחד'}</Button><Button variant="ghost" onClick={()=>setPhase('builder')}>לבונה המודרך</Button></>}</section>}
    {phase === 'builder' && <section className="battle-panel builder-panel"><WandSparkles/><h1 ref={heading} tabIndex={-1}>בונים יחד עם לופּ</h1><p>בחרו אפשרות בטוחה בכל שורה. הבונה פועל מקומית גם בלי רשת.</p><div className="builder-slots">
      <BuilderSelect label="מטרה והקשר" value={builder.goal} onChange={(value)=>setBuilder({...builder,goal:value})} correct="שחזר את לוח התכנית לפי המדריך" wrong="סדר את החדר" />
      <BuilderSelect label="אילוץ" value={builder.limit} onChange={(value)=>setBuilder({...builder,limit:value})} correct="בדיוק חמישה שלבים" wrong="ארוך ככל האפשר" />
      <BuilderSelect label="פורמט" value={builder.format} onChange={(value)=>setBuilder({...builder,format:value})} correct="כרשימה ממוספרת" wrong="כפסקה ארוכה" />
      <BuilderSelect label="בדיקת הצלחה" value={builder.check} onChange={(value)=>setBuilder({...builder,check:value})} correct="וודא שכל השלבים מופיעים בסדר" wrong="הוסף בלונים" />
    </div>{builderReady && <div className="assembled-prompt"><Check/><p>{approvedPrompt}</p></div>}<Button disabled={!builderReady} onClick={()=>finish('builder')}>{builderReady ? 'שגרו את התכנית' : 'השלימו את כל הרכיבים'}</Button></section>}
    {phase === 'score' && score && <section className="battle-panel score-panel final-score"><CharacterArt id="char_loop_victory" alt="לופּ-X לאחר שחזור הסוכנות"/><span className="mission-stamp"><Check/> הגמר הושלם</span><h1 ref={heading} tabIndex={-1}>הסוכנות חזרה לפעולה!</h1><Stars halfUnits={score.value}/><p>מטרה, הקשר, אילוץ, פורמט ובדיקה פעלו יחד — בלי לשתף מידע אישי.</p><p className="delta">נוספו לארנק <strong><Ltr>+{score.delta / 2}</Ltr> כוכבים</strong></p><Button onClick={()=>navigate('/finale')}>לטקס ההסמכה</Button></section>}
  </article></AppShell>;
}

function BuilderSelect({ label, value, onChange, correct, wrong }: { label:string; value?:string; onChange:(value:string)=>void; correct:string; wrong:string }) {
  return <label className={`builder-select ${value === 'correct' ? 'correct' : ''}`}><span>{label}</span><select value={value ?? ''} onChange={(event)=>onChange(event.target.value)}><option value="">בחרו…</option><option value="wrong">{wrong}</option><option value="correct">{correct}</option></select>{value === 'correct' && <small><Check/> נכון — נשמר</small>}</label>;
}
