/**
 * Post Card Component
 * 投稿を表示するカードコンポーネント
 */

import React from 'react';
import { Post, EMOTION_ICONS, EMOTION_COLORS, EMOTION_LABELS } from '@/types/models';
import { Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { deletePost } = useApp();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <p className="font-body-sm text-muted-foreground">
              {formatDate(post.when)}
            </p>
          </div>
        </div>
        <button
          onClick={() => deletePost(post.id)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
          title="削除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 5W1H Information */}
      <div className="space-y-2 mb-4">
        {post.where && (
          <div className="flex gap-2">
            <span className="font-body-sm font-semibold text-muted-foreground min-w-12">
              どこで：
            </span>
            <span className="font-body-sm text-foreground">{post.where}</span>
          </div>
        )}
        {post.who && (
          <div className="flex gap-2">
            <span className="font-body-sm font-semibold text-muted-foreground min-w-12">
              誰から：
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
        <div className="flex gap-2 text-sm">
          <span className="font-body-sm font-semibold text-muted-foreground min-w-12">
            どんなふうに：
          </span>
          <span className="font-body-sm text-muted-foreground italic">{post.how}</span>
        </div>
      )}
    </div>
  );
}
