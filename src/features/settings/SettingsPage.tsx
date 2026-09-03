import { useNavigate } from 'react-router-dom';
import { Accessibility, Music2, Volume2 } from 'lucide-react';
import { AppShell, Button } from '../../components/ui';
import { useGame } from '../../state/GameContext';

export function SettingsPage() {
  const { progress, updateSettings, playCue } = useGame();
  const navigate = useNavigate();
  const toggles = [
    { key:'musicEnabled' as const, label:'מוזיקה', detail:'לולאת רקע רגועה במפה ובקרבות', icon:<Music2/> },
    { key:'effectsEnabled' as const, label:'אפקטים וקולות', detail:'משוב קצר לבחירה, שיגור והצלחה', icon:<Volume2/> },
    { key:'reducedMotion' as const, label:'הפחתת תנועה', detail:'מצבים סטטיים במקום תזוזה וקפיצות', icon:<Accessibility/> },
  ];
  return <AppShell><section className="screen settings-page page-enter"><header className="screen-heading"><span className="eyebrow"><Accessibility/> נוחות ונגישות</span><h1>הגדרות המשחק</h1><p>כל ההגדרות חינמיות ואינן משנות ציון, רמזים או פרסים.</p></header><div className="settings-list">{toggles.map(({key,label,detail,icon})=><label className="setting" key={key}><span className="setting__icon">{icon}</span><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={progress.settings[key]} onChange={(event)=>{updateSettings({[key]:event.target.checked});if(key==='effectsEnabled'&&event.target.checked)playCue('select')}}/><span className="setting__state">{progress.settings[key]?'פעיל':'כבוי'}</span></label>)}</div><div className="info-card"><strong>אפשר להשלים את כל המסע בלי שמע ובלי אנימציות.</strong><p>כל הוראה, תוצאה ואזהרה נשארת גם בטקסט ובחיווי חזותי.</p></div><Button onClick={()=>navigate(-1)}>שמרו וחזרו</Button></section></AppShell>;
}
