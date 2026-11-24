export interface ResumeProfile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
  location: string;
  details: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  tech: string[];
  url?: string;
}

export interface ResumeSkillGroup {
  label: string;
  skills: string[];
}

export const RESUME_PROFILE: ResumeProfile = {
  name: 'Hieu Doan',
  title: 'Software Engineer',
  tagline:
    'Engineer with 10+ years of experience building web, mobile, and desktop products.',
  email: 'hieudoanm@users.noreply.github.com',
  phone: '',
  location: 'Ho Chi Minh City, Vietnam',
  website: 'https://hieudoanm.github.io',
  github: 'https://github.com/hieudoanm',
  linkedin: '',
  summary:
    'I build tools that make complex things simple. From full-stack web applications to native desktop apps, I care about clean architecture, developer experience, and shipping reliable software with measurable outcomes.'
};

export const RESUME_EXPERIENCE: ResumeExperience[] = [
  {
    role: 'Engineer, Lead',
    company: 'NAB',
    period: 'Jan 2026 - Present',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Leading a cross-functional engineering team building banking products that serve millions of customers.',
    highlights: [
      'Set the technical direction and shape the platform roadmap',
      'Mentor engineers through design reviews, pairing, and code reviews',
      'Partner with product and design to deliver value in small, safe increments'
    ]
  },
  {
    role: 'Engineer, Senior Analyst',
    company: 'NAB',
    period: 'Jan 2024 - Dec 2025',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Senior engineer on the banking platform, owning delivery across the full stack.',
    highlights: [
      'Designed and shipped scalable services with clear ownership boundaries',
      'Drove incident reduction through better observability and testing',
      'Led the adoption of modern frontend tooling across the team'
    ]
  },
  {
    role: 'Engineer, Analyst',
    company: 'NAB',
    period: 'Aug 2021 - Dec 2023',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Full-stack engineer building and maintaining banking applications end to end.',
    highlights: [
      'Delivered customer-facing features across web and mobile surfaces',
      'Improved build and deployment pipelines for faster releases',
      'Wrote automated tests that caught regressions early in development'
    ]
  },
  {
    role: 'Back-end Engineer',
    company: 'BoostCommerce',
    period: 'Mar 2019 - Apr 2021',
    location: 'Hanoi, Vietnam',
    summary:
      'Back-end engineer for a growing e-commerce platform processing high-volume orders.',
    highlights: [
      'Built reliable order and payment services on the platform',
      'Optimised database queries and caching to cut response times',
      'Collaborated with front-end engineers to ship integrated features'
    ]
  },
  {
    role: 'Front-end Engineer',
    company: 'admetrics',
    period: 'Mar 2017 - Jan 2019',
    location: 'Frankfurt am Main, Germany',
    summary:
      'Front-end engineer building interactive analytics dashboards for advertisers.',
    highlights: [
      'Developed data visualisations and real-time reporting UIs',
      'Introduced reusable component patterns across the product',
      'Worked closely with designers to turn wireframes into polished UIs'
    ]
  },
  {
    role: 'Front-end Engineer',
    company: 'Witrafi',
    period: 'Jan 2015 - Feb 2017',
    location: 'Helsinki, Finland',
    summary: 'Front-end engineer on an online design and collaboration tool.',
    highlights: [
      'Built canvas-based editing features and UI components',
      'Improved performance and responsiveness of complex screens',
      'Contributed to shared tooling and front-end standards'
    ]
  }
];

export const RESUME_EDUCATION: ResumeEducation[] = [
  {
    degree: 'Bachelor of Psychology',
    school: 'RMIT University',
    period: 'Oct 2022 - Sep 2025',
    location: 'Ho Chi Minh City, Vietnam',
    details:
      'Focused on cognitive psychology, statistics, and research methods.'
  },
  {
    degree: 'Bachelor of BIT',
    school: 'LAB University of Applied Sciences',
    period: 'Sep 2013 - Dec 2016',
    location: 'Lahti, Finland',
    details:
      'Software engineering track covering programming, databases, and software design.'
  }
];

export const RESUME_PROJECTS: ResumeProject[] = [
  {
    name: 'mars',
    description:
      'Interactive computing platform — notebook and machine-learning studio in Rust with a Tauri desktop app.',
    tech: ['Rust', 'Tauri', 'TypeScript'],
    url: 'https://github.com/hieudoanm/mars'
  },
  {
    name: 'backers',
    description:
      'Back-end as a Service in a single Rust binary — auth, document DB on SQLite, realtime, webhooks, cron, secrets and an MCP server.',
    tech: ['Rust', 'SQLite', 'WebSocket', 'MCP'],
    url: 'https://github.com/hieudoanm/backers'
  },
  {
    name: 'neuro.imagers',
    description:
      'Local-first desktop workspace for EEG, MEG and MRI research data — deterministic parsing, provenance and checksums.',
    tech: ['Rust', 'Tauri', 'TypeScript'],
    url: 'https://github.com/hieudoanm/neuro.imagers'
  },
  {
    name: 'tracers',
    description:
      'High-performance, multi-language code intelligence and dependency-graph analysis — fast enough to run on every commit.',
    tech: ['Rust', 'Code analysis'],
    url: 'https://github.com/hieudoanm/tracers'
  },
  {
    name: 'linguae',
    description:
      'Language detection with a local character-level model — CLI and desktop app, no cloud, no pretrained weights.',
    tech: ['Rust', 'Python', 'Tauri'],
    url: 'https://github.com/hieudoanm/linguae'
  },
  {
    name: 'vectors',
    description:
      'Raster ↔ vector conversion in Rust — PNG/JPEG to clean SVG paths and back, with editor and browser extensions.',
    tech: ['Rust', 'TypeScript'],
    url: 'https://github.com/hieudoanm/vectors'
  }
];

export const RESUME_SKILLS: ResumeSkillGroup[] = [
  {
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Go', 'Rust', 'Kotlin', 'Swift']
  },
  {
    label: 'Frontend',
    skills: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'DaisyUI']
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Ktor', 'Axum']
  },
  {
    label: 'Tooling',
    skills: ['Docker', 'Turbopack', 'Playwright', 'GitHub Actions', 'Tauri']
  }
];
