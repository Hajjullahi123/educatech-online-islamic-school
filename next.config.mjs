/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: fontOptimization(),
};

function fontOptimization() {
  return true;
}

export default nextConfig;
