import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CTA from '../CTA';

const base = {
  title: 'Ready to render?',
  description: 'Point resume at your YAML.',
  primary: { label: 'Get started', href: '/docs/' }
};

describe('CTA', () => {
  it('renders title, description and the primary link', () => {
    const html = renderToStaticMarkup(<CTA {...base} />);
    expect(html).toContain('Ready to render?');
    expect(html).toContain('Point resume at your YAML.');
    expect(html).toContain('Get started');
    expect(html).toContain('href="/docs"');
  });

  it('renders an external primary link with target _blank', () => {
    const html = renderToStaticMarkup(
      <CTA
        {...base}
        primary={{
          label: 'GitHub',
          href: 'https://github.com/x',
          external: true
        }}
      />
    );
    expect(html).toContain('https://github.com/x');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });

  it('renders an anchor link for hash hrefs', () => {
    const html = renderToStaticMarkup(
      <CTA {...base} primary={{ label: 'Jump', href: '#top' }} />
    );
    expect(html).toContain('href="#top"');
  });

  it('renders the secondary link when provided', () => {
    const html = renderToStaticMarkup(
      <CTA {...base} secondary={{ label: 'Docs', href: '/docs/' }} />
    );
    expect(html).toContain('Docs');
  });
});
