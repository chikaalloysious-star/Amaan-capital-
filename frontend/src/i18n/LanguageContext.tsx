import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  translations,
  type Language,
} from "./translations";

type Translation = (typeof translations)[Language];

type LanguageContextType = {
  language: Language;
  setLanguage: (nextLanguage: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

const STORAGE_KEY = "amaan_language";

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (
    saved === "English" ||
    saved === "French" ||
    saved === "German" ||
    saved === "Italian" ||
    saved === "Spanish" ||
    saved === "Filipino"
  ) {
    return saved;
  }

  return "English";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
