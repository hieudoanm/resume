import type { Metadata, NextPage } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import type { IconType } from 'react-icons';
import Features, { type Feature } from '@/components/molecules/Features';
import Hero from '@/components/molecules/Hero';
import CTA from '@/components/molecules/CTA';
import {
  PiBracketsCurly,
  PiBrowser,
  PiFileCode,
  PiFilePdf,
  PiGlobe,
  PiPalette,
  PiRobot
} from 'react-icons/pi';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

const GITHUB = 'https://github.com/hieudoanm/resume';

type TokKind =
  'prompt' | 'cmd' | 'flag' | 'str' | 'key' | 'url' | 'dim' | 'ok' | 'err';
interface Tok {
  t: string;
  c?: TokKind;
}

const TK: Record<TokKind, string> = {
  prompt: 'text-accent select-none',
  cmd: 'font-semibold text-sky-300',
  flag: 'text-amber-400',
  str: 'text-green-300',
  key: 'text-violet-300',
  url: 'text-cyan-300',
  dim: 'text-slate-400',
  ok: 'text-gray-200',
  err: 'text-red-400'
};

interface TerminalProps {
  lines: Tok[][];
}

const Terminal: FC<TerminalProps> = ({ lines }) => (
  <div className="mockup-code">
    {lines.map((line, i) => {
      const prompt = line[0]?.c === 'prompt' ? line[0].t.trim() : null;
      const tokens = prompt ? line.slice(1) : line;
      return (
        <pre key={i} {...(prompt ? { 'data-prefix': prompt } : {})}>
          <code>
            {tokens.map((tok, j) => (
              <span key={j} className={TK[tok.c ?? 'ok']}>
                {tok.t}
              </span>
            ))}
          </code>
        </pre>
      );
    })}
  </div>
);

const FEATURES: Feature[] = [
  {
    title: 'YAML or JSON in, polished output out',
    body: 'A camelCase resume schema covers personal info, experience, education, projects, skills, certifications and more — validated before anything renders.',
    icon: PiBracketsCurly
  },
  {
    title: '64 templates, 8 families',
    body: 'Bands, classic, colorful, minimal, natural, sidebar, soft and specialty — each with light and dark variants, rendered by minijinja.',
    icon: PiPalette
  },
  {
    title: 'Markdown, HTML and PDF',
    body: 'resume md writes a clean Markdown document, pdf shells out to wkhtmltopdf, and serve exposes the same rendering over HTTP.',
    icon: PiFilePdf
  },
  {
    title: 'Built for agents',
    body: 'An MCP stdio server exposes resume_init, resume_pdf and resume_templates as tools — point your coding agent at your resume.yaml.',
    icon: PiRobot
  },
  {
    title: 'HTTP API included',
    body: 'resume serve runs an axum server with POST /api/v1/pdf, health checks and an OpenAPI spec with Swagger UI out of the box.',
    icon: PiGlobe
  },
  {
    title: 'Browser editor',
    body: 'The /editor app edits the same YAML/JSON schema in the browser via the resume-core WASM build — export and feed it straight to the CLI.',
    icon: PiBrowser
  }
];

interface TemplateFamily {
  name: string;
  body: string;
  icon: IconType;
}

const TEMPLATE_FAMILIES: TemplateFamily[] = [
  {
    name: 'bands',
    body: 'Color bands split the page into bold horizontal sections.',
    icon: PiPalette
  },
  {
    name: 'classic',
    body: 'The default — clean serif headings, single column, timeless.',
    icon: PiFileCode
  },
  {
    name: 'colorful',
    body: 'Vivid accents and section markers for a lively first page.',
    icon: PiPalette
  },
  {
    name: 'minimal',
    body: 'Stripped-back typography — maximum whitespace, zero chrome.',
    icon: PiFileCode
  },
  {
    name: 'natural',
    body: 'Warm paper tones with organic section dividers.',
    icon: PiPalette
  },
  {
    name: 'sidebar',
    body: 'Contact and skills rail beside the main experience column.',
    icon: PiFileCode
  },
  {
    name: 'soft',
    body: 'Rounded cards and gentle shadows for a friendly read.',
    icon: PiPalette
  },
  {
    name: 'specialty',
    body: 'Compact layouts tuned for academic and research CVs.',
    icon: PiFileCode
  }
];

