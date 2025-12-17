import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    domains: ["ghouamjbnpoytymrtpbt.supabase.co"],
    //domains: ["<project-id>.supabase.co"],
  },
};

export default nextConfig;
