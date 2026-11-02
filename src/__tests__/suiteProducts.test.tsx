import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { SuiteProducts, CORE_PRODUCTS_DATA } from '../components/public/SuiteProducts';
import { CricNavbar } from '../components/common/CricNavbar';

describe('Suite Core Products Verification', () => {
  it('contains ONLY the 3 core products with exact required descriptions', () => {
    expect(CORE_PRODUCTS_DATA).toHaveLength(3);

    const scoringApp = CORE_PRODUCTS_DATA.find((p) => p.name === 'Cricket Scoring App');
    expect(scoringApp).toBeDefined();
    expect(scoringApp?.desc).toBe('Ball-by-ball scoring with hotkeys');

    const overlay = CORE_PRODUCTS_DATA.find((p) => p.name === 'Cricket Score Overlay');
    expect(overlay).toBeDefined();
    expect(overlay?.desc).toBe('50 panels, broadcast themes for OBS');

    const dashboard = CORE_PRODUCTS_DATA.find((p) => p.name === 'Cricket Web Dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.desc).toBe('Tournament + overlay management');
  });

  it('renders all 3 core products in the SuiteProducts component with links', () => {
    render(
      <MemoryRouter>
        <SuiteProducts />
      </MemoryRouter>
    );

    expect(screen.getByText('Cricket Scoring App')).toBeDefined();
    expect(screen.getByText('Ball-by-ball scoring with hotkeys')).toBeDefined();

    expect(screen.getByText('Cricket Score Overlay')).toBeDefined();
    expect(screen.getByText('50 panels, broadcast themes for OBS')).toBeDefined();

    expect(screen.getByText('Cricket Web Dashboard')).toBeDefined();
    expect(screen.getByText('Tournament + overlay management')).toBeDefined();
  });

  it('ensures removed products (AR Sports TV, Highlights, Auction, Lite) are absent', () => {
    render(
      <MemoryRouter>
        <SuiteProducts />
      </MemoryRouter>
    );

    expect(screen.queryByText(/AR Sports TV/i)).toBeNull();
    expect(screen.queryByText(/Highlights/i)).toBeNull();
    expect(screen.queryByText(/Auction/i)).toBeNull();
    expect(screen.queryByText(/AR Sports Lite/i)).toBeNull();
  });

  it('renders CricNavbar with the 3 core products in the dropdown', () => {
    render(
      <MemoryRouter>
        <CricNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Products')).toBeDefined();
  });
});

