'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';
import {
  ensureWasm,
  loadResume,
  parseResume,
  defaultResume,
  saveResume,
  serializeResume,
  type ResumeData
} from '@/lib/resume';
import { ResumePreview } from './ResumePreview';
import type { SetResume } from './inputs';
import { CoreForm } from './forms/CoreForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { ProjectsForm, SkillsForm } from './forms/ProjectSkillForm';
import {
  CertificationsForm,
  LanguagesForm,
  ReferencesForm
} from './forms/ExtrasForm';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'extras', label: 'Extras' }
] as const;

type TabId = (typeof TABS)[number]['id'];

const download = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const ResumeEditor: FC = () => {
  const [resume, setResumeState] = useState<ResumeData>(defaultResume);
  const [tab, setTab] = useState<TabId>('profile');
  const [showPreview, setShowPreview] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // localStorage is an external system and the serde helpers live in WASM —
    // hydrate after mount to avoid server/client markup mismatches.
    let cancelled = false;
    ensureWasm().then(() => {
      if (!cancelled) setResumeState(loadResume());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setResume: SetResume = useCallback((updater) => {
    setResumeState((prev) => {
      const next = updater(prev);
      saveResume(next);
      setSavedAt(new Date().toLocaleTimeString());
      return next;
    });
  }, []);

  const importFile = (file: File | undefined): void => {
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = parseResume(text);
        setResumeState(parsed);
        saveResume(parsed);
        setError(null);
      } catch {
        setError(
          'Could not parse file — expected YAML or JSON matching the resume schema.'
        );
      }
    });
  };

  const reset = (): void => {
    setResumeState(defaultResume());
    saveResume(defaultResume());
    setError(null);
  };

  const renderTab = (): ReactNode => {
    switch (tab) {
      case 'profile':
        return <CoreForm resume={resume} setResume={setResume} />;
      case 'experience':
        return <ExperienceForm resume={resume} setResume={setResume} />;
      case 'education':
        return <EducationForm resume={resume} setResume={setResume} />;
      case 'projects':
        return <ProjectsForm resume={resume} setResume={setResume} />;
      case 'skills':
        return <SkillsForm resume={resume} setResume={setResume} />;
      case 'extras':
        return (
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="mb-3 text-base font-semibold">Certifications</h3>
              <CertificationsForm resume={resume} setResume={setResume} />
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">Languages</h3>
              <LanguagesForm resume={resume} setResume={setResume} />
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">References</h3>
              <ReferencesForm resume={resume} setResume={setResume} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Resume editor</h1>
        <span className="text-base-content/40 text-xs">
          {savedAt
            ? `Saved locally at ${savedAt}`
            : 'Autosaves to this browser'}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".yml,.yaml,.json"
            className="hidden"
            onChange={(e) => {
              importFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() =>
              download('resume.yaml', serializeResume(resume, 'yaml'))
            }
          >
            Export YAML
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() =>
              download('resume.json', serializeResume(resume, 'json'))
            }
          >
            Export JSON
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-error"
            onClick={reset}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm lg:hidden"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 gap-8 lg:h-[calc(100dvh-12rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex min-h-0 flex-col">
          <div className="tabs tabs-boxed mb-4 lg:shrink-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tab ${tab === t.id ? 'tab-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {renderTab()}
          </div>
        </div>
        <div
          className={
            showPreview
              ? 'min-h-0 overflow-y-auto lg:block'
              : 'hidden lg:block lg:overflow-y-auto'
          }
        >
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
};

ResumeEditor.displayName = 'ResumeEditor';
