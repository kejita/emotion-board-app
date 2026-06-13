/**
 * ProfileSetupModal
 * 投稿前にプロフィール未設定のユーザーに表示するモーダル
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { User, AgeGroup, Gender, COUNTRIES } from '@/types/models';
import { trpc } from '@/lib/trpc';
import { X } from 'lucide-react';

const AGE_GROUPS: AgeGroup[] = ['10s', '20s', '30s', '40s', '50plus'];
const GENDERS: Gender[] = ['male', 'female', 'other'];

const AGE_TO_DB: Record<AgeGroup, '10s' | '20s' | '30s' | '40s' | '50s+'> = {
  '10s': '10s',
  '20s': '20s',
  '30s': '30s',
  '40s': '40s',
  '50plus': '50s+',
};

interface ProfileSetupModalProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function ProfileSetupModal({ onComplete, onCancel }: ProfileSetupModalProps) {
  const { t, i18n } = useTranslation();
  const { setUser } = useApp();
  const [userName, setUserName] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserMutation = trpc.emotionBoard.createUser.useMutation();

  const handleSubmit = async () => {
    if (!userName.trim()) {
      alert(t('onboarding.nameRequired'));
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
      onComplete();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert(t('onboarding.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="profile-modal-title" className="font-subheading text-foreground">
              {t('onboarding.title')}
            </h2>
            <p className="font-body-sm text-muted-foreground mt-1">
              {t('onboarding.subtitle')}
            </p>
          </div>
          <button
            onClick={onCancel}
            aria-label={t('onboarding.close')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* User Name */}
          <div>
            <label htmlFor="modal-username" className="font-body font-semibold text-foreground block mb-2">
              {t('onboarding.username')} <span className="text-destructive">*</span>
            </label>
            <input
              id="modal-username"
              type="text"
              placeholder={t('onboarding.usernamePlaceholder')}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-required="true"
              className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Age */}
          <div role="group" aria-labelledby="modal-age-label">
            <p id="modal-age-label" className="font-body font-semibold text-foreground block mb-2">
              {t('onboarding.age')} <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  aria-pressed={selectedAge === age}
                  className={`p-2 rounded-lg font-body text-sm font-semibold transition-all ${
                    selectedAge === age
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {t(`age.${age}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div role="group" aria-labelledby="modal-gender-label">
            <p id="modal-gender-label" className="font-body font-semibold text-foreground block mb-2">
              {t('onboarding.gender')} <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setSelectedGender(gender)}
                  aria-pressed={selectedGender === gender}
                  className={`p-2 rounded-lg font-body text-sm font-semibold transition-all ${
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

          {/* Country (optional) */}
          <div>
            <label htmlFor="modal-country" className="font-body font-semibold text-foreground block mb-2">
              {t('onboarding.country')}
              <span className="ml-2 text-xs text-muted-foreground font-normal">{t('onboarding.optional')}</span>
            </label>
            <div className="relative">
              <select
                id="modal-country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">{t('onboarding.countryPlaceholder')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {i18n.language.startsWith('ja') ? `${c.name} / ${c.nameEn}` : c.nameEn}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                ▾
              </div>
            </div>
          </div>

          <p className="font-body-sm text-muted-foreground text-center">
            {t('onboarding.disclaimer')}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-background"
          >
            {t('onboarding.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!userName.trim() || !selectedAge || !selectedGender || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? t('onboarding.registering') : t('onboarding.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
