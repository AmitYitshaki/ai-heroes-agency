import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ShieldCheck, Sparkles } from 'lucide-react';
import { AppShell, Button, CharacterArt, Modal } from '../../components/ui';
import { useGame } from '../../state/GameContext';

export function LandingPage() {
  const { hasJourney, newJourney, playCue } = useGame();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const startNew = () => { newJourney(); playCue('region'); navigate('/recruit'); };
  return <AppShell minimal>
    <section className="landing page-enter">
      <div className="landing__burst" aria-hidden="true" />
      <div className="landing__copy">
        <span className="eyebrow"><ShieldCheck /> הכניסה למגויסים פתוחה</span>
        <h1>סוכנות גיבורי<br /><span>ה־AI</span></h1>
        <p className="tagline">כוח־העל שלכם הוא לדעת לבקש.</p>
        <p>הפעילו את לופּ-X, בנו פרומפטים חכמים והחזירו סדר לארבעת אזורי הסוכנות.</p>
        <div className="landing__actions">
          {hasJourney && <Button onClick={() => { playCue('select'); navigate('/map'); }}>המשך משימה</Button>}
          <Button variant={hasJourney ? 'secondary' : 'primary'} onClick={() => hasJourney ? setConfirm(true) : startNew()}>{hasJourney ? 'מסע חדש' : 'התחילו מסע'}</Button>
        </div>
        <div className="feature-row" aria-label="מאפייני המשחק">
          <span><Bot /> 23 משימות</span><span><Sparkles /> בלי הרשמה</span><span><ShieldCheck /> בטוח ופרטי</span>
        </div>
      </div>
      <div className="landing__art"><CharacterArt id="char_loop_launch" alt="לופּ-X מוכן לשיגור" /><div className="comic-splat">הופ!</div></div>
    </section>
    {confirm && <Modal title="להתחיל מסע חדש?" onClose={() => setConfirm(false)}><p>ההתקדמות, הכוכבים והשדרוגים במסע הנוכחי יימחקו. הגדרות הנוחות יישמרו.</p><div className="modal__actions"><Button variant="improve" onClick={startNew}>כן, מסע חדש</Button><Button variant="secondary" onClick={() => setConfirm(false)}>חזרה</Button></div></Modal>}
  </AppShell>;
}
