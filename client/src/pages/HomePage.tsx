/**
 * Home Page
 * メイン画面 - 投稿一覧表示、タブ切り替え
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, EMOTION_ICONS, EMOTION_COLORS } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Plus, Search, User } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import PostCard from '@/components/PostCard';
import CreatedBy from '@/components/CreatedBy';
import { useLocation } from 'wouter';

const BOARD_CATEGORIES: BoardCategory[] = ['work', 'family', 'school', 'other'];
const EMOTION_CATEGORIES: EmotionCategory[] = ['happy', 'sad', 'tired', 'angry'];

export default function HomePage() {
  const { t } = useTranslation();
  const { posts } = useApp();
  const [, setLocation] = useLocation();
  const [selectedBoard, setSelectedBoard] = useState<BoardCategory>('work');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCategory>('happy');

  const filteredPosts = posts.filter(
    (post) => post.boardCategory === selectedBoard && post.emotionCategory === selectedEmotion
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-foreground leading-tight">{t('app.title')}</h1>
              <p className="text-xs text-muted-foreground italic mt-0.5">{t('app.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <LanguageToggle />
              <button
                onClick={() => setLocation('/search')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={t('nav.search')}
                aria-label={t('nav.search')}
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setLocation('/profile')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={t('nav.profile')}
                aria-label={t('nav.profile')}
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
                  {t(`boards.${category}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground mb-4">
              {t('home.noPosts')}
            </p>
            <Button onClick={() => setLocation('/post')}>
              {t('home.firstPost')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Created By Footer */}
      <div className="pb-4">
        <CreatedBy />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setLocation('/post')}
        className="fixed bottom-28 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        title={t('nav.newPost')}
        aria-label={t('nav.newPost')}
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
                  {t(`emotions.${emotion}Short`)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
