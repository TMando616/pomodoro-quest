# GEMINI.md

このファイルは、**pomodoro-quest** プロジェクトで Gemini CLI が作業する際の指示とコンテキストを提供します。

## プロジェクト概要
- **名称:** pomodoro-quest
- **スタック:** Next.js (App Router), TypeScript, Tailwind CSS v4, Lucide React.
- **目的:** RPG/クエスト要素を組み合わせたポモドーロタイマーアプリ。
- **主要機能:**
  - **クエストタイマー:** 5分〜60分（5分刻み）で時間を設定可能。
  - **冒険者システム:** ユーザー登録・ログイン（インメモリ）により、レベルと経験値を管理。
  - **マルチテーマ:** Shadow（ダーク）とRadiance（ライト）の各5色（計10種）を選択可能。
  - **動的UI:** 背景色、アクセントカラー、グロー効果がテーマに合わせて変化。

## ディレクトリ構成
- `src/app`: ページエントリーポイント。
- `src/components/ui`: 分割されたUIコンポーネント。
- `src/constants`: テーマデータ、時間設定などの定数。
- `src/types`: TypeScriptの型定義。

## ルールと規約
- **コンポーネント:** UIセクションごとにコンポーネントを細かく分割し、`src/components/ui` 内に配置します。
- **スタイリング:** すべてのスタイリングに Tailwind CSS v4 を使用します。動的な色変更には `globals.css` で定義した RGB 変数を使用してください。
- **アイコン:** UI アイコンには `lucide-react` を使用します。
- **命名規則:** コンポーネントは PascalCase、関数や変数は camelCase を使用します。
- **検証:** 変更を確定する前に必ず `npm run lint` を実行してください。
- **コミット:** Conventional Commits（`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:` など）に従ってください。

## 開発ワークフロー
- **開発サーバー:** `npm run dev`
- **ビルド:** `npm run build`
- **リント:** `npm run lint`
