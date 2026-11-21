'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FC } from 'react';
import {
  PiArrowDown,
  PiEnvelopeSimple,
  PiGithubLogo,
  PiGlobe,
  PiMapPin,
  PiPencilSimple
} from 'react-icons/pi';
import {
  RESUME_EDUCATION,
  RESUME_EXPERIENCE,
  RESUME_PROFILE,
  RESUME_PROJECTS,
  RESUME_SKILLS
} from './data';
import {
  EducationSection,
  ExperienceSection,
  ProjectSection,
  SkillSection
} from './Sections';

export const ResumeView: FC = () => {
  const [showContact, setShowContact] = useState(false);

  const scrollToExperience = () => {
    document
      .getElementById('experience')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <section className="flex flex-col items-center py-14 text-center">
        <span className="badge badge-neutral mb-6 rounded-full">
          {RESUME_PROFILE.title}
        </span>
        <h1 className="mb-4 text-4xl md:text-5xl">{RESUME_PROFILE.name}</h1>
        <p className="text-base-content/50 mb-8 max-w-2xl text-sm leading-relaxed">
          {RESUME_PROFILE.tagline}
        </p>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="border-base-content/20 text-base-content/50 flex items-center gap-2 rounded-full border px-4 py-2">
            <PiMapPin className="h-3.5 w-3.5" />
            {RESUME_PROFILE.location}
          </span>
          <a
            href={`mailto:${RESUME_PROFILE.email}`}
            className="border-base-content/20 text-base-content/50 hover:border-primary/50 hover:text-primary flex items-center gap-2 rounded-full border px-4 py-2 transition-colors"
          >
            <PiEnvelopeSimple className="h-3.5 w-3.5" />
            {RESUME_PROFILE.email}
          </a>
          <a
            href={RESUME_PROFILE.website}
            target="_blank"
            rel="noreferrer"
            className="border-base-content/20 text-base-content/50 hover:border-primary/50 hover:text-primary flex items-center gap-2 rounded-full border px-4 py-2 transition-colors"
          >
            <PiGlobe className="h-3.5 w-3.5" />
            {RESUME_PROFILE.website.replace('https://', '')}
          </a>
          <a
            href={RESUME_PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="border-base-content/20 text-base-content/50 hover:border-primary/50 hover:text-primary flex items-center gap-2 rounded-full border px-4 py-2 transition-colors"
          >
            <PiGithubLogo className="h-3.5 w-3.5" />
            GitHub
          </a>
          <button
            type="button"
            onClick={() => setShowContact((v) => !v)}
            className="border-base-content/20 text-base-content/50 hover:border-primary/50 hover:text-primary flex items-center gap-2 rounded-full border px-4 py-2 transition-colors"
          >
            {showContact ? 'Hide contact' : 'Contact'}
          </button>
        </div>
        {showContact && (
          <p className="text-base-content/60 -mt-6 mb-10 text-sm">
            {RESUME_PROFILE.phone || 'Phone on request'} · Open to opportunities
          </p>
        )}
        <p className="text-base-content/60 mb-10 max-w-3xl text-sm leading-relaxed">
          {RESUME_PROFILE.summary}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={scrollToExperience}
          >
            View experience <PiArrowDown className="h-4 w-4" />
          </button>
          <Link href="/editor" className="btn btn-ghost">
            <PiPencilSimple className="h-4 w-4" />
            Edit resume
          </Link>
        </div>
      </section>

      <ExperienceSection experiences={RESUME_EXPERIENCE} />
      <ProjectSection projects={RESUME_PROJECTS} />
      <SkillSection skills={RESUME_SKILLS} />
      <EducationSection education={RESUME_EDUCATION} />
    </div>
  );
};

ResumeView.displayName = 'ResumeView';
