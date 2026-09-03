import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameProvider } from './state/GameContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><ErrorBoundary><HashRouter><GameProvider><App /></GameProvider></HashRouter></ErrorBoundary></StrictMode>,
);
