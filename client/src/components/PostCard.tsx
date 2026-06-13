/**
 * Post Card Component
 * 投稿を表示するカードコンポーネント
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, EMOTION_ICONS, EMOTION_COLORS, getCountryDisplay } from '@/types/models';
import { Trash2, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { t, i18n } = useTranslation();
  const { deletePost, toggleLike, user } = useApp();
  const isOwner = user?.id === post.userId;
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm(t('post.deleteConfirm'))) return;
    try {
      await deletePost(post.id);
      toast.success(t('post.deleteSuccess'));
    } catch (error) {
      toast.error(t('post.deleteError'));
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error(t('post.likeLoginRequired'));
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(post.id);
    } catch (error) {
      toast.error(t('post.likeError'));
    } finally {
      setIsLiking(false);
    }
  };

  const emotionColor = EMOTION_COLORS[post.emotionCategory];
  const emotionIcon = EMOTION_ICONS[post.emotionCategory];

  return (
    <div
      className="bg-card rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: emotionColor }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emotionIcon}</span>
          <div>
            <p className="font-body-sm font-semibold text-foreground">
              {t(`emotions.${post.emotionCategory}`)}
            </p>
            <p className="font-body-sm text-muted-foreground">
              {formatDate(post.when)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-body-sm">
            {post.country ? getCountryDisplay(post.country) : '🌍'}
          </span>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
              title={t('post.deleteLabel')}
              aria-label={t('post.deleteLabel')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5W1H Information */}
      <div className="space-y-2 mb-4">
        {post.where && (
          <div className="flex gap-2">
            <span className="font-body-sm font-semibold text-muted-foreground min-w-16">
              {t('post.whereLabel')}
            </span>
            <span className="font-body-sm text-foreground">{post.where}</span>
          </div>
        )}
        {post.who && (
          <div className="flex gap-2">
            <span className="font-body-sm font-semibold text-muted-foreground min-w-16">
              {t('post.whoLabel')}
            </span>
            <span className="font-body-sm text-foreground">{post.who}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mb-3">
        <p className="font-body text-foreground leading-relaxed">{post.what}</p>
      </div>

      {/* How */}
      {post.how && (
        <div className="flex gap-2 text-sm mb-3">
          <span className="font-body-sm font-semibold text-muted-foreground min-w-16">
            {t('post.howLabel')}
          </span>
          <span className="font-body-sm text-muted-foreground">{post.how}</span>
        </div>
      )}

      {/* Footer: Author + Like */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="font-body-sm text-muted-foreground text-xs">
          👤 {post.userName ?? t('anonymous')}
        </span>
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            post.isLiked
              ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
              : 'bg-secondary text-muted-foreground hover:bg-rose-50 hover:text-rose-400'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              post.isLiked ? 'fill-rose-500 scale-110' : ''
            } ${isLiking ? 'animate-pulse' : ''}`}
          />
          <span>{post.likeCount ?? 0}</span>
        </button>
      </div>
    </div>
  );
}
