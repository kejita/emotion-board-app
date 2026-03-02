/**
 * Home Page
 * メイン画面 - 投稿一覧表示、タブ切り替え
 * 
 * Design: Emotion Palette - Warm Minimalism
 * - 感情色で左ボーダー装飾
 * - 温かみのあるカード型レイアウト
 * - 直感的なアイコンナビゲーション
 */

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, BOARD_LABELS, EMOTION_ICONS, EMOTION_LABELS, EMOTION_SHORT_LABELS, EMOTION_COLORS } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Plus, Search, User } from 'lucide-react';
import PostCard from '@/components/PostCard';
import CreatedBy from '@/components/CreatedBy';
import { useLocation } from 'wouter';

const BOARD_CATEGORIES: BoardCategory[] = ['work', 'family', 'school', 'other'];
const EMOTION_CATEGORIES: EmotionCategory[] = ['happy', 'sad', 'tired', 'angry'];

export default function HomePage() {
  const { posts, user } = useApp();
  const [, setLocation] = useLocation();
  const [selectedBoard, setSelectedBoard] = useState<BoardCategory>('work');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCategory>('happy');

  const filteredPosts = posts.filter(
    (post) => post.boardCategory === selectedBoard && post.emotionCategory === selectedEmotion
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-foreground leading-tight">Emotion Board</h1>
              <p className="text-xs text-muted-foreground italic mt-0.5">Express your feelings in your own words</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLocation('/search')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="検索"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setLocation('/profile')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="プロフィール"
              >
                <User className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Board Category Tabs */}
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-2">
              {BOARD_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedBoard(category)}
                  className={`px-4 py-2 rounded-full font-body font-semibold whitespace-nowrap transition-all ${
                    selectedBoard === category
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {BOARD_LABELS[category]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground mb-4">
              投稿がまだありません
            </p>
            <Button onClick={() => setLocation('/post')}>
              最初の投稿をしてみる
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Created By Footer */}
      <div className="pb-4">
        <CreatedBy />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setLocation('/post')}
        className="fixed bottom-28 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        title="新しい投稿"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Emotion Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="container">
          <div className="grid grid-cols-4 gap-2 py-3">
            {EMOTION_CATEGORIES.map((emotion) => (
              <button
                key={emotion}
                onClick={() => setSelectedEmotion(emotion)}
                className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all ${
                  selectedEmotion === emotion
                    ? 'bg-primary bg-opacity-20'
                    : 'hover:bg-secondary'
                }`}
                style={{
                  borderColor: selectedEmotion === emotion ? EMOTION_COLORS[emotion] : 'transparent',
                  borderWidth: selectedEmotion === emotion ? '2px' : '0px',
                }}
              >
                <span className="text-2xl mb-1">{EMOTION_ICONS[emotion]}</span>
                <span className="font-body-sm text-foreground text-center text-xs">
                  {EMOTION_SHORT_LABELS[emotion]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
