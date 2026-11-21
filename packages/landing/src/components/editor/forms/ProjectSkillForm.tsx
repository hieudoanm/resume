'use client';

import type { FC } from 'react';
import type { ResumeData, Project, SkillGroup } from '@/lib/resume';
import { uid } from '@/lib/resume';
import {
  AddButton,
  Area,
  Card,
  Field,
  patchItem,
  type SetResume
} from '../inputs';

const EMPTY_PROJECT: Project = {
  id: '',
  name: '',
  organization: '',
  description: '',
  technologies: ''
};

const EMPTY_SKILL: SkillGroup = { id: '', category: '', items: '' };

export const ProjectsForm: FC<{ resume: ResumeData; setResume: SetResume }> = ({
  resume,
  setResume
}) => (
  <div className="flex flex-col gap-4">
    {resume.projects.map((p, i) => (
      <Card
        key={p.id}
        title={`Project ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            projects: c.projects.filter((x) => x.id !== p.id)
          }))
        }
      >
        <Field
          label="Name"
          value={p.name}
          onChange={(v) =>
            patchItem<Project>(setResume, 'projects', p.id, (x) => ({
              ...x,
              name: v
            }))
          }
        />
        <Field
          label="Organization"
          value={p.organization}
          onChange={(v) =>
            patchItem<Project>(setResume, 'projects', p.id, (x) => ({
              ...x,
              organization: v
            }))
          }
        />
        <div className="sm:col-span-2">
          <Area
            label="Description"
            value={p.description}
            rows={3}
            onChange={(v) =>
              patchItem<Project>(setResume, 'projects', p.id, (x) => ({
                ...x,
                description: v
              }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Technologies (comma-separated)"
            value={p.technologies}
            onChange={(v) =>
              patchItem<Project>(setResume, 'projects', p.id, (x) => ({
                ...x,
                technologies: v
              }))
            }
            placeholder="Rust, Next.js, PostgreSQL"
          />
        </div>
      </Card>
    ))}
    <AddButton
      label="Add project"
      onClick={() =>
        setResume((c) => ({
          ...c,
          projects: [...c.projects, { ...EMPTY_PROJECT, id: uid() }]
        }))
      }
    />
  </div>
);

export const SkillsForm: FC<{ resume: ResumeData; setResume: SetResume }> = ({
  resume,
  setResume
}) => (
  <div className="flex flex-col gap-4">
    {resume.skills.map((g, i) => (
      <Card
        key={g.id}
        title={`Skill group ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            skills: c.skills.filter((x) => x.id !== g.id)
          }))
        }
      >
        <Field
          label="Category"
          value={g.category}
          onChange={(v) =>
            patchItem<SkillGroup>(setResume, 'skills', g.id, (x) => ({
              ...x,
              category: v
            }))
          }
          placeholder="Languages, Frontend, Backend…"
        />
        <div className="sm:col-span-2">
          <Field
            label="Items (comma-separated)"
            value={g.items}
            onChange={(v) =>
              patchItem<SkillGroup>(setResume, 'skills', g.id, (x) => ({
                ...x,
                items: v
              }))
            }
            placeholder="TypeScript, Go, Rust"
          />
        </div>
      </Card>
    ))}
    <AddButton
      label="Add skill group"
      onClick={() =>
        setResume((c) => ({
          ...c,
          skills: [...c.skills, { ...EMPTY_SKILL, id: uid() }]
        }))
      }
    />
  </div>
);

ProjectsForm.displayName = 'ProjectsForm';
SkillsForm.displayName = 'SkillsForm';
