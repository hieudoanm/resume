'use client';

import type { FC } from 'react';
import type { ResumeData } from '@/lib/resume';
import { Area, Field, patch, patchNested, type SetResume } from '../inputs';

export const CoreForm: FC<{ resume: ResumeData; setResume: SetResume }> = ({
  resume,
  setResume
}) => {
  const setPersonal = (value: Partial<ResumeData['personal']>) =>
    patchNested(setResume, 'personal', value);
  const setContact = (value: Partial<ResumeData['contact']>) =>
    patchNested(setResume, 'contact', value);
  const setWebsites = (value: Partial<ResumeData['websites']>) =>
    patchNested(setResume, 'websites', value);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">Personal</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Full name"
            value={resume.personal.fullName}
            onChange={(v) => setPersonal({ fullName: v })}
          />
          <Field
            label="Job title"
            value={resume.personal.jobTitle}
            onChange={(v) => setPersonal({ jobTitle: v })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">Contact</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Email"
            type="email"
            value={resume.contact.email}
            onChange={(v) => setContact({ email: v })}
          />
          <Field
            label="Phone"
            value={resume.contact.phone}
            onChange={(v) => setContact({ phone: v })}
          />
        </div>
        <Field
          label="Address"
          value={resume.contact.address}
          onChange={(v) => setContact({ address: v })}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">Websites</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Website"
            value={resume.websites.website}
            onChange={(v) => setWebsites({ website: v })}
            placeholder="https://…"
          />
          <Field
            label="LinkedIn"
            value={resume.websites.linkedin}
            onChange={(v) => setWebsites({ linkedin: v })}
            placeholder="https://linkedin.com/in/…"
          />
          <Field
            label="GitHub"
            value={resume.websites.github}
            onChange={(v) => setWebsites({ github: v })}
            placeholder="https://github.com/…"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">Summary</h3>
        <Area
          label="Professional summary"
          value={resume.summary}
          onChange={(v) => patch(setResume, 'summary', v)}
          rows={5}
        />
        <Area
          label="Interests"
          value={resume.interests}
          onChange={(v) => patch(setResume, 'interests', v)}
          rows={2}
          placeholder="Optional — e.g. open source, hiking, photography"
        />
      </section>
    </div>
  );
};

CoreForm.displayName = 'CoreForm';
