'use client';

import type { FC, ReactNode } from 'react';
import type { ResumeData } from '@/lib/resume';

const splitList = (text: string): string[] =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Minimal markdown renderer for description fields: "- " lines become bullets.
const Description: FC<{ text: string }> = ({ text }) => {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let bullets: string[] = [];
  let para: string[] = [];

  const flush = (key: string) => {
    if (para.length > 0) {
      blocks.push(
        <p key={key} className="text-sm leading-relaxed">
          {para.join(' ')}
        </p>
      );
      para = [];
    }
    if (bullets.length > 0) {
      blocks.push(
        <ul key={`${key}-ul`} className="mt-1 flex flex-col gap-0.5">
          {bullets.map((b) => (
            <li key={b} className="text-sm">
              <span className="text-primary mr-1.5">&rsaquo;</span>
              {b}
            </li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      flush(`p${i}`);
      bullets.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flush(`p${i}`);
    } else {
      if (bullets.length > 0) flush(`b${i}`);
      para.push(trimmed);
    }
  });
  flush('end');

  return <div className="flex flex-col gap-2">{blocks}</div>;
};

const dates = (start: string, end: string): string =>
  [start, end].filter(Boolean).join(' – ') || '—';

const Section: FC<{ title: string; children: ReactNode }> = ({
  title,
  children
}) => (
  <section className="mt-6">
    <h2 className="text-primary mb-3 border-b border-base-300 pb-1 text-xs font-bold tracking-[0.2em] uppercase">
      {title}
    </h2>
    {children}
  </section>
);

const Item: FC<{
  heading: ReactNode;
  meta?: string;
  children?: ReactNode;
}> = ({ heading, meta, children }) => (
  <div className="mb-4">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <div className="text-sm font-semibold">{heading}</div>
      {meta && <div className="text-base-content/50 text-xs">{meta}</div>}
    </div>
    {children}
  </div>
);

export const ResumePreview: FC<{ resume: ResumeData }> = ({ resume }) => {
  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.address,
    resume.websites.website,
    resume.websites.linkedin,
    resume.websites.github
  ].filter(Boolean);

  return (
    <article className="border-base-content/10 bg-base-100 mx-auto w-full max-w-3xl rounded-2xl border p-8 shadow-sm">
      <header className="text-center">
        <h1 className="text-2xl font-bold">
          {resume.personal.fullName || 'Your name'}
        </h1>
        {resume.personal.jobTitle && (
          <p className="text-primary mt-1 text-sm font-medium">
            {resume.personal.jobTitle}
          </p>
        )}
        {contact.length > 0 && (
          <p className="text-base-content/50 mt-2 text-xs">
            {contact.join(' · ')}
          </p>
        )}
      </header>

      {resume.summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((e) => (
            <Item
              key={e.id}
              heading={
                <>
                  {e.role}
                  {e.company && (
                    <span className="text-primary font-medium">
                      {' '}
                      @ {e.company}
                    </span>
                  )}
                </>
              }
              meta={`${dates(e.startDate, e.endDate)}${e.location ? ` · ${e.location}` : ''}`}
            >
              {e.description && <Description text={e.description} />}
            </Item>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e) => (
            <Item
              key={e.id}
              heading={
                <>
                  {e.degree}
                  {e.school && (
                    <span className="text-primary font-medium">
                      {' '}
                      · {e.school}
                    </span>
                  )}
                </>
              }
              meta={`${dates(e.startDate, e.endDate)}${e.gpa ? ` · GPA ${e.gpa}` : ''}`}
            >
              {e.description && <Description text={e.description} />}
              {e.relevantSubjects && (
                <p className="text-base-content/60 mt-1 text-xs">
                  Relevant: {e.relevantSubjects}
                </p>
              )}
            </Item>
          ))}
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((p) => (
            <Item
              key={p.id}
              heading={
                <>
                  {p.name}
                  {p.organization && (
                    <span className="text-primary font-medium">
                      {' '}
                      @ {p.organization}
                    </span>
                  )}
                </>
              }
            >
              {p.description && <Description text={p.description} />}
              {p.technologies && (
                <p className="text-base-content/50 mt-1 text-xs">
                  {splitList(p.technologies).join(' · ')}
                </p>
              )}
            </Item>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resume.skills.map((g) => (
              <div key={g.id}>
                <p className="text-xs font-semibold">{g.category}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {splitList(g.items).map((item) => (
                    <span key={item} className="badge badge-outline badge-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          {resume.certifications.map((c) => (
            <Item
              key={c.id}
              heading={c.name}
              meta={[c.issuer, c.date].filter(Boolean).join(' · ')}
            />
          ))}
        </Section>
      )}

      {resume.languages.length > 0 && (
        <Section title="Languages">
          <p className="text-sm">
            {resume.languages
              .filter((l) => l.name)
              .map((l) =>
                l.proficiency ? `${l.name} (${l.proficiency})` : l.name
              )
              .join(' · ')}
          </p>
        </Section>
      )}

      {resume.interests && (
        <Section title="Interests">
          <p className="text-sm">{resume.interests}</p>
        </Section>
      )}

      {resume.references.length > 0 && (
        <Section title="References">
          {resume.references.map((r) => (
            <Item
              key={r.id}
              heading={r.name}
              meta={[r.title, r.organization, r.email]
                .filter(Boolean)
                .join(' · ')}
            />
          ))}
        </Section>
      )}
    </article>
  );
};

ResumePreview.displayName = 'ResumePreview';
