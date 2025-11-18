import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Survey Assistant",
  description: "Interactive survey powered by AI conversation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
