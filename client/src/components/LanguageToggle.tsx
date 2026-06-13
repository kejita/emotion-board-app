/**
 * LanguageToggle
 * 🌐 ボタンで日本語/英語を手動切り替えする共通コンポーネント
 */

import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { t } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const toggle = () => {
    i18n.changeLanguage(isJa ? 'en' : 'ja');
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 hover:bg-secondary rounded-lg transition-colors text-sm font-semibold text-foreground ${className}`}
      title={t('nav.toggleLanguage')}
      aria-label={t('nav.toggleLanguage')}
    >
      {isJa ? '🌐 EN' : '🌐 JP'}
    </button>
  );
}
