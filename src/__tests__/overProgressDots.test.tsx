import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OverProgressDots, SustainabilityTreeIcon } from '../components/overlays/OverProgressDots';

describe('OverProgressDots Sustainability Graphic Suite', () => {
  it('renders sustainability tree icon when ball is a dot ball (0)', () => {
    const { container } = render(<OverProgressDots recentBalls={['0']} maxDots={1} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg).not.toBeNull();
    const leafPath = container.querySelector('path[fill="#27E64B"]');
    expect(leafPath).toBeDefined();
    expect(leafPath).not.toBeNull();
  });

  it('renders boundary 4s with Coral Yellow styling', () => {
    const { container, getByText } = render(<OverProgressDots recentBalls={['4']} maxDots={1} />);
    expect(getByText('4')).toBeDefined();
    const fourDot = container.querySelector('.bg-\\[\\#FFDC35\\]');
    expect(fourDot).toBeDefined();
    expect(fourDot).not.toBeNull();
  });

  it('renders boundary 6s with Electric Pink styling', () => {
    const { container, getByText } = render(<OverProgressDots recentBalls={['6']} maxDots={1} />);
    expect(getByText('6')).toBeDefined();
    const sixDot = container.querySelector('.bg-\\[\\#FF207C\\]');
    expect(sixDot).toBeDefined();
    expect(sixDot).not.toBeNull();
  });

  it('renders wicket W with red styling', () => {
    const { container, getByText } = render(<OverProgressDots recentBalls={['W']} maxDots={1} />);
    expect(getByText('W')).toBeDefined();
    const wDot = container.querySelector('.bg-red-600');
    expect(wDot).toBeDefined();
  });

  it('renders mixed over with sustainability dot balls, boundaries, and wickets', () => {
    const { container, getByText } = render(
      <OverProgressDots recentBalls={['1', '0', '4', 'W', '0', '6']} maxDots={6} />
    );
    expect(getByText('1')).toBeDefined();
    expect(getByText('4')).toBeDefined();
    expect(getByText('6')).toBeDefined();
    expect(getByText('W')).toBeDefined();

    // Two dot balls should render two sustainability SVGs
    const svgs = container.querySelectorAll('path[fill="#27E64B"]');
    expect(svgs.length).toBe(2);
  });
});
