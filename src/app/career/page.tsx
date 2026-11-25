import type { Metadata } from 'next';
import CareersHero from '@components/Careers/Hero';
import OpeningsAndForm from '@components/Careers/OpeningsAndForm';
import RoleOverview from '@components/Careers/RoleOverview';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/career');

export default function CareerPage() {
  return (
    <>
      <CareersHero />
      <OpeningsAndForm />
      <RoleOverview />
    </>
  );
}
