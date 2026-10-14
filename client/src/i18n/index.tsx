import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dictionary } from "./en";
import { am } from "./am";
import { om } from "./om";

export type Lang = "en" | "am" | "om";

const dictionaries: Record<Lang, Dictionary> = { en, am, om };

export const languages: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "am", label: "አማርኛ" },
  { id: "om", label: "Afaan Oromoo" },
];

const STORAGE_KEY = "baata-lang";

type I18nValue = { lang: Lang; setLang: (lang: Lang) => void; t: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

function isLang(value: string | null): value is Lang {
  return value === "en" || value === "am" || value === "om";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) return stored;
    } catch { /* storage unavailable */ }
    return "en";
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={compact ? "lang-switch lang-switch--compact" : "lang-switch"} role="group" aria-label="Language / ቋንቋ / Afaan">
      {languages.map(item => (
        <button
          key={item.id}
          type="button"
          className={lang === item.id ? "lang-option lang-option--active" : "lang-option"}
          aria-pressed={lang === item.id}
          onClick={() => setLang(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
