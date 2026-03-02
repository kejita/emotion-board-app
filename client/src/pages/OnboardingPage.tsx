/**
 * Onboarding Page
 * ユーザー登録画面 - 初回アクセス時にユーザー名・年齢・性別を登録
 * DBにユーザーを作成し、IDをローカルストレージに保存
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { User, AgeGroup, Gender, AGE_GROUP_LABELS, GENDER_LABELS } from '@/types/models';
import { trpc } from '@/lib/trpc';

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
  const [userName, setUserName] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
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
      // DBにユーザーを作成
      const result = await createUserMutation.mutateAsync({
        name: userName.trim(),
        age: AGE_TO_DB[selectedAge],
        gender: selectedGender,
      });

      // フロントエンドのUserオブジェクトを作成
      const newUser: User = {
        id: result.id,
        name: userName.trim(),
        age: selectedAge,
        gender: selectedGender,
        createdAt: new Date(),
      };

      setUser(newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('ユーザー登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-foreground mb-2">Emotion Board</h1>
          <p className="font-body-sm font-semibold text-muted-foreground italic mb-3">
            Write your feelings inside your head in your language
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Translate this page into your language using your browser&apos;s translation feature.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-sm">
          <h2 className="font-subheading text-foreground mb-6">プロフィール設定</h2>

          {/* User Name Input */}
          <div className="mb-8">
            <label className="font-body font-semibold text-foreground block mb-3">
              ユーザー名
            </label>
            <input
              type="text"
              placeholder="ニックネームを入力してください"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Age Selection */}
          <div className="mb-8">
            <label className="font-body font-semibold text-foreground block mb-3">
              年齢を選択してください
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
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

          {/* Gender Selection */}
          <div className="mb-8">
            <label className="font-body font-semibold text-foreground block mb-3">
              性別を選択してください
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(GENDER_LABELS) as Gender[]).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`p-3 rounded-lg font-body font-semibold transition-all ${
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

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full py-3 font-body font-semibold text-base"
            disabled={!userName.trim() || !selectedAge || !selectedGender || isSubmitting}
          >
            {isSubmitting ? '登録中...' : '始める'}
          </Button>

          {/* Info Text */}
          <p className="font-body-sm text-muted-foreground text-center mt-4">
            ※ ユーザー名はニックネーム（匿名）です。年齢と性別のみ記録されます。
          </p>
        </div>
      </div>
    </div>
  );
}
