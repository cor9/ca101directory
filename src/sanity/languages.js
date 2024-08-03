const languages = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'zh', title: '简体中文' },
]

const i18n = {
  languages,
  base: languages.find((item) => item.isDefault).id,
}

const googleTranslateLanguages = languages.map(({ id, title }) => ({ id, title }))

export { i18n, googleTranslateLanguages }
