import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Hero from '../Hero';

const base = {
  title: 'Convert resumes',
  description: 'Into documents.',
  primary: { label: 'Convert', href: '/app/' },
  stats: [
    { value: '64', label: 'templates' },
    { value: '1', label: 'binary' }
  ]
};

describe('Hero', () => {
  it('renders title, description, CTA and stats', () => {
    const html = renderToStaticMarkup(<Hero {...base} />);
    expect(html).toContain('Convert resumes');
    expect(html).toContain('Into documents.');
    expect(html).toContain('Convert');
    expect(html).toContain('64');
    expect(html).toContain('templates');
  });

  it('renders children and the secondary link', () => {
    const html = renderToStaticMarkup(
      <Hero
        {...base}
        secondary={{
          label: 'Docs',
          href: 'https://github.com/x',
          external: true
        }}
      >
        <div>terminal</div>
      </Hero>
    );
    expect(html).toContain('terminal');
    expect(html).toContain('Docs');
    expect(html).toContain('https://github.com/x');
  });
});
