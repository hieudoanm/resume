import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import Footer from '@/components/molecules/Footer';
import Navbar from '@/components/molecules/Navbar';
import './globals.css';

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('resume-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'resume-dark':'resume';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const inter = Inter({ subsets: ['latin'] });

const GITHUB = 'https://github.com/hieudoanm/resume';
const BASE = process.env.NODE_ENV === 'production' ? '/resume' : '';
const LOGO =
  process.env.NODE_ENV === 'production' ? '/resume/logo.svg' : '/logo.svg';

const NAV_LINKS = [
  { label: 'Editor', href: '/editor/' },
  { label: 'Downloads', href: '/downloads/' },
  { label: 'Docs', href: '/docs/' }
];

const DESCRIPTION =
  'Hieu Doan — software engineer with 10+ years of experience. Resume and a browser-based Resume editor that exports YAML for the resume CLI.';

export const metadata: Metadata = {
  metadataBase: new URL('https://hieudoanm.github.io/resume/'),
  title: {
    default: 'Hieu Doan — Resume',
    template: '%s — Hieu Doan'
  },
  description: DESCRIPTION,
  keywords: ['resume', 'Hieu Doan', 'software engineer', 'YAML', 'Rust'],
  authors: [{ name: 'hieudoan', url: 'https://github.com/hieudoanm' }],
  category: 'personal',
  openGraph: {
    siteName: 'Hieu Doan — Resume',
    type: 'website',
    title: 'Hieu Doan — Resume',
    description: DESCRIPTION,
    url: 'https://hieudoanm.github.io/resume/',
    images: ['/og.png']
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: {
    icon: [
      { url: `${BASE}/favicon.ico`, sizes: 'any' },
      { url: `${BASE}/favicon.svg`, type: 'image/svg+xml' }
    ]
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html
    lang="en"
    data-theme="resume"
    suppressHydrationWarning
    className={`scroll-smooth antialiased motion-reduce:scroll-auto ${inter.className}`}
  >
    <body className="bg-base-100 text-base-content m-0 leading-relaxed">
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <Navbar
        name="resume"
        logoSrc={LOGO}
        links={NAV_LINKS}
        githubUrl={GITHUB}
      />
      {children}
      <Footer
        name="hieudoan"
        tagline="Resume & Resume editor · MIT licensed"
        githubUrl={GITHUB}
      />
    </body>
  </html>
);

export default RootLayout;
