import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EducaTech Online Islamic School | Multi-Tenant Platform',
    short_name: 'EducaTech',
    description: 'Empowering global Islamic academies and schools with white-label virtual Quran education technology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#022c22',
    theme_color: '#064e3b',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
