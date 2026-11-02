import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/research",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/studio/:path*",
        destination: "https://mdazlaanzubair.sanity.studio/:path*",
        permanent: false,
      },
      {
        source: "/writing/:path*",
        destination: "https://letinix.com",
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        // Thumbnails for projects whose preview video is on YouTube.
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
}

export default nextConfig
