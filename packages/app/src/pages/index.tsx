import {
  LandingContent,
  LandingTemplate,
} from '@docs/templates/LandingTemplate';
import { NextPage } from 'next';

const content: LandingContent = {
  navbar: {
    title: 'Resume Generator',
    buttonText: 'Create Resume',
    buttonHref: '/app',
  },
  hero: {
    title: 'Build Professional Resumes Instantly',
    tagline:
      'A fast, intuitive, and privacy-first resume generator that works entirely in your browser.',
    buttonText: 'Start Creating',
    buttonHref: '/app',
  },
  features: {
    title: 'Features',
    items: [
      {
        id: 'instant-templates',
        emoji: '📄',
        title: 'Instant Templates',
        description:
          'Choose from professional resume templates and start building your CV in seconds.',
      },
      {
        id: 'drag-drop-editor',
        emoji: '✏️',
        title: 'Drag & Drop Editor',
        description:
          'Easily add sections, text, and skills with an intuitive drag-and-drop interface.',
      },
      {
        id: 'custom-designs',
        emoji: '🎨',
        title: 'Custom Designs',
        description:
          'Personalize fonts, colors, and layouts to match your style and industry standards.',
      },
      {
        id: 'privacy-first',
        emoji: '🔒',
        title: 'Privacy First',
        description:
          'All your resumes stay in your browser. Nothing is uploaded or stored remotely.',
      },
      {
        id: 'export-options',
        emoji: '💾',
        title: 'Export Options',
        description:
          'Download your resume as PDF, DOCX, or share a secure link instantly.',
      },
      {
        id: 'easy-updates',
        emoji: '⚡',
        title: 'Easy Updates',
        description:
          'Update your resume anytime without starting from scratch. Keep it always ready for applications.',
      },
    ],
  },
  cta: {
    title: 'Start Crafting Your Resume Today',
    description:
      'Create a professional resume quickly, securely, and with full control. No signup required.',
    buttonText: 'Create Resume',
    buttonHref: '/app',
  },
  footer: {
    name: 'Resume Generator',
  },
};

const HomePage: NextPage = () => {
  return <LandingTemplate content={content} />;
};

export default HomePage;
