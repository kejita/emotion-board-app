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
  age: AgeGroup;
  gender: Gender;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  boardCategory: BoardCategory;
  emotionCategory: EmotionCategory;
  when: Date;
  where: string;
  who: string;
  what: string;
  how: string;
  createdAt: Date;
  updatedAt: Date;
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
  angry: '怒りを覚えたこと',
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
