/**
 * Post Page
 * 投稿作成画面 - 5W1Hフォーム
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, EMOTION_ICONS } from '@/types/models';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import LanguageToggle from '@/components/LanguageToggle';

const BOARD_CATEGORIES: BoardCategory[] = ['work', 'family', 'school', 'other'];
const EMOTION_CATEGORIES: EmotionCategory[] = ['happy', 'sad', 'tired', 'angry'];

type PendingPostData = {
  boardCategory: BoardCategory;
  emotionCategory: EmotionCategory;
  when: Date;
  where: string;
  who: string;
  what: string;
  how: string;
};

export default function PostPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, addPost } = useApp();

  const [selectedBoard, setSelectedBoard] = useState<BoardCategory>('work');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCategory>('happy');
  const [when, setWhen] = useState<string>(new Date().toISOString().split('T')[0]);
  const [where, setWhere] = useState('');
  const [who, setWho] = useState('');
  const [what, setWhat] = useState('');
  const [how, setHow] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingPost, setPendingPost] = useState<PendingPostData | null>(null);

  const submitPost = async (postData: PendingPostData) => {
    setIsSubmitting(true);
    try {
      await addPost({
        boardCategory: postData.boardCategory,
        emotionCategory: postData.emotionCategory,
        country: '',
        when: postData.when,
        where: postData.where,
        who: postData.who,
        what: postData.what,
        how: postData.how,
      });
      toast.success(t('post.successToast'));
      setLocation('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error(t('post.errorToast'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!what.trim()) {
      toast.error(t('post.whatRequired'));
      return;
    }

    const postData: PendingPostData = {
      boardCategory: selectedBoard,
      emotionCategory: selectedEmotion,
      when: new Date(when),
      where,
      who,
      what,
      how,
    };

    if (!user) {
      setPendingPost(postData);
      setShowProfileModal(true);
      return;
    }

    await submitPost(postData);
  };

  return (
    <div className="min-h-screen bg-background">
      {showProfileModal && (
        <ProfileSetupModal
          onComplete={() => {
            setShowProfileModal(false);
            if (pendingPost) submitPost(pendingPost);
          }}
          onCancel={() => {
            setShowProfileModal(false);
            setPendingPost(null);
          }}
        />
      )}

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
          <h1 className="font-heading text-foreground flex-1">{t('post.title')}</h1>
          <LanguageToggle />
        </div>
      </div>

      {/* Form */}
      <main>
        <form onSubmit={handleSubmit} className="container py-6 max-w-2xl">
          <p className="font-body-sm text-muted-foreground mb-6">
            <span className="text-destructive font-semibold">{t('post.requiredMark')}</span>{t('post.required')}
          </p>

          {/* Board Category */}
          <div className="mb-8" role="group" aria-labelledby="board-label">
            <p id="board-label" className="font-subheading text-foreground block mb-3">
              {t('post.selectBoard')}
            </p>
            <div className="grid grid-cols-2 gap-3">
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

          {/* Emotion Category */}
          <div className="mb-8" role="group" aria-labelledby="emotion-label">
            <p id="emotion-label" className="font-subheading text-foreground block mb-3">
              {t('post.selectEmotion')}
            </p>
            <div className="grid grid-cols-2 gap-3">
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
                  <span className="text-xl">{EMOTION_ICONS[emotion]}</span>
                  {t(`emotions.${emotion}`)}
                </button>
              ))}
            </div>
          </div>

          {/* When */}
          <div className="mb-6">
            <label htmlFor="post-when" className="font-body font-semibold text-foreground block mb-2">
              {t('post.when')}<span className="ml-2 text-xs text-muted-foreground font-normal">{t('post.optional')}</span>
            </label>
            <input
              id="post-when"
              type="date"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Where */}
          <div className="mb-6">
            <label htmlFor="post-where" className="font-body font-semibold text-foreground block mb-2">
              {t('post.where')}<span className="ml-2 text-xs text-muted-foreground font-normal">{t('post.optional')}</span>
            </label>
            <input
              id="post-where"
              type="text"
              placeholder={t('post.wherePlaceholder')}
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Who */}
          <div className="mb-6">
            <label htmlFor="post-who" className="font-body font-semibold text-foreground block mb-2">
              {t('post.who')}<span className="ml-2 text-xs text-muted-foreground font-normal">{t('post.optional')}</span>
            </label>
            <input
              id="post-who"
              type="text"
              placeholder={t('post.whoPlaceholder')}
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* What (Required) */}
          <div className="mb-6">
            <label htmlFor="post-what" className="font-body font-semibold text-foreground block mb-2">
              {t('post.what')}<span className="text-destructive">{t('post.requiredMark')}</span>
            </label>
            <textarea
              id="post-what"
              placeholder={t('post.whatPlaceholder')}
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              aria-required="true"
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="font-body-sm text-muted-foreground mt-1">
              {t('post.charCount', { count: what.length })}
            </p>
          </div>

          {/* How */}
          <div className="mb-8">
            <label htmlFor="post-how" className="font-body font-semibold text-foreground block mb-2">
              {t('post.how')}<span className="ml-2 text-xs text-muted-foreground font-normal">{t('post.optional')}</span>
            </label>
            <textarea
              id="post-how"
              placeholder={t('post.howPlaceholder')}
              value={how}
              onChange={(e) => setHow(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/')}
              className="flex-1 bg-card"
            >
              {t('post.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !what.trim()}
              className="flex-1"
            >
              {isSubmitting ? t('post.submitting') : t('post.submit')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
