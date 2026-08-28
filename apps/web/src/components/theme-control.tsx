import { Moon, Monitor, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useTheme, type Theme } from './theme-provider';

const options: ReadonlyArray<Readonly<{ value: Theme; icon: typeof Sun }>> = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
];

export function ThemeControl() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  return (
    <fieldset className="theme-control">
      <legend>{t('theme.label')}</legend>
      <div className="theme-options">
        {options.map(({ value, icon: Icon }) => (
          <label key={value} className="theme-option">
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              onChange={() => setTheme(value)}
            />
            <Icon aria-hidden="true" size={16} />
            <span>{t(`theme.${value}`)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
