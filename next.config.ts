import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "learnwithcap.com",
      },
      {
        protocol: "https",
        hostname: "course.learnwithcap.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "yvsbrspvwovaocbbkmqg.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Redirect legacy static pages to the new dynamic paths
  async redirects() {
    return [
      {
        source: "/online-1-1",
        destination: "/courses/online-1-1",
        permanent: true,
      },
      {
        source: "/e-learning",
        destination: "/courses/e-learning",
        permanent: true,
      },
      {
        source: "/course-detail",
        destination: "/courses/enterprise",
        permanent: true,
      },
      {
        source: "/learning-hub",
        destination: "https://course.learnwithcap.com/my-account/",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "https://course.learnwithcap.com/courses/",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "https://course.learnwithcap.com/courses/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
