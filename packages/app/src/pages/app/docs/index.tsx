'use client';

import { YAML_TEMPLATE } from '@docs/constants/app';
import { useDebounce } from '@docs/hooks/use-debounce';
import { yaml2pdfMake } from '@docs/services/yaml2pdfmake/yaml2pdfmake.service';
import { NextPage } from 'next';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useEffect, useMemo, useRef, useState } from 'react';

(pdfMake as any).vfs = pdfFonts.vfs;

type ParseResult = { ok: true; doc: unknown } | { ok: false; error: string };

const AppPage: NextPage = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [{ yaml }, setState] = useState<{ yaml: string }>({
    yaml: YAML_TEMPLATE,
  });

  const debouncedYaml = useDebounce(yaml, 500);

  /* ============================
     YAML VALIDATION
  ============================ */

  const parseResult: ParseResult = useMemo(() => {
    try {
      const doc = yaml2pdfMake(debouncedYaml);
      return { ok: true, doc };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Invalid YAML structure',
      };
    }
  }, [debouncedYaml]);

  /* ============================
     PDF RENDER
  ============================ */
  useEffect(() => {
    if (!parseResult.ok) return;

    let cancelled = false;

    (async () => {
      const blob = await pdfMake.createPdf(parseResult.doc as any).getBlob();

      if (cancelled) return;

      const url = URL.createObjectURL(blob);
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [parseResult]);

  /* ============================
     UI
  ============================ */

  return (
    <div
      className="bg-base-100 text-base-content min-h-screen font-sans"
      data-theme="luxury">
      {/* ── NAV ── */}
      <div className="navbar bg-base-100/85 border-base-300 sticky top-0 z-50 border-b px-6 backdrop-blur-xl md:px-12">
        <div className="navbar-start">
          <span className="text-primary font-serif text-2xl font-bold tracking-widest">
            Resume
          </span>
        </div>
        <div className="navbar-end">
          <button className="btn btn-primary btn-sm">Export PDF</button>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative mx-auto max-w-5xl px-6 py-16 text-center md:px-12">
        <div className="bg-primary/5 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-3xl" />

        <p className="text-primary mb-4 text-xs tracking-[0.2em] uppercase">
          Document builder
        </p>

        <h1 className="mb-6 font-serif text-5xl leading-tight font-black md:text-6xl">
          Build resumes
          <br />
          with <span className="text-primary">precision</span>
        </h1>

        <p className="text-base-content/60 mx-auto max-w-xl text-base md:text-lg">
          Write structured YAML and generate beautifully formatted PDFs in
          real-time. Fast, flexible, and developer-friendly.
        </p>
      </section>

      <div className="border-base-300 mx-6 border-t md:mx-12" />

      {/* ── MAIN ── */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <div className="grid h-[70vh] gap-6 md:grid-cols-2">
          {/* YAML Editor */}
          <div className="bg-base-200 border-base-300 flex flex-col overflow-hidden rounded-2xl border">
            <div className="border-base-300 text-base-content/50 border-b px-5 py-3 text-sm">
              YAML Editor
            </div>

            {!parseResult.ok && (
              <div className="border-error/30 bg-error/10 text-error border-b px-5 py-3 text-sm">
                <strong>Error:</strong> {parseResult.error}
              </div>
            )}

            <textarea
              className={`flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm outline-none ${
                !parseResult.ok ? 'bg-error/5' : ''
              }`}
              value={yaml}
              onChange={(e) =>
                setState((prev) => ({ ...prev, yaml: e.target.value }))
              }
              spellCheck={false}
            />
          </div>

          {/* PDF Preview */}
          <div className="bg-base-200 border-base-300 relative flex flex-col overflow-hidden rounded-2xl border">
            <div className="border-base-300 text-base-content/50 border-b px-5 py-3 text-sm">
              Preview
            </div>

            {!parseResult.ok && (
              <div className="bg-base-200/80 text-base-content/60 absolute inset-0 z-10 flex items-center justify-center text-sm">
                Fix YAML errors to update preview
              </div>
            )}

            <iframe
              ref={iframeRef}
              title="Resume Preview"
              className="w-full flex-1"
            />
          </div>
        </div>
      </section>

      <div className="border-base-300 mx-6 border-t md:mx-12" />

      {/* ── FOOTER ── */}
      <footer className="py-12 text-center">
        <p className="text-primary mb-2 font-serif text-2xl">Resume Builder</p>
        <p className="text-base-content/40 text-sm">
          Structured writing · Beautiful output · Inspired by Forma
        </p>
      </footer>
    </div>
  );
};

export default AppPage;
