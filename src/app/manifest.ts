import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Al-Huda Quran Academy | Online Islamic School',
    short_name: 'Al-Huda',
    description: 'Authentic Quranic education, verified Ijazah scholars, and real-time interactive Tajweed and Riwayah tracks.',
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
