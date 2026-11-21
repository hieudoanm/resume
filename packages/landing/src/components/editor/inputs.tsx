'use client';

import type { FC, ReactNode } from 'react';
import type { ResumeData } from '@/lib/resume';
import { uid } from '@/lib/resume';

export type SetResume = (updater: (resume: ResumeData) => ResumeData) => void;

export const Field: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="flex flex-col gap-1">
    <span className="text-base-content/60 text-xs font-semibold tracking-wide uppercase">
      {label}
    </span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="input input-sm w-full"
    />
  </label>
);

export const Area: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <label className="flex flex-col gap-1">
    <span className="text-base-content/60 text-xs font-semibold tracking-wide uppercase">
      {label}
    </span>
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="textarea w-full text-sm"
    />
  </label>
);

export const Card: FC<{
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}> = ({ title, onRemove, children }) => (
  <div className="border-base-content/10 bg-base-100 rounded-xl border p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm font-semibold">{title}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-ghost btn-xs text-error"
        >
          Remove
        </button>
      )}
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
  </div>
);

export const AddButton: FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick
}) => (
  <button
    type="button"
    onClick={onClick}
    className="btn btn-outline btn-sm mt-3"
  >
    + {label}
  </button>
);

export const patch = <K extends keyof ResumeData>(
  setResume: SetResume,
  key: K,
  value: ResumeData[K]
): void => setResume((resume) => ({ ...resume, [key]: value }));

export const patchNested = <K extends 'personal' | 'contact' | 'websites'>(
  setResume: SetResume,
  key: K,
  value: Partial<ResumeData[K]>
): void =>
  setResume((resume) => ({ ...resume, [key]: { ...resume[key], ...value } }));

export const patchItem = <T extends { id: string }>(
  setResume: SetResume,
  key: keyof ResumeData & string,
  id: string,
  updater: (item: T) => T
): void =>
  setResume((resume) => {
    const list = resume[key] as unknown as T[];
    return {
      ...resume,
      [key]: list.map((item) => (item.id === id ? updater(item) : item))
    } as ResumeData;
  });

export const newId = uid;
