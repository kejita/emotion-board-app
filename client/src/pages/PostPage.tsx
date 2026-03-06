/**
 * Post Page
 * 投稿作成画面 - 5W1Hフォーム
 * DBに投稿を保存
 * ユーザー未登録の場合はProfileSetupModalを表示してから投稿
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { BoardCategory, EmotionCategory, BOARD_LABELS, EMOTION_LABELS, EMOTION_ICONS } from '@/types/models';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSetupModal from '@/components/ProfileSetupModal';

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

  // Profile setup modal state for first-time users
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingPost, setPendingPost] = useState<PendingPostData | null>(null);

  const submitPost = async (postData: PendingPostData) => {
    setIsSubmitting(true);
    try {
      await addPost({
        boardCategory: postData.boardCategory,
        emotionCategory: postData.emotionCategory,
        country: '', // auto-filled from user profile in AppContext
        when: postData.when,
        where: postData.where,
        who: postData.who,
        what: postData.what,
        how: postData.how,
      });
      toast.success('投稿しました！');
      setLocation('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('投稿の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!what.trim()) {
      toast.error('「何を」は必須です');
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

    // If user not registered yet, show profile setup modal first
    if (!user) {
      setPendingPost(postData);
      setShowProfileModal(true);
      return;
    }

    await submitPost(postData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile setup modal for first-time users */}
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
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-foreground">新しい投稿</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="container py-6 max-w-2xl">
        {/* Required notice */}
        <p className="font-body-sm text-muted-foreground mb-6">
          <span className="text-destructive font-semibold">*</span> は必須項目です。それ以外は任意入力です。
        </p>

        {/* Board Category Selection */}
        <div className="mb-8" role="group" aria-labelledby="board-label">
          <p id="board-label" className="font-subheading text-foreground block mb-3">
            掲示板を選択
          </p>
          <div className="grid grid-cols-2 gap-3">
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

        {/* Emotion Category Selection */}
        <div className="mb-8" role="group" aria-labelledby="emotion-label">
          <p id="emotion-label" className="font-subheading text-foreground block mb-3">
            感情を選択
          </p>
          <div className="grid grid-cols-2 gap-3">
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
                <span className="text-xl">{EMOTION_ICONS[emotion]}</span>
                {EMOTION_LABELS[emotion]}
              </button>
            ))}
          </div>
        </div>

        {/* When */}
        <div className="mb-6">
          <label htmlFor="post-when" className="font-body font-semibold text-foreground block mb-2">
            いつ（日時）<span className="ml-2 text-xs text-muted-foreground font-normal">任意</span>
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
            どこで（場所）<span className="ml-2 text-xs text-muted-foreground font-normal">任意</span>
          </label>
          <input
            id="post-where"
            type="text"
            placeholder="例：会社、家、学校"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Who */}
        <div className="mb-6">
          <label htmlFor="post-who" className="font-body font-semibold text-foreground block mb-2">
            誰から（人物）<span className="ml-2 text-xs text-muted-foreground font-normal">任意</span>
          </label>
          <input
            id="post-who"
            type="text"
            placeholder="例：上司、友人、家族"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* What (Required) */}
        <div className="mb-6">
          <label htmlFor="post-what" className="font-body font-semibold text-foreground block mb-2">
            何を（内容）<span className="text-destructive">*</span>
          </label>
          <textarea
            id="post-what"
            placeholder="言われたことや経験した出来事を詳しく書いてください"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            aria-required="true"
            rows={5}
            className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="font-body-sm text-muted-foreground mt-1">
            {what.length} / 1000文字
          </p>
        </div>

        {/* How */}
        <div className="mb-8">
          <label htmlFor="post-how" className="font-body font-semibold text-foreground block mb-2">
            どんなふうに（感情・反応）<span className="ml-2 text-xs text-muted-foreground font-normal">任意</span>
          </label>
          <textarea
            id="post-how"
            placeholder="その時の気持ちや反応を書いてください"
            value={how}
            onChange={(e) => setHow(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation('/')}
            className="flex-1 bg-card"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !what.trim()}
            className="flex-1"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </div>
      </form>
    </div>
  );
}
