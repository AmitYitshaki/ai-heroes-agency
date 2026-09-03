import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from '../features/onboarding/LandingPage';
import { RecruitPage } from '../features/onboarding/RecruitPage';
import { MapPage } from '../features/map/MapPage';
import { BattlePage } from '../features/battles/BattlePage';
import { WorkshopPage } from '../features/workshop/WorkshopPage';
import { BonusPage } from '../features/bonus/BonusPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { FinalePage } from '../features/finale/FinalePage';

export function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/recruit" element={<RecruitPage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/battle/:battleId" element={<BattlePage />} />
    <Route path="/workshop/:visitId" element={<WorkshopPage />} />
    <Route path="/bonus/:bonusId" element={<BonusPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/finale" element={<FinalePage />} />
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>;
}
