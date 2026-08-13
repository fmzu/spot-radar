import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "スポット周辺検索",
  description: "地図上で周辺のスポットを探索できるアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
