/**
 * Emotion Board App - Data Models
 * 感情共有掲示板のデータモデル定義
 */

export type EmotionCategory = 'happy' | 'sad' | 'tired' | 'angry';
export type BoardCategory = 'work' | 'family' | 'school' | 'other';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50plus';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  name: string;
  age: AgeGroup;
  gender: Gender;
  country: string; // ISO 3166-1 alpha-2 country code or empty string
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  userName?: string | null; // 投稿者のニックネーム
  boardCategory: BoardCategory;
  emotionCategory: EmotionCategory;
  country: string; // Country code from user profile
  when: Date;
  where: string;
  who: string;
  what: string;
  how: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount?: number; // いいね数
  isLiked?: boolean; // 自分がいいねしたか
}

export interface FilterCriteria {
  boardCategory?: BoardCategory;
  emotionCategory?: EmotionCategory;
  whenStart?: Date;
  whenEnd?: Date;
  where?: string;
  who?: string;
  how?: string;
}

export const EMOTION_LABELS: Record<EmotionCategory, string> = {
  happy: 'うれしかったこと',
  sad: '悲しかったこと',
  tired: 'つらかったこと',
  angry: 'プンプンしたこと',
};

export const EMOTION_SHORT_LABELS: Record<EmotionCategory, string> = {
  happy: 'うれしい',
  sad: '悲しい',
  tired: 'つらい',
  angry: '怒り',
};

export const EMOTION_ICONS: Record<EmotionCategory, string> = {
  happy: '😊',
  sad: '😢',
  tired: '😫',
  angry: '😠',
};

export const EMOTION_COLORS: Record<EmotionCategory, string> = {
  happy: '#D4AF37',
  sad: '#4A6FA5',
  tired: '#E07856',
  angry: '#D97706',
};

export const BOARD_LABELS: Record<BoardCategory, string> = {
  work: '仕事',
  family: '家庭',
  school: '学校',
  other: 'その他',
};

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '10s': '10代',
  '20s': '20代',
  '30s': '30代',
  '40s': '40代',
  '50plus': '50代以上',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
};

// Country list with flag emoji + name
export const COUNTRIES: { code: string; flag: string; name: string; nameEn: string }[] = [
  { code: 'JP', flag: '🇯🇵', name: '日本', nameEn: 'Japan' },
  { code: 'US', flag: '🇺🇸', name: 'アメリカ', nameEn: 'United States' },
  { code: 'CN', flag: '🇨🇳', name: '中国', nameEn: 'China' },
  { code: 'KR', flag: '🇰🇷', name: '韓国', nameEn: 'South Korea' },
  { code: 'TW', flag: '🇹🇼', name: '台湾', nameEn: 'Taiwan' },
  { code: 'HK', flag: '🇭🇰', name: '香港', nameEn: 'Hong Kong' },
  { code: 'PH', flag: '🇵🇭', name: 'フィリピン', nameEn: 'Philippines' },
  { code: 'TH', flag: '🇹🇭', name: 'タイ', nameEn: 'Thailand' },
  { code: 'VN', flag: '🇻🇳', name: 'ベトナム', nameEn: 'Vietnam' },
  { code: 'ID', flag: '🇮🇩', name: 'インドネシア', nameEn: 'Indonesia' },
  { code: 'MY', flag: '🇲🇾', name: 'マレーシア', nameEn: 'Malaysia' },
  { code: 'SG', flag: '🇸🇬', name: 'シンガポール', nameEn: 'Singapore' },
  { code: 'IN', flag: '🇮🇳', name: 'インド', nameEn: 'India' },
  { code: 'AU', flag: '🇦🇺', name: 'オーストラリア', nameEn: 'Australia' },
  { code: 'NZ', flag: '🇳🇿', name: 'ニュージーランド', nameEn: 'New Zealand' },
  { code: 'GB', flag: '🇬🇧', name: 'イギリス', nameEn: 'United Kingdom' },
  { code: 'FR', flag: '🇫🇷', name: 'フランス', nameEn: 'France' },
  { code: 'DE', flag: '🇩🇪', name: 'ドイツ', nameEn: 'Germany' },
  { code: 'IT', flag: '🇮🇹', name: 'イタリア', nameEn: 'Italy' },
  { code: 'ES', flag: '🇪🇸', name: 'スペイン', nameEn: 'Spain' },
  { code: 'PT', flag: '🇵🇹', name: 'ポルトガル', nameEn: 'Portugal' },
  { code: 'BR', flag: '🇧🇷', name: 'ブラジル', nameEn: 'Brazil' },
  { code: 'MX', flag: '🇲🇽', name: 'メキシコ', nameEn: 'Mexico' },
  { code: 'CA', flag: '🇨🇦', name: 'カナダ', nameEn: 'Canada' },
  { code: 'RU', flag: '🇷🇺', name: 'ロシア', nameEn: 'Russia' },
  { code: 'TR', flag: '🇹🇷', name: 'トルコ', nameEn: 'Turkey' },
  { code: 'SA', flag: '🇸🇦', name: 'サウジアラビア', nameEn: 'Saudi Arabia' },
  { code: 'ZA', flag: '🇿🇦', name: '南アフリカ', nameEn: 'South Africa' },
  { code: 'NG', flag: '🇳🇬', name: 'ナイジェリア', nameEn: 'Nigeria' },
  { code: 'OTHER', flag: '🌍', name: 'その他', nameEn: 'Other' },
];

export function getCountryDisplay(code: string): string {
  const c = COUNTRIES.find((c) => c.code === code);
  if (!c) return code || '🌍';
  return `${c.flag} ${c.nameEn}`;
}
