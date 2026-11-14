'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { pick, type Lang } from '@/lib/i18n'

const LangContext = createContext<Lang>('es')

/** Idioma para los componentes del cliente; lo pone el layout de cada idioma. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Atajo para textos fijos en componentes del cliente: const t = useT(); t('Hola', 'Hello'). */
export const useT = () => {
  const lang = useLang()
  return (es: string, en: string) => pick(lang, es, en)
}
