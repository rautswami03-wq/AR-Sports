import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FullCardBase } from '../components/overlays/base/FullCardBase';
import { LowerThirdBase } from '../components/overlays/base/LowerThirdBase';
import { StingBase } from '../components/overlays/base/StingBase';

describe('IPL 2025 Overlay Base Structural Components Suite', () => {
  it('renders FullCardBase with dark blue background, orange border, header, and footer', () => {
    render(
      <FullCardBase
        title="POINTS TABLE"
        subtitle="TATA IPL 2025"
        footerContent={<span>MATCHES REMAINING: 12</span>}
      >
        <div data-testid="card-child">Table Contents</div>
      </FullCardBase>
    );

    expect(screen.getByText('POINTS TABLE')).toBeDefined();
    expect(screen.getByText('TATA IPL 2025')).toBeDefined();
    expect(screen.getByTestId('card-child')).toBeDefined();
    expect(screen.getByText('MATCHES REMAINING: 12')).toBeDefined();
  });

  it('renders LowerThirdBase with curved team color block and data container', () => {
    render(
      <LowerThirdBase
        teamColor="#004BA0"
        teamName="MUMBAI INDIANS"
        playerName="ROHIT SHARMA"
        playerRole="BATTER"
        rightContent={<div data-testid="right-metrics">RUNS 75 (42)</div>}
      >
        <span>FORM: 52, 44, 75</span>
      </LowerThirdBase>
    );

    expect(screen.getByText('MUMBAI INDIANS')).toBeDefined();
    expect(screen.getByText('ROHIT SHARMA')).toBeDefined();
    expect(screen.getByText('BATTER')).toBeDefined();
    expect(screen.getByTestId('right-metrics')).toBeDefined();
    expect(screen.getByText('FORM: 52, 44, 75')).toBeDefined();
  });

  it('renders StingBase with bold gradient and typography for events', () => {
    const { rerender } = render(<StingBase type="FOUR" text="FOUR" />);
    expect(screen.getByText('FOUR')).toBeDefined();

    rerender(<StingBase type="SIX" text="MAXIMUM" subText="105 METERS" />);
    expect(screen.getByText('MAXIMUM')).toBeDefined();
    expect(screen.getByText('105 METERS')).toBeDefined();

    rerender(<StingBase type="WICKET" text="WICKET" />);
    expect(screen.getByText('WICKET')).toBeDefined();
  });
});

