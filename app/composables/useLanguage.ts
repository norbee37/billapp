export const useLanguage = () => {
  const language = useState<'en' | 'de' | 'hu'>('language', () => 'en')

  const setLanguage = (lang: 'en' | 'de' | 'hu') => {
    language.value = lang
    if (process.client) {
      localStorage.setItem('billapp_language', lang)
    }
  }

  // Load from localStorage on client
  if (process.client && !language.value) {
    const stored = localStorage.getItem('billapp_language') as 'en' | 'de' | 'hu' | null
    if (stored) {
      language.value = stored
    }
  }

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'hu', label: 'Magyar', flag: '🇭🇺' }
  ]

  const currentLanguage = computed(() => 
    languageOptions.find(l => l.value === language.value) || languageOptions[0]
  )

  return {
    language,
    setLanguage,
    languageOptions,
    currentLanguage
  }
}
