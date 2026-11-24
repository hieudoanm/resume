import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PiTerminal } from 'react-icons/pi';
import Features from '../Features';

const features = [
  { title: 'Fast', body: 'Written in Rust.', icon: PiTerminal },
  { title: 'Local', body: 'No cloud.', icon: PiTerminal }
];

describe('Features', () => {
  it('renders the heading, description and feature cards', () => {
    const html = renderToStaticMarkup(
      <Features title="Why resume" description="Because." features={features} />
    );
    expect(html).toContain('Why resume');
    expect(html).toContain('Because.');
    expect(html).toContain('Fast');
    expect(html).toContain('Written in Rust.');
    expect(html).toContain('Local');
    expect(html).toContain('No cloud.');
  });
});
