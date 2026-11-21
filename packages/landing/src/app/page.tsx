import type { Metadata } from 'next';
import type { NextPage } from 'next';
import { ResumeView } from '@/components/resume/ResumeView';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

const HomePage: NextPage = () => <ResumeView />;

export default HomePage;
