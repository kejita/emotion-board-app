/**
 * Search Page
 * フィルター検索画面
 */

import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, FilterCriteria, BOARD_LABELS, EMOTION_LABELS, EMOTION_ICONS } from '@/types/models';
import { ArrowLeft } from 'lucide-react';
import PostCard from '@/components/PostCard';

const BOARD_CATEGORIES: BoardCategory[] = ['work', 'family', 'school', 'other'];
const EMOTION_CATEGORIES: EmotionCategory[] = ['happy', 'sad', 'tired', 'angry'];

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const { getFilteredPosts } = useApp();

  const [filters, setFilters] = useState<FilterCriteria>({});
  const [whenStart, setWhenStart] = useState('');
  const [whenEnd, setWhenEnd] = useState('');
  const [where, setWhere] = useState('');
  const [who, setWho] = useState('');
  const [how, setHow] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<BoardCategory | undefined>();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCategory | undefined>();

  const filteredPosts = useMemo(() => {
    const criteria: FilterCriteria = {};
    if (selectedBoard) criteria.boardCategory = selectedBoard;
    if (selectedEmotion) criteria.emotionCategory = selectedEmotion;
    if (whenStart) criteria.whenStart = new Date(whenStart);
    if (whenEnd) criteria.whenEnd = new Date(whenEnd);
    if (where) criteria.where = where;
    if (who) criteria.who = who;
    if (how) criteria.how = how;

    return getFilteredPosts(criteria);
  }, [selectedBoard, selectedEmotion, whenStart, whenEnd, where, who, how, getFilteredPosts]);

  const handleReset = () => {
    setFilters({});
    setWhenStart('');
    setWhenEnd('');
    setWhere('');
    setWho('');
    setHow('');
    setSelectedBoard(undefined);
    setSelectedEmotion(undefined);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-foreground">検索・フィルター</h1>
        </div>
      </div>

      {/* Search Form */}
      <div className="container py-6 max-w-2xl">
        <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
          {/* Board Category Filter */}
          <div className="mb-6">
            <label className="font-body font-semibold text-foreground block mb-3">
              掲示板
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedBoard(undefined)}
                className={`p-3 rounded-lg font-body font-semibold transition-all ${
                  selectedBoard === undefined
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                すべて
              </button>
              {BOARD_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedBoard(category)}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
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

          {/* Emotion Category Filter */}
          <div className="mb-6">
            <label className="font-body font-semibold text-foreground block mb-3">
              感情
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedEmotion(undefined)}
                className={`p-3 rounded-lg font-body font-semibold transition-all ${
                  selectedEmotion === undefined
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                すべて
              </button>
              {EMOTION_CATEGORIES.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`p-3 rounded-lg font-body font-semibold transition-all flex items-center gap-2 ${
                    selectedEmotion === emotion
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-lg">{EMOTION_ICONS[emotion]}</span>
                  {EMOTION_LABELS[emotion].split('ったこと')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="font-body font-semibold text-foreground block mb-2">
                日付から
              </label>
              <input
                type="date"
                value={whenStart}
                onChange={(e) => setWhenStart(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-body font-semibold text-foreground block mb-2">
                日付まで
              </label>
              <input
                type="date"
                value={whenEnd}
                onChange={(e) => setWhenEnd(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Where */}
          <div className="mb-6">
            <label className="font-body font-semibold text-foreground block mb-2">
              どこで（場所）
            </label>
            <input
              type="text"
              placeholder="キーワードで検索"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Who */}
          <div className="mb-6">
            <label className="font-body font-semibold text-foreground block mb-2">
              誰から（人物）
            </label>
            <input
              type="text"
              placeholder="キーワードで検索"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* How */}
          <div className="mb-6">
            <label className="font-body font-semibold text-foreground block mb-2">
              どんなふうに（感情・反応）
            </label>
            <input
              type="text"
              placeholder="キーワードで検索"
              value={how}
              onChange={(e) => setHow(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Reset Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            フィルターをリセット
          </Button>
        </div>

        {/* Results */}
        <div>
          <h2 className="font-subheading text-foreground mb-4">
            検索結果（{filteredPosts.length}件）
          </h2>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                条件に合う投稿がありません
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
