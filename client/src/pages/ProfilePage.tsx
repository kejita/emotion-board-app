/**
 * Profile Page
 * プロフィール画面 - ユーザー情報と投稿履歴
 */

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { AGE_GROUP_LABELS, GENDER_LABELS } from '@/types/models';
import { ArrowLeft, LogOut } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { storage } from '@/lib/storage';

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, posts, setUser } = useApp();

  if (!user) {
    return null;
  }

  const userPosts = posts.filter((post) => post.userId === user.id);

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      storage.clearUser();
      storage.clearPosts();
      setLocation('/');
      window.location.reload();
    }
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
          <h1 className="font-heading text-foreground">プロフィール</h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="container py-6 max-w-2xl">
        <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-subheading text-foreground mb-4">ユーザー情報</h2>

          <div className="space-y-4">
            <div>
              <p className="font-body-sm text-muted-foreground mb-1">ユーザー名</p>
              <p className="font-body text-foreground font-semibold">
                {user.name}
              </p>
            </div>

            <div>
              <p className="font-body-sm text-muted-foreground mb-1">年齢</p>
              <p className="font-body text-foreground">
                {AGE_GROUP_LABELS[user.age]}
              </p>
            </div>

            <div>
              <p className="font-body-sm text-muted-foreground mb-1">性別</p>
              <p className="font-body text-foreground">
                {GENDER_LABELS[user.gender]}
              </p>
            </div>

            <div>
              <p className="font-body-sm text-muted-foreground mb-1">登録日</p>
              <p className="font-body text-foreground">
                {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="font-body-sm text-muted-foreground mb-1">投稿数</p>
              <p className="font-body text-foreground">{userPosts.length}件</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-body-sm text-muted-foreground mb-3">
              ※ ユーザー名はニックネーム（匿名）です。年齢と性別のみ記録されています。
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          </div>
        </div>

        {/* Posts History */}
        <div>
          <h2 className="font-subheading text-foreground mb-4">
            投稿履歴（{userPosts.length}件）
          </h2>
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                投稿がまだありません
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
