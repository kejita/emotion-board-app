/**
 * Onboarding Page
 * ユーザー登録画面 - 初回アクセス時にユーザー名・年齢・性別・国を登録
 * DBにユーザーを作成し、IDをローカルストレージに保存
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { User, AgeGroup, Gender, AGE_GROUP_LABELS, GENDER_LABELS, COUNTRIES } from '@/types/models';
import { trpc } from '@/lib/trpc';
import CreatedBy from '@/components/CreatedBy';

// DBのage enumに合わせたマッピング
const AGE_TO_DB: Record<AgeGroup, '10s' | '20s' | '30s' | '40s' | '50s+'> = {
  '10s': '10s',
  '20s': '20s',
  '30s': '30s',
  '40s': '40s',
  '50plus': '50s+',
};

export default function OnboardingPage() {
  const { setUser } = useApp();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserMutation = trpc.emotionBoard.createUser.useMutation();

  const handleSubmit = async () => {
    if (!userName.trim()) {
      alert(t('onboarding.usernameRequired'));
      return;
    }
    if (!selectedAge || !selectedGender) {
      alert(t('onboarding.ageGenderRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUserMutation.mutateAsync({
        name: userName.trim(),
        age: AGE_TO_DB[selectedAge],
        gender: selectedGender,
        country: selectedCountry,
      });

      const newUser: User = {
        id: result.id,
        name: userName.trim(),
        age: selectedAge,
        gender: selectedGender,
        country: selectedCountry,
        createdAt: new Date(),
      };

      setUser(newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert(t('onboarding.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-foreground mb-2">{t('app.title')}</h1>
          <p className="font-body-sm font-semibold text-muted-foreground italic mb-3">
            {t('app.subtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-sm">
          <h2 className="font-subheading text-foreground mb-6">{t('onboarding.title')}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t('onboarding.subtitle')}</p>

          {/* User Name Input */}
          <div className="mb-8">
            <label htmlFor="username" className="font-body font-semibold text-foreground block mb-3">
              {t('onboarding.usernameLabel')}
            </label>
            <input
              id="username"
              type="text"
              placeholder={t('onboarding.usernamePlaceholder')}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-required="true"
              className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Age Selection */}
          <div className="mb-8" role="group" aria-labelledby="age-label">
            <p id="age-label" className="font-body font-semibold text-foreground block mb-3">
              {t('onboarding.ageLabel')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  aria-pressed={selectedAge === age}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
                    selectedAge === age
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {t(`age.${age === '50plus' ? '50plus' : age}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mb-8" role="group" aria-labelledby="gender-label">
            <p id="gender-label" className="font-body font-semibold text-foreground block mb-3">
              {t('onboarding.genderLabel')}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(GENDER_LABELS) as Gender[]).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  aria-pressed={selectedGender === gender}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
                    selectedGender === gender
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {t(`gender.${gender}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Country Selection */}
          <div className="mb-8">
            <label htmlFor="country" className="font-body font-semibold text-foreground block mb-3">
              {t('onboarding.countryLabel')}
              <span className="ml-2 text-xs text-muted-foreground font-normal">{t('onboarding.countryOptional')}</span>
            </label>
            <div className="relative">
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">{t('onboarding.countryPlaceholder')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameEn} / {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                ▾
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full py-3 font-body font-semibold text-base"
            disabled={!userName.trim() || !selectedAge || !selectedGender || isSubmitting}
          >
            {isSubmitting ? t('onboarding.submitting') : t('onboarding.submit')}
          </Button>

          {/* Info Text */}
          <p className="font-body-sm text-muted-foreground text-center mt-4">
            {t('onboarding.disclaimer')}
          </p>
        </div>

        {/* Created By */}
        <CreatedBy />
      </div>
    </div>
  );
}
