/**
 * Profile Page
 * プロフィール画面 - ユーザー情報と自分の投稿履歴
 * ユーザー未登録の場合は登録を促すUIを表示
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { AGE_GROUP_LABELS, GENDER_LABELS, COUNTRIES } from '@/types/models';
import { ArrowLeft, LogOut, UserPlus } from 'lucide-react';
import PostCard from '@/components/PostCard';
import ProfileSetupModal from '@/components/ProfileSetupModal';

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, posts } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userPosts = user ? posts.filter((post) => post.userId === user.id) : [];

  const handleLogout = () => {
    if (confirm('ログアウトしますか？プロフィール情報が削除されます。')) {
      localStorage.removeItem('emotion_board_user_id');
      localStorage.removeItem('emotion_board_user_data');
      window.location.href = '/';
    }
  };

  // Get country display name
  const countryInfo = user?.country
    ? COUNTRIES.find((c) => c.code === user.country)
    : null;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Profile setup modal */}
      {showProfileModal && (
        <ProfileSetupModal
          onComplete={() => setShowProfileModal(false)}
          onCancel={() => setShowProfileModal(false)}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="ホームに戻る"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-foreground">プロフィール</h1>
        </div>
      </div>

      <div className="container py-6 max-w-2xl">
        {!user ? (
          /* Not registered yet */
          <div className="bg-card rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-subheading text-foreground mb-2">
              プロフィール未設定
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              ニックネームを設定すると、自分の投稿履歴を確認できます。
            </p>
            <Button
              onClick={() => setShowProfileModal(true)}
              className="w-full gap-2"
            >
              <UserPlus className="w-4 h-4" />
              プロフィールを設定する
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="w-full mt-3 bg-card"
            >
              ホームに戻る
            </Button>
          </div>
        ) : (
          <>
            {/* Profile Info */}
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

                {countryInfo && (
                  <div>
                    <p className="font-body-sm text-muted-foreground mb-1">国</p>
                    <p className="font-body text-foreground">
                      {countryInfo.flag} {countryInfo.nameEn} / {countryInfo.name}
                    </p>
                  </div>
                )}

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
                  <p className="font-body-sm text-muted-foreground mb-1">自分の投稿数</p>
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
                  className="w-full gap-2 text-destructive hover:text-destructive bg-card"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </Button>
              </div>
            </div>

            {/* My Posts History */}
            <div>
              <h2 className="font-subheading text-foreground mb-4">
                自分の投稿（{userPosts.length}件）
              </h2>
              {userPosts.length === 0 ? (
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
                  {userPosts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
