/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.visitkorea.or.kr', 'tong.visitkorea.or.kr'],
  },
}

module.exports = nextConfig
