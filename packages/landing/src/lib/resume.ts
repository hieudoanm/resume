import init, {
  resume_empty,
  resume_parse,
  resume_serialize_json,
  resume_serialize_yaml
} from '@resume/core';
import {
  RESUME_EDUCATION,
  RESUME_EXPERIENCE,
  RESUME_PROFILE,
  RESUME_PROJECTS,
  RESUME_SKILLS
} from '@/lib/resume-data';

// Types mirror crates/resume-core/src/types.rs (serde camelCase). Serde
// itself lives in the @resume/core WASM build — call ensureWasm() once
// (client-side, post-mount) before using the parse/serialize helpers.

export interface ResumeData {
  personal: Personal;
  contact: Contact;
  websites: Websites;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: Language[];
  interests: string;
  references: Reference[];
}

export interface Personal {
  fullName: string;
  jobTitle: string;
}

export interface Contact {
  email: string;
  phone: string;
  address: string;
}

export interface Websites {
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
  relevantSubjects: string;
  interests: string;
}

export interface Project {
  id: string;
  name: string;
  organization: string;
  description: string;
  technologies: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
}

let wasmReady: Promise<unknown> | null = null;

// Initializes the resume-core WASM module. Call once after mount (client
// only) — the resume_* exports throw until this resolves.
export const ensureWasm = (): Promise<unknown> => {
  if (!wasmReady) wasmReady = init();
  return wasmReady;
};

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// resume_empty() returns the serde-default document — identical to
// ResumeData::default()() in resume-core.
export const emptyResume = (): ResumeData =>
  JSON.parse(resume_empty()) as ResumeData;

const periodToDates = (
  period: string
): { startDate: string; endDate: string } => {
  const [start = '', end = ''] = period.split(' - ');
  return { startDate: start.trim(), endDate: end.trim() };
};

const bullets = (summary: string, highlights: string[]): string =>
  [summary, ...highlights.map((h) => `- ${h}`)].filter(Boolean).join('\n');

// Seeds the editor with the same content shown on the home page.
export const defaultResume = (): ResumeData => ({
  personal: {
    fullName: RESUME_PROFILE.name,
    jobTitle: RESUME_PROFILE.title
  },
  contact: {
    email: RESUME_PROFILE.email,
    phone: RESUME_PROFILE.phone,
    address: RESUME_PROFILE.location
  },
  websites: {
    website: RESUME_PROFILE.website,
    linkedin: RESUME_PROFILE.linkedin,
    github: RESUME_PROFILE.github
  },
  summary: RESUME_PROFILE.summary,
  experience: RESUME_EXPERIENCE.map((e) => ({
    id: uid(),
    company: e.company,
    role: e.role,
    location: e.location,
    ...periodToDates(e.period),
    description: bullets(e.summary, e.highlights)
  })),
  education: RESUME_EDUCATION.map((e) => ({
    id: uid(),
    school: e.school,
    degree: e.degree,
    field: '',
    location: e.location,
    ...periodToDates(e.period),
    gpa: '',
    description: e.details,
    relevantSubjects: '',
    interests: ''
  })),
  projects: RESUME_PROJECTS.map((p) => ({
    id: uid(),
    name: p.name,
    organization: '',
    description: p.description,
    technologies: p.tech.join(', ')
  })),
  skills: RESUME_SKILLS.map((g) => ({
    id: uid(),
    category: g.label,
    items: g.skills.join(', ')
  })),
  certifications: [],
  languages: [{ id: uid(), name: 'English', proficiency: 'Native' }],
  interests: '',
  references: []
});

const STORAGE_KEY = 'resume-data';

// resume_parse accepts YAML or JSON (YAML first, JSON fallback) and returns a
// normalized JSON string with every schema field populated.
const parseDocument = (text: string): ResumeData =>
  JSON.parse(resume_parse(text)) as ResumeData;

export const loadResume = (): ResumeData => {
  if (typeof window === 'undefined') return defaultResume();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultResume();
  try {
    const parsed = parseDocument(raw) as Partial<ResumeData>;
    return { ...defaultResume(), ...parsed };
  } catch {
    return defaultResume();
  }
};

export const saveResume = (data: ResumeData): void => {
  window.localStorage.setItem(
    STORAGE_KEY,
    resume_serialize_yaml(JSON.stringify(data))
  );
};

export const serializeResume = (
  data: ResumeData,
  format: 'yaml' | 'json'
): string => {
  const json = JSON.stringify(data);
  return format === 'yaml'
    ? resume_serialize_yaml(json)
    : resume_serialize_json(json);
};

export const parseResume = (text: string): ResumeData => {
  let parsed: ResumeData;
  try {
    parsed = parseDocument(text);
  } catch (e) {
    throw new Error(
      e instanceof Error ? e.message : 'Could not parse document'
    );
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('Empty document');
  return { ...emptyResume(), ...parsed };
};
