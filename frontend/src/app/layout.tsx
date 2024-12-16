import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog App",
  description: "A blog app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
