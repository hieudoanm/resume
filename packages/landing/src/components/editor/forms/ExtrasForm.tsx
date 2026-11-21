'use client';

import type { FC } from 'react';
import type {
  Certification,
  ResumeData,
  Language,
  Reference
} from '@/lib/resume';
import { uid } from '@/lib/resume';
import { AddButton, Card, Field, patchItem, type SetResume } from '../inputs';

const EMPTY_CERT: Certification = { id: '', name: '', issuer: '', date: '' };
const EMPTY_LANG: Language = { id: '', name: '', proficiency: '' };
const EMPTY_REF: Reference = {
  id: '',
  name: '',
  title: '',
  organization: '',
  email: ''
};

export const CertificationsForm: FC<{
  resume: ResumeData;
  setResume: SetResume;
}> = ({ resume, setResume }) => (
  <div className="flex flex-col gap-4">
    {resume.certifications.map((cert, i) => (
      <Card
        key={cert.id}
        title={`Certification ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            certifications: c.certifications.filter((x) => x.id !== cert.id)
          }))
        }
      >
        <Field
          label="Name"
          value={cert.name}
          onChange={(v) =>
            patchItem<Certification>(
              setResume,
              'certifications',
              cert.id,
              (x) => ({
                ...x,
                name: v
              })
            )
          }
        />
        <Field
          label="Issuer"
          value={cert.issuer}
          onChange={(v) =>
            patchItem<Certification>(
              setResume,
              'certifications',
              cert.id,
              (x) => ({
                ...x,
                issuer: v
              })
            )
          }
        />
        <Field
          label="Date"
          value={cert.date}
          onChange={(v) =>
            patchItem<Certification>(
              setResume,
              'certifications',
              cert.id,
              (x) => ({
                ...x,
                date: v
              })
            )
          }
        />
      </Card>
    ))}
    <AddButton
      label="Add certification"
      onClick={() =>
        setResume((c) => ({
          ...c,
          certifications: [...c.certifications, { ...EMPTY_CERT, id: uid() }]
        }))
      }
    />
  </div>
);

export const LanguagesForm: FC<{
  resume: ResumeData;
  setResume: SetResume;
}> = ({ resume, setResume }) => (
  <div className="flex flex-col gap-4">
    {resume.languages.map((lang, i) => (
      <Card
        key={lang.id}
        title={`Language ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            languages: c.languages.filter((x) => x.id !== lang.id)
          }))
        }
      >
        <Field
          label="Name"
          value={lang.name}
          onChange={(v) =>
            patchItem<Language>(setResume, 'languages', lang.id, (x) => ({
              ...x,
              name: v
            }))
          }
        />
        <Field
          label="Proficiency"
          value={lang.proficiency}
          onChange={(v) =>
            patchItem<Language>(setResume, 'languages', lang.id, (x) => ({
              ...x,
              proficiency: v
            }))
          }
          placeholder="Native, Fluent, B2…"
        />
      </Card>
    ))}
    <AddButton
      label="Add language"
      onClick={() =>
        setResume((c) => ({
          ...c,
          languages: [...c.languages, { ...EMPTY_LANG, id: uid() }]
        }))
      }
    />
  </div>
);

export const ReferencesForm: FC<{
  resume: ResumeData;
  setResume: SetResume;
}> = ({ resume, setResume }) => (
  <div className="flex flex-col gap-4">
    {resume.references.map((ref, i) => (
      <Card
        key={ref.id}
        title={`Reference ${i + 1}`}
        onRemove={() =>
          setResume((c) => ({
            ...c,
            references: c.references.filter((x) => x.id !== ref.id)
          }))
        }
      >
        <Field
          label="Name"
          value={ref.name}
          onChange={(v) =>
            patchItem<Reference>(setResume, 'references', ref.id, (x) => ({
              ...x,
              name: v
            }))
          }
        />
        <Field
          label="Title"
          value={ref.title}
          onChange={(v) =>
            patchItem<Reference>(setResume, 'references', ref.id, (x) => ({
              ...x,
              title: v
            }))
          }
        />
        <Field
          label="Organization"
          value={ref.organization}
          onChange={(v) =>
            patchItem<Reference>(setResume, 'references', ref.id, (x) => ({
              ...x,
              organization: v
            }))
          }
        />
        <Field
          label="Email"
          type="email"
          value={ref.email}
          onChange={(v) =>
            patchItem<Reference>(setResume, 'references', ref.id, (x) => ({
              ...x,
              email: v
            }))
          }
        />
      </Card>
    ))}
    <AddButton
      label="Add reference"
      onClick={() =>
        setResume((c) => ({
          ...c,
          references: [...c.references, { ...EMPTY_REF, id: uid() }]
        }))
      }
    />
  </div>
);

CertificationsForm.displayName = 'CertificationsForm';
LanguagesForm.displayName = 'LanguagesForm';
ReferencesForm.displayName = 'ReferencesForm';
