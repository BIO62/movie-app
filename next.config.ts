import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:[
      {
        hostname: "image.tmdb.org",
      },
    ],
  },
  env:{
    TMDB_BASE_URL: process.env.NEXT_PUBLIC_TMDB_BASE_URL || "",
    TMDB_API_TOKEN: process.env.NEXT_PUBLIC_TMDB_API_TOKEN || "",
    TMDB_IMAGE_SERVICE_URL: process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL || "",
    TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
  },
};

export default nextConfig;