const Home: NextPage = () => (
  <>
    <main id="top">
      {/* hero */}
      <Hero
        title="Your resume, as code."
        description="resume is a Rust CLI that renders a YAML or JSON resume into Markdown, HTML or PDF — 64 templates, an MCP server for AI agents, an HTTP API, and a browser editor that produces the same schema. One binary, fully offline, no accounts."
        primary={{ label: 'Try the editor', href: '/editor/' }}
        secondary={{ label: 'Source on GitHub', href: GITHUB, external: true }}
        stats={[
          { value: '64', label: 'templates' },
          { value: '6', label: 'CLI commands' },
          { value: '0', label: 'accounts needed' }
        ]}
      >
        <Terminal
          lines={[
            [
              { t: '$ ', c: 'prompt' },
              {
                t: 'curl -fsSL https://raw.githubusercontent.com/hieudoanm/resume/master/scripts/install.sh | bash',
                c: 'url'
              }
            ],
            [
              { t: '$ ', c: 'prompt' },
              { t: 'resume', c: 'cmd' },
              { t: ' init', c: 'dim' }
            ],
            [{ t: 'Created resume.yaml', c: 'ok' }],
            [
              { t: '$ ', c: 'prompt' },
              { t: 'resume', c: 'cmd' },
              { t: ' md', c: 'dim' }
            ],
            [{ t: 'Generated resume.md', c: 'ok' }],
            [
              { t: '$ ', c: 'prompt' },
              { t: 'resume', c: 'cmd' },
              { t: ' pdf', c: 'dim' },
              { t: ' --template', c: 'flag' },
              { t: ' sidebar/classic', c: 'str' }
            ],
            [{ t: 'Generated resume.pdf', c: 'ok' }],
            [
              { t: '$ ', c: 'prompt' },
              { t: 'resume', c: 'cmd' },
              { t: ' validate', c: 'dim' }
            ],
            [{ t: 'resume.yaml is valid', c: 'ok' }]
          ]}
        />
      </Hero>

      <Features
        title="Edit once. Ship everywhere."
        description="resume-core is a pure Rust crate — the same code path powers the CLI, the HTTP server, the MCP tools and the browser editor's WASM build."
        features={FEATURES}
      />

      {/* templates */}
      <section id="templates" className="bg-gray-50 py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="m-0 text-3xl leading-tight tracking-normal text-balance">
              Eight families. Sixty-four looks.
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Pick a family, then a light or dark variant —{' '}
              <code className="text-primary font-mono text-sm">
                --template family/variant
              </code>{' '}
              on any render command.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_FAMILIES.map((f) => (
              <div
                key={f.name}
                className="card border-base-300 bg-base-100 border p-6"
              >
                <div className="bg-primary/10 text-primary mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base-content m-0 mb-1 text-lg leading-tight text-balance">
                  {f.name}
                </h3>
                <p className="text-base-content/60 text-sm">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            The full template list lives in{' '}
            <Link href="/docs/guides/templates/" className="text-primary">
              Templates
            </Link>
            .
          </p>
        </div>
      </section>

      {/* quickstart */}
      <section id="quickstart" className="py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="m-0 text-3xl leading-tight tracking-normal text-balance">
              From install script to PDF in four commands.
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Prebuilt binaries on the{' '}
              <Link
                href={`${GITHUB}/releases`}
                className="text-primary"
                target="_blank"
                rel="noreferrer"
              >
                releases page
              </Link>
              , or build from source with Cargo.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Terminal
              lines={[
                [
                  { t: '$ ', c: 'prompt' },
                  {
                    t: 'git clone https://github.com/hieudoanm/resume',
                    c: 'url'
                  }
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'cd', c: 'cmd' },
                  { t: ' resume', c: 'dim' }
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'cargo', c: 'cmd' },
                  { t: ' build ', c: 'dim' },
                  { t: '--release', c: 'flag' },
                  { t: ' -p ', c: 'dim' },
                  { t: 'resume-cli', c: 'flag' }
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: './target/release/resume', c: 'cmd' },
                  { t: ' --version', c: 'dim' }
                ],
                [{ t: 'resume 0.0.1', c: 'ok' }]
              ]}
            />
            <Terminal
              lines={[
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'resume', c: 'cmd' },
                  { t: ' init', c: 'dim' }
                ],
                [{ t: 'Created resume.yaml', c: 'ok' }],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'resume', c: 'cmd' },
                  { t: ' md', c: 'dim' },
                  { t: ' -t', c: 'flag' },
                  { t: ' minimal/minimal', c: 'str' }
                ],
                [{ t: 'Generated resume.md', c: 'ok' }],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'resume', c: 'cmd' },
                  { t: ' pdf', c: 'dim' },
                  { t: ' -o', c: 'flag' },
                  { t: ' cv.pdf', c: 'str' }
                ],
                [{ t: 'Generated cv.pdf', c: 'ok' }],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'resume', c: 'cmd' },
                  { t: ' serve', c: 'dim' }
                ],
                [{ t: 'listening on http://localhost:8080', c: 'dim' }]
              ]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Full docs at{' '}
            <Link href="/docs/" className="text-primary">
              /docs
            </Link>
            . Everything runs locally — your resume never leaves the machine.
          </p>
        </div>
      </section>

      <CTA
        title="Your next resume shouldn't live in a word processor."
        description="Keep resume.yaml in git, render it anywhere, and let your agent help you edit it over MCP."
        primary={{ label: 'Download', href: '/downloads/' }}
        secondary={{ label: 'View Docs', href: '/docs/' }}
      />
    </main>
  </>
);

export default Home;
