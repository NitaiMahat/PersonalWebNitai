import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nitai Mahat | Software Developer",
  description:
    "Computer Science and Data Science student building reliable backend, full-stack, and research software with Java, Python, TypeScript, and Flutter.",
  openGraph: {
    title: "Nitai Mahat | Software Developer",
    description:
      "Computer Science and Data Science student building reliable backend, full-stack, and research software.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
