import { useTranslation } from 'react-i18next'

export function useCopy() {
  const { i18n } = useTranslation()
  return (ru: string, kk: string, en: string) =>
    i18n.language.startsWith('kk')
      ? kk
      : i18n.language.startsWith('en')
        ? en
        : ru
}
