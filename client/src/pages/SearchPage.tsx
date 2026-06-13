/**
 * Search Page
 * フィルター検索画面
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, FilterCriteria, EMOTION_ICONS } from '@/types/models';
import { ArrowLeft } from 'lucide-react';
import PostCard from '@/components/PostCard';
import LanguageToggle from '@/components/LanguageToggle';

const BOARD_CATEGORIES: BoardCategory[] = ['work', 'family', 'school', 'other'];
const EMOTION_CATEGORIES: EmotionCategory[] = ['happy', 'sad', 'tired', 'angry'];

export default function SearchPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { getFilteredPosts } = useApp();

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
            aria-label={t('profile.backLabel')}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-foreground flex-1">{t('search.title')}</h1>
          <LanguageToggle />
        </div>
      </div>

      <main className="container py-6 max-w-2xl">
        <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
          {/* Board Category Filter */}
          <div className="mb-6" role="group" aria-labelledby="search-board-label">
            <p id="search-board-label" className="font-body font-semibold text-foreground block mb-3">
              {t('search.board')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedBoard(undefined)}
                aria-pressed={selectedBoard === undefined}
                className={`p-3 rounded-lg font-body font-semibold transition-all ${
                  selectedBoard === undefined
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {t('search.all')}
              </button>
              {BOARD_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedBoard(category)}
                  aria-pressed={selectedBoard === category}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
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

          {/* Emotion Category Filter */}
          <div className="mb-6" role="group" aria-labelledby="search-emotion-label">
            <p id="search-emotion-label" className="font-body font-semibold text-foreground block mb-3">
              {t('search.emotion')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedEmotion(undefined)}
                aria-pressed={selectedEmotion === undefined}
                className={`p-3 rounded-lg font-body font-semibold transition-all ${
                  selectedEmotion === undefined
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {t('search.all')}
              </button>
              {EMOTION_CATEGORIES.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion)}
                  aria-pressed={selectedEmotion === emotion}
                  className={`p-3 rounded-lg font-body font-semibold transition-all flex items-center gap-2 ${
                    selectedEmotion === emotion
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-lg">{EMOTION_ICONS[emotion]}</span>
                  {t(`emotions.${emotion}Short`)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="search-date-from" className="font-body font-semibold text-foreground block mb-2">
                {t('search.dateFrom')}
              </label>
              <input
                id="search-date-from"
                type="date"
                value={whenStart}
                onChange={(e) => setWhenStart(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="search-date-to" className="font-body font-semibold text-foreground block mb-2">
                {t('search.dateTo')}
              </label>
              <input
                id="search-date-to"
                type="date"
                value={whenEnd}
                onChange={(e) => setWhenEnd(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Where */}
          <div className="mb-6">
            <label htmlFor="search-where" className="font-body font-semibold text-foreground block mb-2">
              {t('search.where')}
            </label>
            <input
              id="search-where"
              type="text"
              placeholder={t('search.wherePlaceholder')}
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Who */}
          <div className="mb-6">
            <label htmlFor="search-who" className="font-body font-semibold text-foreground block mb-2">
              {t('search.who')}
            </label>
            <input
              id="search-who"
              type="text"
              placeholder={t('search.whoPlaceholder')}
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* How */}
          <div className="mb-6">
            <label htmlFor="search-how" className="font-body font-semibold text-foreground block mb-2">
              {t('search.how')}
            </label>
            <input
              id="search-how"
              type="text"
              placeholder={t('search.howPlaceholder')}
              value={how}
              onChange={(e) => setHow(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            {t('search.reset')}
          </Button>
        </div>

        {/* Results */}
        <div>
          <h2 className="font-subheading text-foreground mb-4">
            {t('search.results', { count: filteredPosts.length })}
          </h2>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                {t('search.noResults')}
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
      </main>
    </div>
  );
}
