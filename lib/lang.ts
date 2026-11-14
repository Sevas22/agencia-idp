import 'server-only'
import { cache } from 'react'
import { pick, type Lang } from './i18n'

/**
 * Idioma de la petición actual para los componentes del servidor. El layout, la página y
 * generateMetadata de /en/ lo marcan con setLang('en'); todo lo demás lee getLang().
 * React cache vive solo durante una petición, así que no se mezcla entre visitantes.
 */
const store = cache(() => ({ lang: 'es' as Lang }))

export const setLang = (lang: Lang) => {
  store().lang = lang
}

export const getLang = () => store().lang

/** Atajo para textos fijos: t('Hola', 'Hello'). */
export const t = (es: string, en: string) => pick(getLang(), es, en)
