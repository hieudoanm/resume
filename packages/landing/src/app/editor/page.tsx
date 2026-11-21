import type { Metadata } from 'next';
import type { NextPage } from 'next';
import { ResumeEditor } from '@/components/editor/ResumeEditor';

export const metadata: Metadata = {
  title: 'Resume editor',
  description:
    'Edit your resume in the browser and export YAML or JSON compatible with the resume CLI.',
  alternates: { canonical: '/editor/' }
};

const EditorPage: NextPage = () => <ResumeEditor />;

export default EditorPage;
