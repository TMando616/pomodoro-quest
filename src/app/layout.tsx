import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* children に各ページの内容（page.tsxの内容）が挿入されます */}
        {children}
      </body>
    </html>
  );
}
