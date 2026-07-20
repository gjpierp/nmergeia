import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PremiumLock } from './PremiumLock.jsx';
import { useMonetizationStore } from './MonetizationStore.js';

vi.mock('./MonetizationStore.js', () => ({
  useMonetizationStore: vi.fn(),
  MonetizationConfig: { ALL_FEATURES_FREE: false }
}));

describe('PremiumLock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children normally when isPro is true', () => {
    useMonetizationStore.mockImplementation((selector) => {
      return selector({ isPro: true, openPremiumModal: vi.fn() });
    });

    render(
      <PremiumLock>
        <button>Accion Pro</button>
      </PremiumLock>
    );

    const button = screen.getByText('Accion Pro');
    expect(button).toBeDefined();
    expect(button.textContent).not.toContain('🔒');
  });

  it('blocks click and opens modal when isPro is false', () => {
    const openPremiumModalMock = vi.fn();
    useMonetizationStore.mockImplementation((selector) => {
      return selector({ isPro: false, openPremiumModal: openPremiumModalMock });
    });

    const onClickMock = vi.fn();
    render(
      <PremiumLock>
        <button onClick={onClickMock}>Accion Pro</button>
      </PremiumLock>
    );

    const button = screen.getByText(/Accion Pro/i);
    expect(button.textContent).toContain('🔒');
    
    fireEvent.click(button);
    expect(onClickMock).not.toHaveBeenCalled();
    expect(openPremiumModalMock).toHaveBeenCalled();
  });
});
