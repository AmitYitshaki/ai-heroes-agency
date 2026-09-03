import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, LockKeyhole, Pencil, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { battles } from '../../content/battles';
import { regions } from '../../content/regions';
import { AppShell, Button, CharacterArt, Ltr, ProgressBar } from '../../components/ui';
import { displayStars } from '../../engine/scoring';
import { useGame } from '../../state/GameContext';

export function MapPage() {
  const { progress, setCharacter, playCue } = useGame();
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();
  const completed = Object.keys(progress.battleBestHalfUnits).length;
  const current = Math.min(progress.nextBattleOrder, 23);
  return <AppShell><section className="map-page page-enter">
    <header className="map-hero">
      <div><span className="eyebrow">מפת המטה</span><h1>{progress.nextBattleOrder === 24 ? 'המסע הושלם!' : `המשימה הבאה: קרב ${current}`}</h1><p>{progress.nextBattleOrder === 24 ? 'כל האזורים בטוחים. אפשר לשפר שיאים בכל עת.' : battles[current - 1].title}</p></div>
      <div className="map-hero__character"><CharacterArt id={progress.characterId === 'heroine' ? 'char_heroine_map' : 'char_hero_map'} alt="הדמות שנבחרה על מפת הסוכנות" /><Button variant="ghost" onClick={() => setSwitching(!switching)}><Pencil /> החלפת דמות</Button></div>
    </header>
    {switching && <div className="switcher" role="group" aria-label="החלפת דמות"><Button variant={progress.characterId==='hero'?'primary':'secondary'} onClick={()=>{setCharacter('hero');setSwitching(false)}}>גיבור־על</Button><Button variant={progress.characterId==='heroine'?'primary':'secondary'} onClick={()=>{setCharacter('heroine');setSwitching(false)}}>גיבורת־על</Button><p>ההתקדמות נשמרת.</p></div>}
    <ProgressBar value={completed} />
    <div className="region-list">
      {regions.map((region) => {
        const regionBattles = battles.filter((battle) => battle.regionId === region.id);
        const done = regionBattles.filter((battle) => progress.battleBestHalfUnits[battle.battleId]).length;
        return <section className="region" key={region.id} style={{ '--region': region.color, '--region-tint': region.tint } as React.CSSProperties}>
          <header className="region__header"><div><span className="region__villain">{region.villain}</span><h2>{region.name}</h2><p>{region.promise}</p></div><strong><Ltr>{done} / {regionBattles.length}</Ltr></strong></header>
          <div className="battle-path" aria-label={`משימות ${region.name}`}>
            {regionBattles.map((battle) => {
              const best = progress.battleBestHalfUnits[battle.battleId];
              const isNext = battle.order === progress.nextBattleOrder;
              const locked = battle.order > progress.nextBattleOrder;
              const state = locked ? 'locked' : isNext ? 'next' : best === 10 ? 'perfect' : 'completed';
              return <button key={battle.battleId} className={`map-node map-node--${state}`} onClick={() => locked ? playCue('guard') : navigate(`/battle/${battle.battleId}`)} aria-label={locked ? `${battle.title}, נעול. נפתח אחרי קרב ${battle.order - 1}` : `${battle.title}, ${best ? `שיא ${displayStars(best)} מתוך 5` : 'המשימה הבאה'}`}>
                <span className="map-node__number"><Ltr>{battle.order}</Ltr></span>
                <span className="map-node__icon">{locked ? <LockKeyhole/> : best === 10 ? <Star/> : best ? <RotateCcw/> : <ArrowLeft/>}</span>
                <span className="map-node__label">{battle.title}</span>
                <span className="map-node__score">{best ? <><Check/> <Ltr>{displayStars(best)} / 5</Ltr></> : locked ? 'נעול' : 'התחילו'}</span>
              </button>;
            })}
          </div>
        </section>;
      })}
    </div>
    {progress.nextBattleOrder === 24 && <div className="finale-card"><ShieldCheck/><div><h2>מהנדסי פרומפטים צעירים</h2><p>התעודה וסיכום הכלים מחכים לכם.</p></div><Link className="button button--primary" to="/finale">לטקס הסיום</Link></div>}
  </section></AppShell>;
}
