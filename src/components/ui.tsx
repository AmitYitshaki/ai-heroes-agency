import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Check, LockKeyhole, Settings, Star, Volume2, WalletCards, X } from 'lucide-react';
import { useGame } from '../state/GameContext';
import { displayStars } from '../engine/scoring';
import { skillCatalog } from '../content/battles';

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'improve' | 'ghost' }) {
  return <button className={`button button--${variant} ${className}`} {...props} />;
}

export function Ltr({ children }: { children: ReactNode }) { return <span className="ltr" dir="ltr">{children}</span>; }

export function Stars({ halfUnits, label = 'ציון' }: { halfUnits: number; label?: string }) {
  return <div className="stars" aria-label={`${label}: ${displayStars(halfUnits)} מתוך 5 כוכבים`}>
    <div className="stars__row" aria-hidden="true">{[2,4,6,8,10].map((threshold) => <span key={threshold} className={halfUnits >= threshold ? 'star full' : halfUnits === threshold - 1 ? 'star half' : 'star'}>★</span>)}</div>
    <strong><Ltr>{displayStars(halfUnits)} / 5</Ltr></strong>
  </div>;
}

const artPath = (id: string) => `/assets/characters/${id}.webp`;
export function CharacterArt({ id, alt, className = '' }: { id: string; alt: string; className?: string }) {
  return <figure className={`character-art ${className}`}><img src={artPath(id)} alt={alt} width="900" height="491" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('character-art--fallback'); }} /><figcaption className="sr-only">{alt}</figcaption></figure>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const modal = useRef<HTMLElement>(null);
  useEffect(() => {
    heading.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab' || !modal.current) return;
      const focusable = modal.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modal}>
      <Button variant="ghost" className="modal__close" aria-label="סגירת חלון" onClick={onClose}><X /></Button>
      <h2 id="modal-title" ref={heading} tabIndex={-1}>{title}</h2>{children}
    </section>
  </div>;
}

export function AppShell({ children, minimal = false }: { children: ReactNode; minimal?: boolean }) {
  const { progress } = useGame();
  const location = useLocation();
  const showBack = !['/', '/map'].includes(location.pathname);
  const [briefcaseOpen, setBriefcaseOpen] = useState(false);
  const earnedCount = skillCatalog.filter((skill) => progress.unlockedPowerIds.includes(skill.powerId)).length;
  return <div className={`app-shell ${progress.settings.reducedMotion ? 'reduced-motion' : ''}`}>
    <a href="#main" className="skip-link">דלגו לתוכן</a>
    {!minimal && <header className="topbar">
      <div className="topbar__side">
        {showBack ? <Link className="icon-link" aria-label="חזרה למפה" to="/map"><ArrowRight /></Link> : <div className="brand-mark" aria-hidden="true"><Star /></div>}
        <span className="topbar__brand">סוכנות גיבורי ה־AI</span>
      </div>
      <div className="topbar__actions">
        <span className="wallet" aria-label={`ארנק: ${displayStars(progress.walletHalfUnits)} כוכבים`}><WalletCards /><Ltr>{displayStars(progress.walletHalfUnits)}</Ltr></span>
        <button type="button" className="icon-link" aria-label={`תיק הכוחות: ${earnedCount} מתוך ${skillCatalog.length} נאספו`} onClick={() => setBriefcaseOpen(true)}><Briefcase /></button>
        <Link className="icon-link" aria-label="הגדרות שמע ונגישות" to="/settings"><Settings /></Link>
      </div>
    </header>}
    <main id="main" tabIndex={-1}>{children}</main>
    {briefcaseOpen && <Modal title="תיק הכוחות" onClose={() => setBriefcaseOpen(false)}>
      <p>כל כוח נפתח כשמשלימים את הקרב שמלמד אותו. הכוחות אינם נקנים ואינם מושפעים משיפור עתידי.</p>
      <div className="skill-chip-grid">
        {skillCatalog.map((skill) => {
          const earned = progress.unlockedPowerIds.includes(skill.powerId);
          return <span key={skill.powerId} className={`skill-chip ${earned ? 'skill-chip--earned' : 'skill-chip--locked'}`}>
            {earned ? <Check /> : <LockKeyhole />}
            <span>{skill.label}</span>
            {!earned && <small><Ltr>קרב {skill.battleOrder}</Ltr></small>}
          </span>;
        })}
      </div>
    </Modal>}
  </div>;
}

export function ProgressBar({ value, max = 23 }: { value: number; max?: number }) {
  return <div className="progress-wrap"><div className="progress-label"><span>התקדמות במסע</span><Ltr>{Math.min(value, max)} / {max}</Ltr></div><div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value,max)}><span style={{ inlineSize: `${Math.min(100, value / max * 100)}%` }} /></div></div>;
}

export function StatusPill({ kind, children }: { kind: 'locked' | 'next' | 'done' | 'retained'; children: ReactNode }) {
  return <span className={`status status--${kind}`}>{kind === 'locked' ? <LockKeyhole /> : <Check />}{children}</span>;
}

export { ArrowLeft, ArrowRight, Check, LockKeyhole, Settings, Star, Volume2 };
