import { Metadata } from 'next';
import { siteDetails } from '@/data/siteDetails';

export const metadata: Metadata = {
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
}; 