import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker用: 実行に必要な最小ファイル一式を .next/standalone に出力する
  output: "standalone",
};

export default nextConfig;
