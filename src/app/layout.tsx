import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageManager } from "@/components/layout/LanguageManager";

// Google Fonts の設定：Geist Sans (サンセリフ体)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Google Fonts の設定：Geist Mono (等幅フォント - RPGのメッセージ風)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * サイトのメタデータ設定
 * ブラウザのタブに表示されるタイトルや説明文を定義します。
 */
export const metadata: Metadata = {
  title: "Pomodoro Quest ⚔️",
  description: "Focus like a hero. A gamified pomodoro timer.",
};

/**
 * ルートレイアウトコンポーネント
 * すべてのページの土台となるHTML構造を定義します。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-500`}
      >
        <ThemeProvider>
          <LanguageManager />
          <Navbar />
          <main className="pb-20 md:pb-0 md:pt-20 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
