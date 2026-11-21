'use client';

import type { FC } from 'react';
import type { ResumeData, Experience } from '@/lib/resume';
import { uid } from '@/lib/resume';
import {
  AddButton,
  Area,
  Card,
  Field,
  patchItem,
  type SetResume
} from '../inputs';

const EMPTY: Experience = {
  id: '',
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  description: ''
};

export const ExperienceForm: FC<{
  resume: ResumeData;
  setResume: SetResume;
}> = ({ resume, setResume }) => (
  <div className="flex flex-col gap-4">
    {resume.experience.map((exp, i) => (
      <Card
        key={exp.id}
        title={`Experience ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            experience: c.experience.filter((e) => e.id !== exp.id)
          }))
        }
      >
        <Field
          label="Role"
          value={exp.role}
          onChange={(v) =>
            patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
              ...e,
              role: v
            }))
          }
        />
        <Field
          label="Company"
          value={exp.company}
          onChange={(v) =>
            patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
              ...e,
              company: v
            }))
          }
        />
        <Field
          label="Location"
          value={exp.location}
          onChange={(v) =>
            patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
              ...e,
              location: v
            }))
          }
        />
        <Field
          label="Start date"
          value={exp.startDate}
          onChange={(v) =>
            patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
              ...e,
              startDate: v
            }))
          }
          placeholder="Jan 2024"
        />
        <Field
          label="End date"
          value={exp.endDate}
          onChange={(v) =>
            patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
              ...e,
              endDate: v
            }))
          }
          placeholder="Present"
        />
        <div className="sm:col-span-2">
          <Area
            label="Description (markdown supported)"
            value={exp.description}
            rows={6}
            onChange={(v) =>
              patchItem<Experience>(setResume, 'experience', exp.id, (e) => ({
                ...e,
                description: v
              }))
            }
            placeholder={'Summary line\n- Bullet one\n- Bullet two'}
          />
        </div>
      </Card>
    ))}
    <AddButton
      label="Add experience"
      onClick={() =>
        setResume((c) => ({
          ...c,
          experience: [...c.experience, { ...EMPTY, id: uid() }]
        }))
      }
    />
  </div>
);

ExperienceForm.displayName = 'ExperienceForm';
