/**
 * Profile Page
 * プロフィール画面 - ユーザー情報と自分の投稿履歴
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { AGE_GROUP_LABELS, GENDER_LABELS, COUNTRIES } from '@/types/models';
import { ArrowLeft, LogOut, UserPlus } from 'lucide-react';
import PostCard from '@/components/PostCard';
import ProfileSetupModal from '@/components/ProfileSetupModal';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, posts, isLoading } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userPosts = user ? posts.filter((post) => post.userId === user.id) : [];

  const handleLogout = () => {
    if (confirm(t('profile.logoutConfirm'))) {
      localStorage.removeItem('emotion_board_user_id');
      localStorage.removeItem('emotion_board_user_data');
      window.location.href = '/';
    }
  };

  const countryInfo = user?.country
    ? COUNTRIES.find((c) => c.code === user.country)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
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
            aria-label={t('profile.backLabel')}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-foreground">{t('profile.title')}</h1>
        </div>
      </div>

      <main className="container py-6 max-w-2xl">
        {!user ? (
          <div className="bg-card rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-subheading text-foreground mb-2">
              {t('profile.notSet')}
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              {t('profile.notSetDesc')}
            </p>
            <Button
              onClick={() => setShowProfileModal(true)}
              className="w-full gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {t('profile.setup')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="w-full mt-3 bg-card"
            >
              {t('profile.backToHome')}
            </Button>
          </div>
        ) : (
          <>
            {/* Profile Info */}
            <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-subheading text-foreground mb-4">{t('profile.userInfo')}</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-body-sm text-muted-foreground mb-1">{t('profile.username')}</p>
                  <p className="font-body text-foreground font-semibold">{user.name}</p>
                </div>

                <div>
                  <p className="font-body-sm text-muted-foreground mb-1">{t('profile.age')}</p>
                  <p className="font-body text-foreground">
                    {t(`age.${user.age}`, AGE_GROUP_LABELS[user.age] ?? user.age)}
                  </p>
                </div>

                <div>
                  <p className="font-body-sm text-muted-foreground mb-1">{t('profile.gender')}</p>
                  <p className="font-body text-foreground">
                    {t(`gender.${user.gender}`, GENDER_LABELS[user.gender] ?? user.gender)}
                  </p>
                </div>

                {countryInfo && (
                  <div>
                    <p className="font-body-sm text-muted-foreground mb-1">{t('profile.country')}</p>
                    <p className="font-body text-foreground">
                      {countryInfo.flag} {i18n.language.startsWith('ja') ? countryInfo.name : countryInfo.nameEn}
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-body-sm text-muted-foreground mb-1">{t('profile.registeredAt')}</p>
                  <p className="font-body text-foreground">
                    {new Date(user.createdAt).toLocaleDateString(i18n.language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="font-body-sm text-muted-foreground mb-1">{t('profile.postCount')}</p>
                  <p className="font-body text-foreground">
                    {userPosts.length}{t('profile.postCountUnit')}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-body-sm text-muted-foreground mb-3">
                  {t('profile.disclaimer')}
                </p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:text-destructive bg-card"
                >
                  <LogOut className="w-4 h-4" />
                  {t('profile.logout')}
                </Button>
              </div>
            </div>

            {/* My Posts */}
            <div>
              <h2 className="font-subheading text-foreground mb-4">
                {t('profile.myPosts', { count: userPosts.length })}
              </h2>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-body text-muted-foreground mb-4">
                    {t('profile.noPosts')}
                  </p>
                  <Button onClick={() => setLocation('/post')}>
                    {t('profile.firstPost')}
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
      </main>
    </div>
  );
}
