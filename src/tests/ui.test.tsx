// @vitest-environment jsdom
import { act, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Modal } from '../components/ui';
import { ErrorBoundary } from '../components/ErrorBoundary';

const roots: Array<ReturnType<typeof createRoot>> = [];
afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.replaceChildren();
});

describe('modal keyboard behavior', () => {
  it('focuses the title, traps Tab in both directions, and closes on Escape', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    roots.push(root);
    const onClose = vi.fn();

    await act(async () => {
      root.render(<Modal title="אישור" onClose={onClose}><button type="button">ראשון</button><button type="button">אחרון</button></Modal>);
    });

    expect(document.activeElement?.id).toBe('modal-title');
    const buttons = Array.from(host.querySelectorAll('button'));
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    first.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(last);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorBoundary recovery', () => {
  it('replaces a render crash with the approved reload recovery screen', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    roots.push(root);
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    class Bomb extends Component { render(): never { throw new Error('test render crash'); } }

    await act(async () => {
      root.render(<ErrorBoundary><Bomb/></ErrorBoundary>);
    });

    expect(host.textContent).toContain('קרתה תקלה זמנית');
    expect(host.textContent).toContain('רעננו את המשחק');
    expect(host.querySelector('button')).not.toBeNull();
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
  });
});
