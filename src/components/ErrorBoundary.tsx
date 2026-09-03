import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, ShieldAlert } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    // This screen never clears ai_heroes_progress_v1. Previously persisted
    // progress survives; when storage is unavailable, recovery cannot claim
    // that newer in-memory progress was written successfully.
    return <div className="app-shell"><section className="screen error-boundary">
      <ShieldAlert />
      <h1>קרתה תקלה זמנית</h1>
      <p>התקדמות שכבר נשמרה במכשיר לא נמחקה. רעננו את הדף כדי להמשיך.</p>
      <button type="button" className="button button--primary" onClick={() => window.location.reload()}><RotateCcw /> רעננו את המשחק</button>
    </section></div>;
  }
}
