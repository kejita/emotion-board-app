/**
 * ProfileSetupModal
 * 投稿前にプロフィール未設定のユーザーに表示するモーダル
 * ニックネーム・年齢・性別・国を設定してから投稿を続行できる
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { User, AgeGroup, Gender, AGE_GROUP_LABELS, GENDER_LABELS, COUNTRIES } from '@/types/models';
import { trpc } from '@/lib/trpc';
import { X } from 'lucide-react';

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
  const { setUser } = useApp();
  const [userName, setUserName] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserMutation = trpc.emotionBoard.createUser.useMutation();

  const handleSubmit = async () => {
    if (!userName.trim()) {
      alert('ユーザー名を入力してください');
      return;
    }
    if (!selectedAge || !selectedGender) {
      alert('年齢と性別を選択してください');
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
      alert('ユーザー登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Backdrop */
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
              はじめに
            </h2>
            <p className="font-body-sm text-muted-foreground mt-1">
              投稿前にニックネームを設定してください
            </p>
          </div>
          <button
            onClick={onCancel}
            aria-label="閉じる"
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
              ユーザー名 <span className="text-destructive">*</span>
            </label>
            <input
              id="modal-username"
              type="text"
              placeholder="ニックネームを入力してください"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-required="true"
              className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Age */}
          <div role="group" aria-labelledby="modal-age-label">
            <p id="modal-age-label" className="font-body font-semibold text-foreground block mb-2">
              年齢 <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`p-2 rounded-lg font-body text-sm font-semibold transition-all ${
                    selectedAge === age
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {AGE_GROUP_LABELS[age]}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div role="group" aria-labelledby="modal-gender-label">
            <p id="modal-gender-label" className="font-body font-semibold text-foreground block mb-2">
              性別 <span className="text-destructive">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(GENDER_LABELS) as Gender[]).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setSelectedGender(gender)}
                  className={`p-2 rounded-lg font-body text-sm font-semibold transition-all ${
                    selectedGender === gender
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {GENDER_LABELS[gender]}
                </button>
              ))}
            </div>
          </div>

          {/* Country (optional) */}
          <div>
            <label htmlFor="modal-country" className="font-body font-semibold text-foreground block mb-2">
              国
              <span className="ml-2 text-xs text-muted-foreground font-normal">任意</span>
            </label>
            <div className="relative">
              <select
                id="modal-country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">選択してください</option>
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

          <p className="font-body-sm text-muted-foreground text-center">
            ※ ニックネーム（匿名）です。年齢・性別・国のみ記録されます。
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
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!userName.trim() || !selectedAge || !selectedGender || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '登録中...' : '設定して投稿へ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
