/**
 * 冒険者（ユーザー）の情報を表す型
 */
export type User = {
  id: string;               // 一意の識別子（タイムスタンプなど）
  username: string;         // 冒険者名
  level: number;            // 現在のレベル
  exp: number;              // 現在の経験値 (0〜999)
  role: 'user' | 'admin';   // 役割（管理者機能の実装準備）
  joinedAt: number;         // ギルド（アプリ）に登録した日
  totalFocusTime: number;   // 累計集中時間（分）
  completedQuestsCount: number; // 累計クリアクエスト数
  unlockedTitles: string[]; // アンロック済みの称号IDのリスト
  currentTitleId?: string;  // 現在セットしている称号のID
};

/**
 * 称号の定義を表す型
 */
export type Title = {
  id: string;               // 称号ID
  name: string;             // 表示名（例：Focus Knight）
  description: string;      // 称号の説明
  // アンロック条件を判定する関数
  condition: (user: User, logs: QuestLog[]) => boolean;
};

/**
 * 完了したクエストの履歴を表す型
 */
export type QuestLog = {
  id: string;        // 履歴ID
  userId: string;    // 実行したユーザーのID（ゲストなら 'guest'）
  name: string;      // クエスト名
  duration: number;  // 集中した時間（分）
  difficulty: 'easy' | 'normal' | 'hard' | 'insane'; // 難易度
  earnedExp: number; // 獲得した経験値
  createdAt: number; // 完了した日時（タイムスタンプ）
};

/**
 * 日々の振り返り（冒険日誌）の記録を表す型
 */
export type JournalEntry = {
  id: string;          // 日誌ID
  userId: string;      // 記録したユーザーのID
  questLogId?: string; // 関連するクエスト履歴のID（任意）
  content: string;     // 日誌の内容
  mood: 'great' | 'good' | 'tired' | 'bad'; // その時の気分
  createdAt: number;   // 記録した日時
};

/**
 * テーマのカテゴリ（ダーク/ライト）
 */
export type ThemeCategory = 'dark' | 'light';

/**
 * 個別のテーマカラー設定を表す型
 */
export type Theme = {
  name: string;  // テーマID（CSSの data-theme に対応）
  label: string; // 表示用の名前
  color: string; // ボタンの色を表すTailwindクラス（例：bg-[#10b981]）
};
