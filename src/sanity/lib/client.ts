import { createClient } from 'next-sanity';
import { SanityClient } from 'sanity';
import { apiVersion, dataset, projectId, token } from './api';

const client: SanityClient | any = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  perspective: "published",
  useCdn: process.env.NODE_ENV === 'production',
});

const sanityClient: SanityClient = (client as SanityClient);

export default sanityClient;
