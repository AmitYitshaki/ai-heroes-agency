import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { LandingPage } from '../features/onboarding/LandingPage';
import { RecruitPage } from '../features/onboarding/RecruitPage';
import { MapPage } from '../features/map/MapPage';
import { BattlePage } from '../features/battles/BattlePage';
import { WorkshopPage } from '../features/workshop/WorkshopPage';
import { BonusPage } from '../features/bonus/BonusPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { FinalePage } from '../features/finale/FinalePage';

// react-router-dom does not remount an element just because a route param
// changed within the same matched Route — only navigating away and back
// unmounts it. BonusPage reads its persisted selection with a plain
// `useState` initializer, which must re-run for each distinct visit. Normal
// gameplay always routes through /map (or a workshop) between bonus visits,
// which already unmounts it, but that is incidental to the navigation graph,
// not a real guarantee — an explicit `key` makes the remount-per-visit
// behavior hold regardless of how a visit is reached (back/forward, a future
// navigation change, ...).
function BonusRoute() {
  const { bonusId } = useParams();
  return <BonusPage key={bonusId} />;
}

export function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/recruit" element={<RecruitPage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/battle/:battleId" element={<BattlePage />} />
    <Route path="/workshop/:visitId" element={<WorkshopPage />} />
    <Route path="/bonus/:bonusId" element={<BonusRoute />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/finale" element={<FinalePage />} />
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>;
}
