import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Paintbrush, ShoppingBag, Sparkles } from 'lucide-react';
import { cosmetics } from '../../content/catalog';
import { AppShell, Button, Ltr } from '../../components/ui';
import { EquippedLoop } from '../../components/EquippedLoop';
import { displayStars } from '../../engine/scoring';
import type { CosmeticItem } from '../../schemas/game';
import { useGame } from '../../state/GameContext';

const visitNames = ['אביזר ראש','שריון חיצוני','אפקט תנועה','סמל גיבור'];
export function WorkshopPage() {
  const { visitId = '1' } = useParams();
  const parsedVisit = Number(visitId);
  const visit = (Number.isFinite(parsedVisit) ? Math.min(4, Math.max(1, Math.floor(parsedVisit))) : 1) as 1|2|3|4;
  const { progress, buyCosmetic, playCue } = useGame();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const items = useMemo(()=>cosmetics.filter((item)=>item.visitId===visit),[visit]);
  const requiredBattle = [7, 13, 18, 22][visit - 1];
  if (!progress.battleBestHalfUnits[`battle_${String(requiredBattle).padStart(2, '0')}`]) {
    return <AppShell><section className="screen guard"><Sparkles/><div><h1>הסדנה עדיין נעולה</h1><p>השלימו קודם את קרב <Ltr>{requiredBattle}</Ltr> כדי לפתוח את הביקור הזה.</p><Button onClick={()=>navigate('/map')}>חזרה למפה</Button></div></section></AppShell>;
  }
  const continueRoute = () => navigate(visit < 4 ? `/bonus/${visit}` : '/battle/battle_23');
  const buy = (item: CosmeticItem) => { const ok = buyCosmetic(item); setMessage(ok ? `${item.label} נרכש ומורכב.` : `חסרים ${displayStars(item.priceHalfUnits - progress.walletHalfUnits)} כוכבים.`); playCue(ok ? 'equip' : 'guard'); };
  return <AppShell><section className="screen workshop-page page-enter"><header className="screen-heading"><span className="eyebrow"><Paintbrush/> סדנת לופּ · ביקור <Ltr>{visit} / 4</Ltr></span><h1>בחרו {visitNames[visit-1]}</h1><p>השדרוגים חזותיים בלבד. אפשר לדלג בלי להשפיע על הקרבות.</p></header><div className="workshop-preview"><EquippedLoop poseId="char_loop_idle" alt="לופּ-X בתצוגת הסדנה, עם הציוד המורכב הנוכחי" equipped={progress.equippedCosmetics}/><div className="preview-badge"><Sparkles/> ארבעה חריצי עיצוב, אותם כוחות</div></div><div className="wallet-large"><ShoppingBag/><span>יתרה זמינה</span><strong><Ltr>{displayStars(progress.walletHalfUnits)}</Ltr> כוכבים</strong></div><div className="shop-grid">{items.map((item)=>{const owned=progress.purchasedCosmeticIds.includes(item.itemId);const equipped=progress.equippedCosmetics[item.slot]===item.itemId;const affordable=progress.walletHalfUnits>=item.priceHalfUnits;return <article className={`shop-item ${equipped?'equipped':''}`} key={item.itemId}><div className="shop-item__swatch" style={{'--swatch':item.swatch} as React.CSSProperties}/><h2>{item.label}</h2><p>{item.description}</p><Button variant={equipped?'secondary':affordable||owned?'primary':'ghost'} onClick={()=>buy(item)} disabled={equipped}>{equipped?<><Check/> מורכב</>:owned?'הרכיבו':affordable?<><Ltr>{displayStars(item.priceHalfUnits)}</Ltr> כוכבים</>:`חסרים ${displayStars(item.priceHalfUnits-progress.walletHalfUnits)}`}</Button></article>})}</div>{message&&<p className="status-message" role="status">{message}</p>}<div className="sticky-action"><Button onClick={continueRoute}>{visit<4?'לבונוס האופציונלי':'למשימת הגמר'}</Button><Button variant="ghost" onClick={continueRoute}>דלגו על הסדנה</Button></div></section></AppShell>;
}
