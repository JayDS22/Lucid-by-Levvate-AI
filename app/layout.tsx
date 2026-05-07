import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucid — The clarity engine for service-based websites",
  description:
    "Paste a URL. Get a clarity score, a 5-dimension rubric, and three concrete edits a copywriter would charge you for. Built in the spirit of Levvate.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
