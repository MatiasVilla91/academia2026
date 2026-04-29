import { createContext, useContext } from 'react';
import es from './es';
import pt from './pt';

const dicts = { es, pt };

export const LangContext = createContext({ lang: 'es', setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useContext(LangContext);
  const dict = dicts[lang] || dicts.es;
  return (key) => {
    const parts = key.split('.');
    let val = dict;
    for (const part of parts) val = val?.[part];
    return typeof val === 'string' ? val : key;
  };
}
