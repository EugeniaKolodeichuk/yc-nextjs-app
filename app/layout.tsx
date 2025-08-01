import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/WorkSans-ExtraLight.ttf", weight: "100", style: "normal" },
  ],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "YC Directory",
  description: "Pitch, Vote and Grow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Используем className, а не variable */}
      <body className={workSans.className}>
        {children}
      </body>
    </html>
  );
}
