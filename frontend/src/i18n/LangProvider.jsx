import { useMemo } from 'react';
import { LangContext } from './index';

const SITE_LANG = import.meta.env.VITE_SITE_LANG === 'pt' ? 'pt' : 'es';

export function LangProvider({ children }) {
  const value = useMemo(
    () => ({
      lang: SITE_LANG,
      setLang: () => {},
      isFixed: true,
    }),
    []
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
