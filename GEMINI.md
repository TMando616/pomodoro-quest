# GEMINI.md

このファイルは、**pomodoro-quest** プロジェクトで Gemini CLI が作業する際の指示とコンテキストを提供します。

## プロジェクト概要
- **名称:** pomodoro-quest
- **スタック:** Next.js (App Router), TypeScript, Tailwind CSS v4, Lucide React.
- **目的:** RPG/クエスト要素を組み合わせた没入型ポモドーロタイマーアプリ。

## 実装済み機能 (Total 12)
1.  **クエストタイマー:** 5分〜60分（5分刻み）で時間を設定可能。
2.  **動的経験値システム:** 集中時間（分数 × 10）に応じたEXP獲得とレベルアップ。
3.  **冒険者ギルド (認証):** ユーザー登録・ログイン機能。
4.  **マルチテーマ (Affinity):** Shadow（ダーク）/ Radiance（ライト）各5色の動的UI。
5.  **ステータスHUD:** 名前、称号、レベル、経験値バーのリアルタイム表示。
6.  **休息システム:** クエスト後の Short Rest(5m) / Long Rest(15m) モード。
7.  **クエスト命名機能:** 開始前に任意のクエスト名を設定可能。
8.  **冒険の記録 (履歴):** 過去のクエスト名、時間、獲得EXPの永続ログ。
9.  **称号システム:** 条件達成でアンロックされる称号（Novice, Knight, Sage等）の装備。
10. **ボス討伐モード:** 一時停止不可・EXP2倍・失敗ペナルティありのハードコアモード。
11. **データ永続化:** LocalStorageによるユーザー、セッション、履歴、設定の保存。
12. **演出・サウンドUI:** イベントに応じたサウンド演出（擬似）と設定トグル。

## ディレクトリ構成
- `src/app`: ページエントリーポイント、グローバルスタイル。
- `src/components/ui`: 分割されたUIコンポーネント（HUD, Sidebar, Auth, Panels等）。
- `src/constants`: テーマデータ、称号定義、時間設定などの定数。
- `src/types`: TypeScriptの型定義（User, QuestLog, Title等）。

## ルールと規約
- **コンポーネント:** UIセクションごとにコンポーネントを細かく分割し、`src/components/ui` 内に配置。
- **スタイリング:** Tailwind CSS v4 を使用。動的な色変更には `globals.css` の RGB 変数（`--primary-rgb`等）を利用。
- **検証:** 変更確定前に必ず `npm run lint` を実行。
- **コミット:** Conventional Commits（`feat:`, `fix:`, `refactor:`, `docs:` 等）に従い、1機能1コミットを原則とする。

## 開発ワークフロー
- **開発サーバー:** `npm run dev`
- **ビルド:** `npm run build`
- **リント:** `npm run lint`
