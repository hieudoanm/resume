'use client';

import type { FC } from 'react';
import type { ResumeData, Education } from '@/lib/resume';
import { uid } from '@/lib/resume';
import {
  AddButton,
  Area,
  Card,
  Field,
  patchItem,
  type SetResume
} from '../inputs';

const EMPTY: Education = {
  id: '',
  school: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
  relevantSubjects: '',
  interests: ''
};

export const EducationForm: FC<{
  resume: ResumeData;
  setResume: SetResume;
}> = ({ resume, setResume }) => (
  <div className="flex flex-col gap-4">
    {resume.education.map((edu, i) => (
      <Card
        key={edu.id}
        title={`Education ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            education: c.education.filter((e) => e.id !== edu.id)
          }))
        }
      >
        <Field
          label="School"
          value={edu.school}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              school: v
            }))
          }
        />
        <Field
          label="Degree"
          value={edu.degree}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              degree: v
            }))
          }
        />
        <Field
          label="Field of study"
          value={edu.field}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              field: v
            }))
          }
        />
        <Field
          label="Location"
          value={edu.location}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              location: v
            }))
          }
        />
        <Field
          label="Start date"
          value={edu.startDate}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              startDate: v
            }))
          }
        />
        <Field
          label="End date"
          value={edu.endDate}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              endDate: v
            }))
          }
        />
        <Field
          label="GPA"
          value={edu.gpa}
          onChange={(v) =>
            patchItem<Education>(setResume, 'education', edu.id, (e) => ({
              ...e,
              gpa: v
            }))
          }
        />
        <div className="sm:col-span-2">
          <Area
            label="Description"
            value={edu.description}
            rows={3}
            onChange={(v) =>
              patchItem<Education>(setResume, 'education', edu.id, (e) => ({
                ...e,
                description: v
              }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Area
            label="Relevant subjects"
            value={edu.relevantSubjects}
            rows={2}
            onChange={(v) =>
              patchItem<Education>(setResume, 'education', edu.id, (e) => ({
                ...e,
                relevantSubjects: v
              }))
            }
            placeholder="Comma-separated"
          />
        </div>
        <div className="sm:col-span-2">
          <Area
            label="Interests"
            value={edu.interests}
            rows={2}
            onChange={(v) =>
              patchItem<Education>(setResume, 'education', edu.id, (e) => ({
                ...e,
                interests: v
              }))
            }
          />
        </div>
      </Card>
    ))}
    <AddButton
      label="Add education"
      onClick={() =>
        setResume((c) => ({
          ...c,
          education: [...c.education, { ...EMPTY, id: uid() }]
        }))
      }
    />
  </div>
);

EducationForm.displayName = 'EducationForm';
